// ─────────────────────────────────────────────────────────────────────
// PRIVACIDAD  →  src/app/(public)/privacidad/page.tsx
// ─────────────────────────────────────────────────────────────────────
import { Lock } from "lucide-react";

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-6 bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-8">
          <div className="bg-blue-100 p-3 rounded-xl"><Lock className="w-8 h-8 text-blue-600" /></div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Política de Privacidad</h1>
            <p className="text-slate-500 font-medium mt-1">Última actualización: Abril 2026</p>
          </div>
        </div>
        <div className="space-y-6 text-slate-600 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Responsable del Tratamiento</h2>
            <p>Mascotiq es el responsable del tratamiento de los datos personales recabados a través de esta plataforma. Para cualquier consulta relacionada con privacidad puedes contactarnos a través de nuestro formulario de contacto en <strong>mascotiq.com/contacto</strong> o escribiendo a <strong>hola@mascotiq.com</strong>.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Información que Recopilamos</h2>
            <p className="mb-3">Recopilamos la siguiente información para brindarte el servicio personalizado de Mascotiq:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Datos de identificación:</strong> nombre y correo electrónico, gestionados a través de Clerk, nuestro proveedor de identidad seguro.</li>
              <li><strong>Datos de tu mascota:</strong> especie, condición híbrida o raza, peso, edad, condiciones de salud y fotografías, necesarios para calcular el plan nutricional personalizado.</li>
              <li><strong>Datos de uso:</strong> interacciones con el chatbot de IA y comportamiento de navegación en la plataforma (datos agregados y anónimos).</li>
              <li><strong>Datos de facturación:</strong> procesados exclusivamente por Stripe. Mascotiq no almacena datos de tarjeta bancaria en sus propios servidores.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Finalidad y Base Legal del Tratamiento</h2>
            <p>Utilizamos tus datos para: (a) calcular la etapa biológica de tu mascota y generar recomendaciones nutricionales personalizadas; (b) gestionar tu suscripción y procesar los pagos recurrentes; (c) enviarte comunicaciones transaccionales como confirmaciones de pago, estado de pedidos y notificaciones relevantes del servicio; (d) mejorar la plataforma mediante análisis anónimos de uso.</p>
            <p className="mt-3">La base legal es la ejecución del contrato de servicio que aceptas al registrarte, el cumplimiento de obligaciones legales y nuestro interés legítimo en mejorar el servicio.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Compartición de Datos con Terceros</h2>
            <p>No vendemos, alquilamos ni cedemos tus datos personales a terceros con fines comerciales o publicitarios. Únicamente compartimos datos con proveedores de servicios técnicos necesarios para operar la plataforma: Clerk (gestión de identidad), Stripe (procesamiento de pagos), Neon (base de datos), Vercel (infraestructura) y Google (modelo de IA). Todos ellos operan bajo estrictos estándares de seguridad y privacidad.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Seguridad de Pagos</h2>
            <p>Todos los pagos son procesados por Stripe, una pasarela de pagos certificada con los más altos estándares PCI-DSS. Mascotiq nunca tiene acceso directo a los datos completos de tu tarjeta bancaria. Stripe tokeniza la información de pago de forma segura antes de cualquier transacción.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Cookies y Tecnologías de Seguimiento</h2>
            <p>Utilizamos cookies técnicas esenciales para mantener tu sesión activa y recordar tus preferencias. También utilizamos herramientas de análisis anónimo (como Vercel Analytics) para entender cómo los usuarios interactúan con la plataforma. No utilizamos cookies de seguimiento publicitario ni compartimos datos de comportamiento con redes de anuncios.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Tus Derechos</h2>
            <p>Tienes derecho a acceder, rectificar, eliminar y portar tus datos personales en cualquier momento. Para ejercer estos derechos, contáctanos a través del formulario en <strong>mascotiq.com/contacto</strong>. También puedes eliminar tu cuenta directamente desde la configuración de tu perfil, lo que resultará en la eliminación de todos tus datos asociados.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Conservación de Datos</h2>
            <p>Conservamos tus datos mientras mantengas una cuenta activa o suscripción. Tras la cancelación de tu cuenta, conservamos datos mínimos por un período de 90 días por razones de seguridad e integridad del servicio, tras los cuales son eliminados de forma permanente.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Menores de Edad</h2>
            <p>Mascotiq no está dirigido a personas menores de 18 años. No recopilamos conscientemente datos de menores. Si detectamos que un menor ha creado una cuenta sin consentimiento parental, procederemos a eliminarla de forma inmediata.</p>
          </section>
        </div>
      </div>
    </div>
  );
}