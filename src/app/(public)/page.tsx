import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ShieldCheck, Star, ChevronDown, CheckCircle2,
  Bot, BrainCircuit, HeartPulse, MessageCircle
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white overflow-hidden">
      {/* 1. HERO */}
      <section className="relative bg-emerald-50/30 pt-12 pb-10 lg:pt-16 lg:pb-16 border-b border-emerald-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="text-center lg:text-left order-2 lg:order-1 w-full">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-emerald-100/80 text-emerald-800 text-xs sm:text-sm font-bold mb-5 border border-emerald-200">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span className="truncate">Recomendado por expertos veterinarios</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                ¿Sabías que un Gran Danés envejece{" "}
                <span className="text-emerald-600 block mt-1">antes que un Chihuahua?</span>
              </h1>
              <p className="mt-4 sm:mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Las soluciones genéricas no funcionan. Descubre exactamente qué necesita tu mascota según su especie, raza, peso y edad real.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center w-full sm:w-auto">
                <Link href="/quiz" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base sm:text-lg px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/20 hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto">
                  Diagnóstico Gratuito <ArrowRight className="w-5 h-5" />
                </Link>
                <p className="text-xs sm:text-sm font-medium text-slate-500 italic">Toma solo 3 minutos</p>
              </div>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <div className="flex -space-x-3">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white bg-emerald-200" />
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white bg-blue-200" />
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white bg-amber-200" />
                </div>
                <div className="text-xs sm:text-sm font-medium text-slate-600 text-center sm:text-left">
                  <div className="flex justify-center sm:justify-start text-amber-400">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />)}
                  </div>
                  <span className="font-bold text-slate-900">+500 mascotas</span> más felices
                </div>
              </div>
            </div>
            <div className="relative w-full max-w-[280px] sm:max-w-sm md:max-w-md mx-auto lg:max-w-none order-1 lg:order-2">
              <div className="absolute inset-0 bg-emerald-400/15 blur-[60px] rounded-full" />
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                <Image src="/images/landing/hero-dog.webp" alt="Mascota feliz con Mascotiq" fill className="object-cover" />
              </div>
              <div className="absolute -bottom-4 left-4 sm:left-auto sm:-bottom-4 sm:right-4 lg:right-auto lg:-left-6 bg-white p-3 sm:p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 sm:gap-3 max-w-[85%] sm:max-w-none">
                <div className="bg-emerald-50 p-2 rounded-xl shrink-0">
                  <HeartPulse className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
                </div>
                <p className="font-black text-slate-900 leading-tight text-xs sm:text-sm md:text-base">Nutrición <br className="hidden sm:block"/>de Precisión</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. BARRA AUTORIDAD */}
      <section className="border-b border-slate-100 bg-white py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-16 text-slate-400 font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-wider text-center">
          <span className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" /> Sin contratos forzosos</span>
          <span className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" /> Motor Biológico</span>
          <span className="flex items-center gap-1.5 sm:gap-2"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-500 shrink-0" /> Envíos mensuales</span>
        </div>
      </section>

      {/* 3. CÓMO FUNCIONA */}
      <section className="py-16 sm:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Bienestar en 3 simples pasos</h2>
            <p className="mt-3 sm:mt-4 text-slate-500 text-base sm:text-lg leading-relaxed">Olvídate de adivinar qué comprar. Nosotros hacemos la ciencia, tú disfrutas a tu mascota.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              { n: "1", bg: "bg-emerald-50", c: "text-emerald-600", title: "Haz el test biológico", desc: "Cuéntanos sobre tu peludo. Nuestro motor analizará su edad, peso y condiciones para determinar su etapa de vida real." },
              { n: "2", bg: "bg-blue-50", c: "text-blue-600", title: "Recibe tu plan ideal", desc: "Te asignaremos un plan nutricional exacto con suplementos curados específicamente para sus necesidades actuales." },
              { n: "3", bg: "bg-orange-50", c: "text-orange-600", title: "Nutrición automática", desc: "Suscríbete y recibe el producto en la puerta de tu casa cada mes. Pausa, modifica o cancela cuando quieras." },
            ].map(({ n, bg, c, title, desc }) => (
              <div key={n} className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${bg} rounded-2xl flex items-center justify-center mb-5 sm:mb-6 ${c} font-black text-lg sm:text-xl italic`}>{n}</div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 sm:mb-3">{title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. IA */}
      <section className="py-16 sm:py-20 bg-slate-900 text-white relative">
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-emerald-500/10 blur-[80px] sm:blur-[100px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-bold mb-5 sm:mb-6 border border-emerald-500/30">
              <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /><span>Tecnología Gemini</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mb-4 sm:mb-6 leading-tight">Tu asistente veterinario 24/7</h2>
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8">
              Mascotiq incluye una IA entrenada exclusivamente en salud y nutrición animal. Toma una foto de cualquier etiqueta y recibe un análisis instantáneo.
            </p>
            <ul className="space-y-3 sm:space-y-4 text-left inline-block lg:block text-sm sm:text-base">
              <li className="flex items-start sm:items-center gap-2 sm:gap-3 text-slate-200"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" /> Respuestas instantáneas sin esperar citas.</li>
              <li className="flex items-start sm:items-center gap-2 sm:gap-3 text-slate-200"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" /> Análisis multimodal (lee etiquetas de comida).</li>
              <li className="flex items-start sm:items-center gap-2 sm:gap-3 text-slate-200"><CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 shrink-0 mt-0.5 sm:mt-0" /> Guardrails de seguridad veterinaria.</li>
            </ul>
          </div>
          <div className="bg-slate-800 border border-slate-700 p-5 sm:p-6 md:p-8 rounded-3xl shadow-2xl">
            <div className="space-y-4 font-medium text-xs sm:text-sm md:text-base w-full">
              <div className="bg-slate-700 p-3 sm:p-4 rounded-2xl rounded-tr-none ml-4 sm:ml-8 md:ml-12 text-slate-100">
                ¿Mi perro senior puede comer glucosamina si es alérgico al pollo?
              </div>
              <div className="bg-emerald-900/40 border border-emerald-800/50 p-3 sm:p-4 rounded-2xl rounded-tl-none mr-4 sm:mr-8 md:mr-12 text-emerald-50 text-xs sm:text-sm italic leading-relaxed">
                ¡Hola! Sí, existen excelentes opciones de glucosamina de origen marino o sintético libres de proteína de pollo. Según el perfil de tu Pastor Alemán, te recomiendo...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIOS */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Familias más tranquilas</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                name: "Camila R.",
                pet: "Rocky (Híbrido)",
                text: "No sabía que mi híbrido ya era senior por su peso. Con el plan para articulaciones, volvió a subir al sofá solo.",
                image: "/images/testimonios/cliente1.webp"
              },
              {
                name: "Luis Fernando",
                pet: "Luna (Gato)",
                text: "El asistente de IA me salvó. Le tomé foto a unas galletas y me avisó que tenían un ingrediente malo para su edad.",
                image: "/images/testimonios/cliente2.webp"
              },
              {
                name: "Andrea M.",
                pet: "Zeus (Gran Danés)",
                text: "Me olvido de comprar las cosas. Que Mascotiq me cobre y envíe la caja cada mes es la máxima tranquilidad.",
                image: "/images/testimonios/cliente3.webp"
              },
            ].map((t, i) => (
              <div key={i} className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-transparent hover:border-emerald-100 transition-all">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-600 mb-6 italic text-sm sm:text-base leading-relaxed">{t.text}</p>
                <div className="flex items-center gap-3">
                  <Image
                    src={t.image}
                    alt={`Testimonio de ${t.name}`}
                    width={48}
                    height={48}
                    className="rounded-full object-cover shrink-0 border-2 border-white shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{t.name}</p>
                    <p className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">{t.pet}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <section id="faq" className="py-16 sm:py-20 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Preguntas Frecuentes</h2>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {[
              { q: "¿Qué pasa si mi mascota es híbrida?", a: "Nuestro sistema utiliza el peso actual como variable principal para clasificarla en la categoría de tamaño correcta y aplicar la lógica de senioridad precisa." },
              { q: "¿Puedo cancelar en cualquier momento?", a: "Totalmente. Desde tu panel de control puedes pausar o cancelar con un solo clic. Sin contratos ni letras pequeñas." },
              { q: "¿Qué pasa si mi mascota aún es joven?", a: "Te lo diremos con honestidad. Podrás registrarte para recibir una notificación exactamente cuando entre a su etapa senior." },
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 cursor-pointer shadow-sm">
                <summary className="flex justify-between items-center font-bold text-slate-900 list-none text-sm sm:text-base">
                  <span className="pr-4">{faq.q}</span>
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 transition-transform duration-300 group-open:rotate-180 shrink-0" />
                </summary>
                <p className="text-slate-600 mt-3 sm:mt-4 leading-relaxed text-xs sm:text-sm md:text-base border-t border-slate-100 pt-3 sm:pt-4">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
          <div className="text-center mt-6 sm:mt-8">
            <Link href="/faq" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:underline text-xs sm:text-sm">
              <MessageCircle className="w-4 h-4" /> Ver todas las preguntas frecuentes →
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-16 sm:py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <BrainCircuit className="w-12 h-12 sm:w-14 sm:h-14 text-emerald-500 mx-auto mb-5 sm:mb-6" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4 sm:mb-6 leading-tight">Elige la ciencia. Alarga su vida.</h2>
          <p className="text-base sm:text-lg text-slate-600 mb-8 sm:mb-10 max-w-xl mx-auto">Descubre el plan nutricional exacto que tu mejor amigo necesita hoy mismo.</p>
          <Link href="/quiz" className="inline-flex w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-base sm:text-lg md:text-xl px-6 sm:px-10 py-4 sm:py-5 rounded-2xl items-center justify-center gap-3 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
            Comenzar diagnóstico <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
          </Link>
        </div>
      </section>
    </div>
  );
}