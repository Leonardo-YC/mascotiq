import {
  Html, Head, Preview, Body, Container,
  Text, Button, Tailwind, Section, Img
} from "@react-email/components";
import * as React from "react";

interface PaymentFailedEmailProps {
  ownerName: string;
  updateUrl: string;
}

export default function PaymentFailedEmail({
  ownerName = "Amante de las mascotas",
  updateUrl = "https://mascotiq.vercel.app/dashboard",
}: PaymentFailedEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Hubo un problema con tu pago en Mascotiq ⚠️</Preview>
        <Body className="bg-slate-50 font-sans">
          <Container className="bg-white border border-gray-100 rounded-2xl p-8 mt-10 mx-auto max-w-lg shadow-sm">

            {/* Logo de Mascotiq optimizado para correos */}
            <Img
              src="https://mascotiq.vercel.app/images/logo-email.png"
              alt="Mascotiq Logo"
              width="160"
              className="mx-auto mb-8"
            />

            <Text className="text-2xl font-black text-gray-900 mb-4 tracking-tight text-center">
              Hola, {ownerName} 👋
            </Text>

            <Text className="text-gray-600 text-base leading-relaxed mb-4">
              Tuvimos un inconveniente al procesar el pago de tu suscripción en <strong>Mascotiq</strong>.
              Esto puede ocurrir si tu tarjeta venció, no tiene fondos suficientes o el banco rechazó el cargo.
            </Text>

            <Section className="bg-red-50 rounded-xl p-6 mb-6 text-center border border-red-100">
              <Text className="text-red-800 font-bold m-0">
                ⚠️ Tu plan nutricional está en pausa hasta que actualices tu método de pago.
              </Text>
            </Section>

            <Text className="text-gray-600 text-base leading-relaxed mb-6">
              No te preocupes, es fácil de resolver. Haz clic en el botón de abajo para actualizar
              tu información de pago desde tu panel de control.
            </Text>

            <Button
              href={updateUrl}
              className="bg-[#dc2626] text-white font-bold px-6 py-3 rounded-xl w-full text-center"
            >
              Actualizar método de pago
            </Button>

            <Text className="text-sm text-gray-400 mt-8 text-center border-t border-gray-100 pt-6">
              Si necesitas ayuda, responde este correo y te asistiremos.<br />
              © 2026 Mascotiq. Todos los derechos reservados.
            </Text>
          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}