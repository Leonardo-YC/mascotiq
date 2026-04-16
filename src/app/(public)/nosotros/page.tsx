import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Heart, ShieldCheck, Linkedin, Mail, Github, Sparkles, BrainCircuit } from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      
      {/* 🚀 1. HERO SECTION (La Misión) */}
      <section className="relative bg-slate-900 pt-20 pb-20 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-black uppercase tracking-[0.2em] mb-8 border border-emerald-500/20">
            <Target className="w-3.5 h-3.5" />
            <span>Nuestra Visión</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[1.1] mb-8">
            Redefiniendo el mañana de <br className="hidden md:block"/> 
            <span className="text-emerald-400">nuestros compañeros senior.</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
            Mascotiq nace para transformar la nutrición reactiva en cuidado biológico preventivo, usando datos y tecnología para honrar el vínculo más puro que existe.
          </p>
        </div>
      </section>

      {/* ✨ 2. FILOSOFÍA & VALORES */}
      <section className="py-20 bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto md:mx-0 shadow-sm border border-emerald-200">
                <BrainCircuit className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Inteligencia Biológica</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                No usamos fórmulas genéricas. Analizamos peso, edad y especie para encontrar el equilibrio nutricional exacto.
              </p>
            </div>

            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto md:mx-0 shadow-sm border border-blue-200">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Calidad Certificada</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Seleccionamos laboratorios con estándares de alta gama, garantizando seguridad y efectividad en cada dosis.
              </p>
            </div>

            <div className="space-y-4 text-center md:text-left">
              <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto md:mx-0 shadow-sm border border-orange-200">
                <Heart className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Vínculo Real</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Entendemos que son familia. Cada decisión en Mascotiq se toma con esa empatía como prioridad absoluta.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 👥 3. EL FUNDADOR (Diseño Cinemático Mejorado) */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">La mente detrás del motor</h2>
            <div className="h-1.5 w-16 bg-emerald-500 mx-auto rounded-full"></div>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-800">
            {/* Foto 16:9 (1920x1080) */}
            <div className="relative w-full aspect-video bg-slate-800">
              <Image 
                src="/images/team/founder-team.webp" 
                alt="José Leonardo Yupán Crúz y sus mascotas" 
                fill
                className="object-cover opacity-85"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
            </div>

            {/* Contenido Perfil */}
            <div className="p-8 md:p-10 relative">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
                <div className="text-center md:text-left">
                  <h3 className="text-3xl font-black text-white tracking-tight">José Leonardo Yupán Crúz</h3>
                  <p className="text-emerald-400 font-bold text-sm uppercase tracking-[0.2em] mt-1">Founder & Lead Software Engineer</p>
                  
                  <div className="mt-6 flex justify-center md:justify-start gap-3">
                    <a href="https://www.linkedin.com/in/leonardo-yupán-crúz-4b7158336" target="_blank" className="p-2.5 bg-white/5 hover:bg-emerald-500 rounded-xl transition-all border border-white/10">
                      <Linkedin className="w-5 h-5 text-white" />
                    </a>
                    <a href="https://github.com/Leonardo-YC" target="_blank" className="p-2.5 bg-white/5 hover:bg-emerald-500 rounded-xl transition-all border border-white/10">
                      <Github className="w-5 h-5 text-white" />
                    </a>
                    <a href="mailto:leonardoyupan2012@gmail.com" className="p-2.5 bg-white/5 hover:bg-emerald-500 rounded-xl transition-all border border-white/10">
                      <Mail className="w-5 h-5 text-white" />
                    </a>
                  </div>
                </div>

                <div className="flex-1 max-w-xl">
                  <p className="text-slate-300 text-base md:text-lg leading-relaxed font-medium italic">
                    &ldquo;Mascotiq es la unión de mi carrera como ingeniero con el respeto hacia mis 5 compañeros. No solo construimos software, creamos una herramienta para que vivan más y mejor.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 4. FINAL CTA (Rediseñado para llenar el espacio) */}
      <section className="pb-24 pt-10 px-6">
        <div className="max-w-5xl mx-auto bg-emerald-50 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden border border-emerald-100">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-200/40 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-8 animate-pulse" />
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1]">
              ¿Listo para darle lo mejor <br className="hidden md:block"/> a tu mejor amigo?
            </h2>
            <Link 
              href="/quiz" 
              className="inline-flex bg-slate-900 hover:bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] px-12 py-5 rounded-2xl items-center gap-3 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Comenzar diagnóstico
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}