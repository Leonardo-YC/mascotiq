"use server";
import { db } from "@/lib/db/index";
import { futureNotifications } from "@/lib/db/schema";
import { z } from "zod";

const emailSchema = z.string().email("Formato de correo inválido");

export async function saveFutureNotificationLead(email: string, petName: string, species: string, birthDateStr: string) {
  try {
    const validEmail = emailSchema.parse(email);
    if (!petName || !species || !birthDateStr) {
      throw new Error("Faltan datos de la mascota");
    }
    await db.insert(futureNotifications).values({
      email: validEmail,
      petName,
      species,
      birthDate: new Date(birthDateStr)
    });
    return { success: true };
  } catch (error: unknown) {
    console.error("Error guardando lead:", error);
    const message = error instanceof Error ? error.message : "No se pudo registrar el correo. Inténtalo más tarde.";
    return { success: false, error: message };
  }
}