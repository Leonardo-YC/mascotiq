"use server";

import nodemailer from "nodemailer";

// 1. Configuramos el "transporte" usando tus credenciales de Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// 2. Definimos la estructura de lo que recibiremos para enviar
interface EmailOptions {
  to: string;
  subject: string;
  html: string; // Usamos HTML para poder mandar correos con diseño bonito
}

// 3. La función maestra que despacha el correo
export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      throw new Error("Faltan las credenciales de Gmail en el .env");
    }

    const mailOptions = {
      from: `"Mascotiq" <${process.env.GMAIL_USER}>`, // Así se verá el remitente
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Correo enviado con éxito:", info.messageId);
    
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error al enviar el correo:", error);
    return { success: false, error: "No se pudo enviar el correo electrónico." };
  }
}