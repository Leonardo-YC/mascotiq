"use client";
import { useState } from "react";
import { Send, Mail, MessageCircle, Clock, CheckCircle, AlertTriangle, ChevronDown } from "lucide-react";
import { sendContactForm } from "@/actions/contact-action";

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    const result = await sendContactForm(form);
    setIsSubmitting(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error || "Error al enviar. Intenta de nuevo.");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 md:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* ── Cabecera Limpia y Responsive ── */}
        <div className="text-center mb-10 md:mb-14 px-2">
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Contáctanos
          </h1>
          <p className="text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
            Estamos para ayudarte. ¿Tienes dudas sobre los planes o el diagnóstico? 
            Escríbenos y te responderemos en menos de 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          {/* Info rápida (Se apila arriba en móvil, sidebar en PC) */}
          <div className="space-y-4 md:space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors">
              <div className="bg-emerald-50 p-2.5 rounded-xl shrink-0">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-slate-900 text-sm">Email directo</p>
                <a href="mailto:leonardoyupan2012@gmail.com" className="text-emerald-600 text-sm font-medium hover:underline break-all">
                  leonardoyupan2012@gmail.com
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="bg-blue-50 p-2.5 rounded-xl shrink-0">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Tiempo de respuesta</p>
                <p className="text-slate-500 text-sm">Respondemos en menos de 24 horas hábiles.</p>
              </div>
            </div>

            <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <p className="font-bold text-sm mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  ¿Emergencia de salud?
                </p>
                <p className="text-slate-400 text-xs leading-relaxed font-medium">
                  Para urgencias veterinarias, acude a tu clínica local. Mascotiq ofrece orientación nutricional preventiva.
                </p>
              </div>
            </div>
          </div>

          {/* Formulario (Ocupa 2 columnas en PC) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-10">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
                <CheckCircle className="w-16 h-16 text-emerald-600 mb-4" />
                <h3 className="text-2xl font-black text-slate-900 mb-2">¡Mensaje enviado!</h3>
                <p className="text-slate-500 text-sm max-w-sm font-medium">
                  Recibimos tu mensaje correctamente. Te responderemos muy pronto.
                </p>
                <button 
                  onClick={() => setSuccess(false)} 
                  className="mt-8 bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Tu nombre</label>
                    <input
                      name="name" type="text" required value={form.name} onChange={handleChange}
                      placeholder="José Leonardo"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:outline-none text-slate-900 text-sm transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Tu correo</label>
                    <input
                      name="email" type="email" required value={form.email} onChange={handleChange}
                      placeholder="tu@correo.com"
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:outline-none text-slate-900 text-sm transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Asunto</label>
                  <div className="relative">
                    <select
                      name="subject" required value={form.subject} onChange={handleChange}
                      className="w-full appearance-none px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:outline-none text-slate-700 text-sm bg-white transition-all pr-10 cursor-pointer"
                    >
                      <option value="">Selecciona un tema...</option>
                      <option value="Consulta sobre planes">Consulta sobre planes</option>
                      <option value="Problema con mi suscripción">Problema con mi suscripción</option>
                      <option value="Duda sobre el diagnóstico">Duda sobre el diagnóstico</option>
                      <option value="Pedido y envíos">Pedido y envíos</option>
                      <option value="Otro">Otro asunto</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider ml-1">Mensaje</label>
                  <textarea
                    name="message" required rows={5} value={form.message} onChange={handleChange}
                    placeholder="Cuéntanos cómo podemos ayudarte..."
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-100 focus:border-emerald-500 focus:outline-none text-slate-900 text-sm resize-none transition-all"
                  />
                </div>

                {error && (
                  <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-in fade-in">
                    ⚠️ {error}
                  </p>
                )}

                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-emerald-600/20 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <><Send className="w-4 h-4" /> Enviar mensaje</>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center font-medium">
                  Al enviar, aceptas nuestra <a href="/privacidad" className="text-emerald-600 hover:underline">Política de Privacidad</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}