import { FileText } from "lucide-react";

export default function TerminosPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-6 bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-8">
          <div className="bg-emerald-100 p-3 rounded-xl"><FileText className="w-8 h-8 text-emerald-600" /></div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Términos y Condiciones</h1>
            <p className="text-slate-500 font-medium mt-1">Última actualización: Abril 2026</p>
          </div>
        </div>
        <div className="space-y-6 text-slate-600 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Aceptación del Servicio</h2>
            <p>Al registrarte y utilizar Mascotiq, aceptas estos términos en su totalidad. Si no estás de acuerdo con alguna parte, debes abstenerte de usar la plataforma. Mascotiq se reserva el derecho de modificar estos términos con previo aviso de 15 días hábiles mediante notificación a tu correo registrado.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Descripción del Servicio</h2>
            <p>Mascotiq es una plataforma de suscripción nutricional para mascotas que proporciona: (a) un diagnóstico biológico de la etapa de vida de tu mascota basado en datos que tú suministras; (b) un plan nutricional personalizado con suplementos seleccionados; (c) entrega mensual de los productos incluidos en tu plan; (d) acceso a un asistente de IA especializado en nutrición animal.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Suscripciones y Facturación</h2>
            <p>Mascotiq opera mediante un modelo de cobro recurrente mensual. Al ingresar tu método de pago y confirmar la suscripción, autorizas expresamente los cobros automáticos en la fecha de tu primer pago y en los mismos días de cada mes posterior. El precio del plan incluye todos los productos asignados; no existen cobros ocultos adicionales.</p>
            <p className="mt-3">Si el cobro falla, te notificaremos de inmediato. Tendrás 7 días hábiles para actualizar tu método de pago antes de que la suscripción sea pausada automáticamente.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Cancelación y Pausas</h2>
            <p>Puedes cancelar o pausar tu suscripción en cualquier momento desde tu panel de control, sin penalizaciones ni períodos mínimos de permanencia. La cancelación es efectiva al finalizar el ciclo de facturación vigente. No se realizan reembolsos prorrateados por los días no utilizados de un período ya cobrado.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Descargo de Responsabilidad Médica</h2>
            <p>El diagnóstico biológico, las recomendaciones nutricionales y las respuestas del asistente de IA de Mascotiq tienen fines exclusivamente informativos y de bienestar preventivo. <strong>Bajo ninguna circunstancia sustituyen el diagnóstico, tratamiento o consejo de un médico veterinario certificado.</strong> Ante cualquier síntoma clínico o emergencia de salud, acude inmediatamente a tu clínica veterinaria local.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Exactitud de la Información</h2>
            <p>Eres responsable de proporcionar datos precisos y actualizados sobre tu mascota. Mascotiq no puede garantizar la adecuación del plan nutricional si la información ingresada es incorrecta o está desactualizada. Te recomendamos actualizar el perfil de tu mascota si hay cambios significativos en su peso o condición de salud.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">7. Propiedad Intelectual</h2>
            <p>Todo el contenido de Mascotiq, incluyendo el motor de senioridad biológica, los algoritmos de recomendación, el diseño de la plataforma, textos e imágenes, son propiedad exclusiva de Mascotiq o se usan bajo licencia. No está permitida su reproducción, distribución o uso comercial sin autorización expresa por escrito.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">8. Limitación de Responsabilidad</h2>
            <p>Mascotiq no será responsable por daños indirectos, incidentales o consecuentes derivados del uso del servicio. La responsabilidad máxima de Mascotiq frente a un usuario en cualquier caso estará limitada al monto pagado por el usuario en los últimos 3 meses de suscripción.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">9. Legislación Aplicable</h2>
            <p>Estos términos se rigen por las leyes de la República del Perú. Cualquier disputa que no pueda resolverse amigablemente será sometida a los tribunales competentes de la ciudad de Lima.</p>
          </section>
        </div>
      </div>
    </div>
  );
}