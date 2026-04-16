import Link from "next/link";
import { ChevronDown, MessageCircle } from "lucide-react";

const faqs = [
  {
    category: "Diagnóstico y Planes",
    items: [
      {
        q: "¿Cómo funciona el diagnóstico nutricional?",
        a: "Completas un formulario de 3 pasos con información sobre tu mascota: especie, raza o condición híbrida, peso, edad y condiciones de salud. Nuestro motor biológico evalúa en qué etapa de vida se encuentra y genera un plan personalizado con los productos más adecuados para su momento actual.",
      },
      {
        q: "¿Qué es la 'etapa senior' y cuándo empieza?",
        a: "La etapa senior depende de la biología de cada animal. Los gatos entran en etapa senior a los 7 años. En perros varía según el peso: razas gigantes (>45 kg) a los 5 años, grandes (25-45 kg) a los 6, medianas (10-25 kg) a los 7, y pequeñas (<10 kg) a los 9 años.",
      },
      {
        q: "¿Qué pasa si mi mascota aún es joven?",
        a: "El sistema te lo comunicará con honestidad. Podrás registrar tu correo para recibir una notificación automática cuando tu mascota se acerque a su etapa senior, para que puedas iniciar el plan preventivo en el momento exacto.",
      },
      {
        q: "¿Puedo cambiar de plan después de suscribirme?",
        a: "Sí. Desde tu panel de control puedes gestionar tu suscripción a través del Portal de Stripe, donde podrás cambiar de plan, actualizar el método de pago o cancelar. Los cambios aplican al siguiente ciclo de facturación.",
      },
    ],
  },
  {
    category: "Mascotas Híbridas",
    items: [
      {
        q: "¿Qué pasa si mi mascota es híbrida (cruce)?",
        a: "Mascotiq está diseñado pensando en el mercado latinoamericano, donde la mayoría de mascotas son híbridas. Si tu mascota es un cruce sin raza definida, usamos el peso actual como variable principal para clasificarla en la categoría de tamaño correcta y aplicar la lógica de senioridad biológica precisa.",
      },
      {
        q: "¿Cómo indico que mi mascota es híbrida en el quiz?",
        a: "En el paso de datos puedes marcar la casilla '¿Mi mascota es híbrida?' y simplemente ingresar su peso actual. El sistema hace el resto de forma automática, sin necesidad de conocer la raza exacta.",
      },
    ],
  },
  {
    category: "Suscripción y Pagos",
    items: [
      {
        q: "¿Cómo funciona el cobro mensual?",
        a: "Una vez que te suscribes, Stripe cobra automáticamente cada mes en la fecha de tu primer pago. Recibirás un correo de confirmación con cada cobro exitoso. Si hay algún problema con el pago, te notificaremos de inmediato para que puedas actualizarlo.",
      },
      {
        q: "¿Puedo cancelar en cualquier momento?",
        a: "Sí, sin penalizaciones. Desde tu panel de control puedes acceder al Portal de Stripe para cancelar tu suscripción con un clic. La cancelación aplica al siguiente ciclo, por lo que conservas tu acceso y tu próxima entrega si el mes ya fue cobrado.",
      },
      {
        q: "¿Puedo pausar mi suscripción temporalmente?",
        a: "Sí. Desde el Portal de Stripe en tu panel de control puedes pausar temporalmente tu suscripción. Durante la pausa no se realizarán cobros ni se crearán pedidos nuevos.",
      },
      {
        q: "¿Qué métodos de pago aceptan?",
        a: "Aceptamos tarjetas de crédito y débito Visa, Mastercard y American Express a través de Stripe, la pasarela de pagos más segura del mercado. Mascotiq nunca almacena los datos de tu tarjeta en sus propios servidores.",
      },
      {
        q: "¿Ofrecen descuentos o códigos promocionales?",
        a: "En esta versión del producto no manejamos descuentos individuales. Sin embargo, el precio de suscripción ya incluye un ahorro significativo frente al valor referencial unitario de cada producto incluido en tu plan.",
      },
    ],
  },
  {
    category: "Pedidos y Envíos",
    items: [
      {
        q: "¿Cuánto tarda en llegar mi caja mensual?",
        a: "Después de que el equipo de Mascotiq confirme y procese tu pedido (estado 'En preparación'), el tiempo de entrega depende de tu ubicación. Puedes seguir el estado de tu pedido en tiempo real desde tu panel de control, donde también verás el número de guía de envío cuando esté disponible.",
      },
      {
        q: "¿Qué pasa si recibo un producto en mal estado?",
        a: "Si recibes un producto dañado o diferente al indicado en tu plan, contáctanos dentro de las 48 horas siguientes a la recepción mediante nuestro formulario de contacto. Evaluaremos el caso y procederemos con el reemplazo o reembolso según corresponda.",
      },
      {
        q: "¿Cómo sé en qué estado está mi pedido?",
        a: "En tu Panel de Control, en la sección 'Tus Planes Activos', puedes ver el estado actualizado de tu caja del mes: Pendiente, En preparación, Enviado o Entregado. El equipo de Mascotiq actualiza este estado manualmente conforme avanza el proceso.",
      },
    ],
  },
  {
    category: "Asistente IA",
    items: [
      {
        q: "¿El asistente de IA reemplaza al veterinario?",
        a: "No. El asistente nutricional está diseñado para complementar, no reemplazar, el consejo de un médico veterinario certificado. Puede ayudarte con dudas sobre nutrición, ingredientes y bienestar general, pero ante cualquier síntoma clínico o emergencia siempre debes acudir a tu veterinario de confianza.",
      },
      {
        q: "¿Cuántos mensajes puedo enviar al asistente?",
        a: "Los visitantes sin cuenta tienen 4 mensajes por sesión. Los usuarios registrados sin suscripción tienen 15 mensajes por día. Los usuarios con suscripción activa tienen 30 mensajes por día como beneficio premium.",
      },
      {
        q: "¿El asistente puede analizar fotos de etiquetas?",
        a: "Sí. El asistente de Mascotiq usa Gemini con capacidad multimodal, lo que significa que puedes subir una foto de la etiqueta nutricional de cualquier alimento o suplemento y el asistente la analizará para darte una opinión sobre si es adecuado para tu mascota.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">
            Todo lo que necesitas saber sobre Mascotiq <span className="text-emerald-600">.</span>
          </p>
        </div>

        <div className="space-y-10">
          {faqs.map(section => (
            <div key={section.category}>
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-2">
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((faq, i) => (
                  <details 
                    key={i} 
                    className="group bg-white rounded-2xl border border-slate-200 cursor-pointer shadow-sm hover:border-emerald-200 transition-all duration-300 open:ring-1 open:ring-emerald-500/20"
                  >
                    <summary className="flex justify-between items-center font-bold text-slate-900 text-sm md:text-base list-none p-5 select-none">
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown className="w-5 h-5 text-slate-400 transition-transform duration-500 group-open:rotate-180 shrink-0" />
                    </summary>
                    {/* Animación de entrada para la respuesta */}
                    <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-500">
                      <p className="text-slate-600 leading-relaxed text-sm border-t border-slate-100 pt-4">
                        {faq.a}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA de contacto */}
        <div className="mt-16 bg-slate-900 rounded-[2.5rem] p-10 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10" />
          <MessageCircle className="w-12 h-12 text-emerald-400 mx-auto mb-5" />
          <h3 className="text-2xl font-black mb-3">¿Aún tienes dudas?</h3>
          <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto font-medium">
            Si no encontraste lo que buscabas, nuestro equipo de soporte está listo para ayudarte personalmente.
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-1 active:scale-95 text-xs uppercase tracking-widest"
          >
            Contactar al equipo
          </Link>
        </div>
      </div>
    </main>
  );
}