"use server";
import { sendEmail } from "@/actions/email-service";
import { z } from "zod";

const schema = z.object({
  name:    z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email:   z.string().email("Correo inválido"),
  subject: z.string().min(3, "El asunto es demasiado corto"),
  message: z.string().min(10, "El mensaje debe tener al menos 10 caracteres"),
});

export async function sendContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  try {
    const parsed = schema.parse(data);

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 32px; border-radius: 16px;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">📬 Nuevo mensaje de contacto</h2>
        <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">Recibido desde el formulario de Mascotiq</p>

        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 16px; font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; width: 100px;">Nombre</td>
            <td style="padding: 12px 16px; font-weight: 600; color: #1e293b;">${parsed.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 16px; font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Correo</td>
            <td style="padding: 12px 16px; color: #1e293b;"><a href="mailto:${parsed.email}" style="color: #059669;">${parsed.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 12px 16px; font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase;">Asunto</td>
            <td style="padding: 12px 16px; font-weight: 600; color: #1e293b;">${parsed.subject}</td>
          </tr>
          <tr>
            <td style="padding: 12px 16px; font-size: 12px; font-weight: bold; color: #94a3b8; text-transform: uppercase; vertical-align: top;">Mensaje</td>
            <td style="padding: 12px 16px; color: #475569; line-height: 1.6; white-space: pre-wrap;">${parsed.message}</td>
          </tr>
        </table>

        <p style="margin-top: 24px; font-size: 12px; color: #94a3b8; text-align: center;">
          © ${new Date().getFullYear()} Mascotiq — Panel de Contacto
        </p>
      </div>
    `;

    await sendEmail({
      to: process.env.GMAIL_USER!,
      subject: `[Mascotiq] ${parsed.subject} — de ${parsed.name}`,
      html,
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    console.error("Error en formulario de contacto:", error);
    return { success: false, error: "No se pudo enviar el mensaje. Intenta de nuevo." };
  }
}