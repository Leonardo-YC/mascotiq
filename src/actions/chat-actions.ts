"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db/index";
import { chatUsage, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function sendChatMessage(chatHistory: { role: string, parts: { text: string }[] }[], newMessage: string) {
  try {
    if (!process.env.GEMINI_API_KEY) throw new Error("La API Key de Gemini no está configurada.");

    // 1. Identificar al usuario (Logueado o Visitante por Cookie)
    const user = await currentUser();
    const cookieStore = await cookies();
    let identifier = user?.id;

    if (!identifier) {
      let guestId = cookieStore.get("mascotiq_guest_id")?.value;
      if (!guestId) {
        guestId = `guest_${Math.random().toString(36).substr(2, 9)}`;
        cookieStore.set("mascotiq_guest_id", guestId, { maxAge: 60 * 60 * 24 }); // 1 día
      }
      identifier = guestId;
    }

    // 2. Determinar el límite según su rol
    let limit = 4; // Visitante
    if (user) {
      limit = 15; // Registrado Gratis
      const activeSub = await db.select().from(subscriptions).where(eq(subscriptions.userId, user.id)).limit(1);
      if (activeSub.length > 0 && activeSub[0].status === 'active') {
        limit = 30; // Suscriptor Premium
      }
    }

    // 3. Consultar y actualizar Uso en BD
    let usage = await db.select().from(chatUsage).where(eq(chatUsage.identifier, identifier)).limit(1);
    
    if (usage.length === 0) {
      const [newUsage] = await db.insert(chatUsage).values({ identifier, messageCount: 1 }).returning();
      usage = [newUsage];
    } else {
      // Si pasó 1 día, resetear contador (Lógica simple)
      const lastReset = new Date(usage[0].lastResetDate);
      const now = new Date();
      if (now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000) {
        await db.update(chatUsage).set({ messageCount: 1, lastResetDate: now }).where(eq(chatUsage.identifier, identifier));
      } else {
        if (usage[0].messageCount >= limit) {
          return { success: false, error: user ? "Límite de mensajes alcanzado. Regresa mañana o actualiza tu plan." : "Crea tu cuenta gratis para seguir chateando." };
        }
        await db.update(chatUsage).set({ messageCount: usage[0].messageCount + 1 }).where(eq(chatUsage.identifier, identifier));
      }
    }

    // 4. Invocar a Gemini
    const systemPrompt = `
      Eres el Asistente Nutricional IA exclusivo de 'Mascotiq'.
      REGLAS ESTRICTAS:
      1. NUNCA des diagnósticos médicos definitivos.
      2. Si el usuario describe síntomas de enfermedad clínica, DEBES recomendarle ir a un veterinario presencial inmediatamente.
      3. Sé empático, profesional y formatea tus respuestas con viñetas.
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction: systemPrompt });
    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(newMessage);

    return { success: true, text: result.response.text() };

  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes("Quota")) {
      return { success: false, error: "El servicio está temporalmente saturado. Intenta de nuevo." };
    }
    return { success: false, error: "Mi conexión está fallando. Intenta de nuevo en unos minutos." };
  }
}