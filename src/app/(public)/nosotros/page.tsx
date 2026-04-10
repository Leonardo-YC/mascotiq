import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Target, Heart, ShieldCheck, Linkedin, Mail } from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-white">
      
      {/* 🚀 1. HERO SECTION (La Misión) */}
      <section className="relative bg-slate-900 pt-24 pb-20 lg:pt-32 lg:pb-32 overflow-hidden border-b border-emerald-900">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-bold mb-6 border border-emerald-500/30">
            <Target className="w-4 h-4" />
            <span>Nuestra Misión</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-6">
            Ciencia y tecnología al <br className="hidden md:block"/> 
            <span className="text-emerald-400">servicio de su bienestar.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
            Nacimos con un propósito claro: erradicar la nutrición genérica. Creemos que cada mascota merece envejecer con dignidad, respaldada por datos precisos, tecnología de punta y amor genuino.
          </p>
        </div>
      </section>

      {/* ✨ 2. LOS VALORES */}
      <section className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center md:text-left">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
              <ShieldCheck className="w-7 h-7 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Rigor Científico</h3>
            <p className="text-slate-600 leading-relaxed">No dejamos nada al azar. Nuestra matriz biológica está basada en estudios veterinarios reales.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center md:text-left">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
              <Heart className="w-7 h-7 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Empatía Animal</h3>
            <p className="text-slate-600 leading-relaxed">Construimos Mascotiq pensando en lo que querríamos para nuestros propios perros y gatos.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 text-center md:text-left">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto md:mx-0 mb-6">
              <Target className="w-7 h-7 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Innovación Constante</h3>
            <p className="text-slate-600 leading-relaxed">Implementamos inteligencia artificial para ser la plataforma más avanzada del mercado hispano.</p>
          </div>
        </div>
      </section>

      {/* 👥 3. EL EQUIPO FUNDADOR */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Conoce a los creadores</h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Un equipo multidisciplinario de jóvenes ingenieros y desarrolladores comprometidos con revolucionar la industria PetTech.
            </p>
          </div>

          {/* Grilla del equipo - 4 columnas en pantallas grandes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* PERFIL 1: JOSÉ LEONARDO (TÚ) */}
            <div className="group bg-slate-50 rounded-[2rem] p-6 border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all text-center">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg bg-slate-200">
                <Image 
                  src="/images/team/leonardo.webp" 
                  alt="José Leonardo Yupán Crúz" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">José Leonardo <br/> Yupán Crúz</h3>
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-4">Fundador & Arquitecto de Software</p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 px-2">
                Lidera la visión tecnológica y la arquitectura principal de la plataforma Mascotiq.
              </p>
              <div className="flex justify-center gap-3">
                <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white rounded-full shadow-sm hover:shadow transition-all"><Linkedin className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white rounded-full shadow-sm hover:shadow transition-all"><Mail className="w-4 h-4" /></button>
              </div>
            </div>

            {/* PERFIL 2: JESUS EDUARDO */}
            <div className="group bg-slate-50 rounded-[2rem] p-6 border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all text-center">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg bg-slate-200">
                <Image 
                  src="/images/team/jesus.webp" 
                  alt="Jesus Eduardo Lazaro Bravo" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Jesus Eduardo <br/> Lazaro Bravo</h3>
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-4">Co-Fundador & Operaciones</p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 px-2">
                Estratega clave en el desarrollo de la lógica de negocio y la experiencia de usuario.
              </p>
              <div className="flex justify-center gap-3">
                <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white rounded-full shadow-sm hover:shadow transition-all"><Linkedin className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white rounded-full shadow-sm hover:shadow transition-all"><Mail className="w-4 h-4" /></button>
              </div>
            </div>

            {/* PERFIL 3: MARKO SEBASTIAN */}
            <div className="group bg-slate-50 rounded-[2rem] p-6 border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all text-center">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg bg-slate-200">
                <Image 
                  src="/images/team/marko.webp" 
                  alt="Marko Sebastian Orihuela Carrasco" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Marko Sebastian <br/> Orihuela Carrasco</h3>
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-4">Co-Fundador & Desarrollo</p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 px-2">
                Especialista en la integración de bases de datos y motores de recomendación.
              </p>
              <div className="flex justify-center gap-3">
                <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white rounded-full shadow-sm hover:shadow transition-all"><Linkedin className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white rounded-full shadow-sm hover:shadow transition-all"><Mail className="w-4 h-4" /></button>
              </div>
            </div>

            {/* PERFIL 4: CARLO FABRIZIO */}
            <div className="group bg-slate-50 rounded-[2rem] p-6 border border-slate-200 hover:shadow-xl hover:border-emerald-300 transition-all text-center">
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden mb-6 border-4 border-white shadow-lg bg-slate-200">
                <Image 
                  src="/images/team/carlo.webp" 
                  alt="Carlo Fabrizio Chavarria Rojas" 
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-1">Carlo Fabrizio <br/> Chavarria Rojas</h3>
              <p className="text-emerald-600 font-bold text-sm uppercase tracking-wider mb-4">Co-Fundador & Producto</p>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 px-2">
                Enfocado en garantizar la máxima calidad y precisión del catálogo nutricional.
              </p>
              <div className="flex justify-center gap-3">
                <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white rounded-full shadow-sm hover:shadow transition-all"><Linkedin className="w-4 h-4" /></button>
                <button className="p-2 text-slate-400 hover:text-emerald-600 bg-white rounded-full shadow-sm hover:shadow transition-all"><Mail className="w-4 h-4" /></button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 🚀 4. FINAL CTA */}
      <section className="py-24 bg-slate-50 text-center border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">El equipo correcto. <br/> La plataforma correcta.</h2>
          <p className="text-xl text-slate-600 mb-10">Únete a cientos de familias que ya confían la nutrición de sus mascotas a nuestro sistema.</p>
          <Link 
            href="/quiz" 
            className="inline-flex bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg md:text-xl px-10 py-5 rounded-2xl items-center gap-3 transition-all shadow-xl hover:-translate-y-1"
          >
            Comenzar diagnóstico gratuito
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </section>

    </div>
  );
}