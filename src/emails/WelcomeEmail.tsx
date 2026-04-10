import { Html, Head, Preview, Body, Container, Text, Button, Tailwind, Section } from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  ownerName: string;
  petName: string;
}

export default function WelcomeEmail({ ownerName = "Amante de las mascotas", petName = "tu peludo" }: WelcomeEmailProps) {
  return (
    <Tailwind>
      <Html>
        <Head />
        <Preview>Bienvenido a la revolución nutricional de Mascotiq 🐾</Preview>
        <Body className="bg-slate-50 font-sans">
          <Container className="bg-white border border-gray-100 rounded-2xl p-8 mt-10 mx-auto max-w-lg shadow-sm">
            
            <Text className="text-2xl font-black text-gray-900 mb-4 tracking-tight">
              ¡Hola, {ownerName}! 👋
            </Text>
            
            <Text className="text-gray-600 text-base leading-relaxed mb-6">
              Estamos muy felices de que te unas a <strong>Mascotiq</strong>. Nuestra misión es simple pero poderosa: darle a <strong>{petName}</strong> exactamente lo que necesita en su etapa biológica actual. Ni más, ni menos.
            </Text>

            <Section className="bg-emerald-50 rounded-xl p-6 mb-6 text-center">
              <Text className="text-emerald-800 font-medium m-0">
                Tu viaje hacia una mejor calidad de vida animal acaba de comenzar.
              </Text>
            </Section>

            <Button 
              href="https://mascotiq.vercel.app/dashboard" 
              className="bg-[#059669] text-white font-bold px-6 py-3 rounded-xl w-full text-center"
            >
              Ir a mi Panel de Control
            </Button>

            <Text className="text-sm text-gray-400 mt-8 text-center border-t border-gray-100 pt-6">
              © 2026 Mascotiq. Todos los derechos reservados.<br/>
              Hecho con amor para las mascotas en Latinoamérica.
            </Text>

          </Container>
        </Body>
      </Html>
    </Tailwind>
  );
}