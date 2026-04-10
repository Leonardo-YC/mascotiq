import { RefreshCw } from "lucide-react";

export default function ReembolsosPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 font-sans">
      <div className="max-w-3xl mx-auto px-6 bg-white p-10 md:p-16 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-8">
          <div className="bg-orange-100 p-3 rounded-xl"><RefreshCw className="w-8 h-8 text-orange-600" /></div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Política de Reembolsos</h1>
            <p className="text-slate-500 font-medium mt-1">Última actualización: Abril 2026</p>
          </div>
        </div>
        <div className="space-y-6 text-slate-600 leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">1. Naturaleza de los Productos</h2>
            <p>Los suplementos nutricionales y alimentos para mascotas que distribuye Mascotiq son productos perecederos sujetos a estrictas normas sanitarias. Por razones de higiene, seguridad y control de calidad, una vez que el sello de seguridad de cualquier producto ha sido manipulado o abierto, no es posible aceptar devoluciones ni emitir reembolsos por ese artículo.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">2. Política de Reembolso por Producto No Utilizado</h2>
            <p>Si el sello de seguridad del producto está intacto y el artículo se encuentra en perfectas condiciones, puedes solicitar la devolución dentro de los 7 días calendario siguientes a la fecha de recepción. El reembolso se procesará al método de pago original en un plazo de 5 a 10 días hábiles según tu banco. Los costos de envío de retorno son responsabilidad del usuario, salvo que el error sea atribuible a Mascotiq.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">3. Cancelaciones de Suscripción</h2>
            <p>Puedes cancelar tu suscripción en cualquier momento desde tu panel de control sin penalización alguna. La cancelación aplica para el siguiente ciclo de facturación. No se realizan reembolsos prorrateados por días no utilizados de un período que ya fue cobrado y procesado para su despacho, dado que los productos ya han sido preparados y comprometidos para tu envío.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">4. Productos Defectuosos o Error de Envío</h2>
            <p>Si recibes:</p>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Un producto con daño físico ocasionado durante el transporte.</li>
              <li>Un artículo diferente al especificado en tu plan nutricional.</li>
              <li>Un producto con fecha de vencimiento ya expirada o próxima a vencer (menos de 30 días).</li>
            </ul>
            <p className="mt-3">Contáctanos dentro de las <strong>48 horas siguientes a la recepción</strong> mediante nuestro formulario en <strong>mascotiq.com/contacto</strong>, adjuntando fotografías del problema. Evaluaremos el caso y, de proceder, realizaremos el reemplazo del producto sin costo adicional o la emisión de un reembolso íntegro al método de pago original.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">5. Reembolsos por Problemas de Pago</h2>
            <p>Si fuiste cobrado por error (cobro duplicado, error técnico de Stripe) contáctanos de inmediato. Investigaremos el caso y, de confirmarse el error, procesaremos el reembolso en un plazo máximo de 3 días hábiles.</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-3">6. Proceso de Solicitud de Reembolso</h2>
            <p>Para solicitar un reembolso, envía un mensaje a través de <strong>mascotiq.com/contacto</strong> indicando: tu nombre completo, correo registrado, número de pedido, motivo de la solicitud y, si aplica, fotografías del producto. Recibirás una respuesta en un máximo de 48 horas hábiles con el estado de tu solicitud.</p>
          </section>
        </div>
      </div>
    </div>
  );
}