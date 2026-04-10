"use client";
import { useState } from "react";
import { Send, Mail, MessageCircle, Clock, CheckCircle } from "lucide-react";
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
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* Cabecera */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-sm font-bold mb-5 border border-emerald-200">
            <MessageCircle className="w-4 h-4" />
            Estamos para ayudarte
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Contáctanos
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            ¿Tienes dudas sobre los planes, tu suscripción o el diagnóstico nutricional? Escríbenos y te respondemos en menos de 24 horas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Info rápida */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4">
              <div className="bg-emerald-50 p-2.5 rounded-xl shrink-0">
                <Mail className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Email directo</p>
                <a href="mailto:hola@mascotiq.com" className="text-emerald-600 text-sm font-medium hover:underline">
                  hola@mascotiq.com
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

            <div className="bg-slate-900 rounded-2xl p-5 text-white">
              <p className="font-bold text-sm mb-2">¿Tienes una emergencia de salud?</p>
              <p className="text-slate-400 text-xs leading-relaxed">
                Para emergencias veterinarias, acude inmediatamente a tu clínica local. Mascotiq ofrece orientación nutricional, no atención de urgencias.
              </p>
            </div>
          </div>

          {/* Formulario */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
            {success ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-5">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">¡Mensaje enviado!</h3>
                <p className="text-slate-500 text-sm max-w-sm">
                  Recibimos tu mensaje correctamente. Te responderemos en las próximas 24 horas.
                </p>
                <button
                  onClick={() => { setSuccess(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-6 text-emerald-600 font-bold text-sm hover:underline"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                      Tu nombre
                    </label>
                    <input
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="José Leonardo"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                      Tu correo
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@correo.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900 text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                    Asunto
                  </label>
                  <select
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-700 text-sm bg-white transition-colors"
                  >
                    <option value="">Selecciona un tema...</option>
                    <option value="Consulta sobre planes">Consulta sobre planes</option>
                    <option value="Problema con mi suscripción">Problema con mi suscripción</option>
                    <option value="Duda sobre el diagnóstico">Duda sobre el diagnóstico</option>
                    <option value="Problema técnico">Problema técnico</option>
                    <option value="Pedido y envíos">Pedido y envíos</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">
                    Mensaje
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Cuéntanos con detalle cómo podemos ayudarte..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900 text-sm resize-none transition-colors"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 text-sm"
                >
                  {isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enviando...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Enviar mensaje</>
                  )}
                </button>

                <p className="text-xs text-slate-400 text-center">
                  Al enviar este formulario, aceptas nuestra{" "}
                  <a href="/privacidad" className="text-emerald-600 hover:underline">Política de Privacidad</a>.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}