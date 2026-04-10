import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";

// Iconos SVG personalizados (lucide-react no incluye LinkedIn ni GitHub)
function IconLinkedIn() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}
function IconGitHub() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}
function IconInstagram() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
    </svg>
  );
}
function IconX() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
}

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-10 font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* Columna 1: Logo e Info */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-5 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Mascotiq" width={44} height={44} />
              <span className="text-xl font-black text-slate-900 tracking-tighter">Mascotiq</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Suscripciones nutricionales inteligentes basadas en la etapa biológica real de tu mascota.
            </p>

            {/* Redes sociales — todas abren en nueva pestaña */}
            <div className="flex justify-center sm:justify-start gap-3">
              <a
                href="https://www.instagram.com/_leoyc/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                aria-label="Instagram"
              >
                <IconInstagram />
              </a>
              <a
                href="https://www.linkedin.com/in/leonardo-yup%C3%A1n-cr%C3%BAz-4b7158336/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                aria-label="LinkedIn"
              >
                <IconLinkedIn />
              </a>
              <a
                href="https://x.com/_leoyc"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                aria-label="X / Twitter"
              >
                <IconX />
              </a>
              <a
                href="https://github.com/Leonardo-YC"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                aria-label="GitHub"
              >
                <IconGitHub />
              </a>
            </div>
          </div>

          {/* Columna 2: Compañía */}
          <div className="text-center sm:text-left lg:ml-4">
            <h4 className="font-black text-slate-900 mb-5 uppercase text-xs tracking-[0.2em]">Compañía</h4>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link href="/nosotros" className="text-slate-500 hover:text-emerald-600 transition-colors">Sobre Nosotros</Link></li>
              <li><Link href="/faq" className="text-slate-500 hover:text-emerald-600 transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link href="/contacto" className="text-slate-500 hover:text-emerald-600 transition-colors">Contacto</Link></li>
            </ul>
          </div>

          {/* Columna 3: Plataforma */}
          <div className="text-center sm:text-left">
            <h4 className="font-black text-slate-900 mb-5 uppercase text-xs tracking-[0.2em]">Plataforma</h4>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link href="/planes" className="text-slate-500 hover:text-emerald-600 transition-colors">Nuestros Planes</Link></li>
              <li><Link href="/catalogo" className="text-slate-500 hover:text-emerald-600 transition-colors">Catálogo de Productos</Link></li>
              <li><Link href="/quiz" className="text-slate-500 hover:text-emerald-600 transition-colors">Diagnóstico Gratuito</Link></li>
              <li><Link href="/dashboard" className="text-slate-500 hover:text-emerald-600 transition-colors">Mi Panel Personal</Link></li>
            </ul>
          </div>

          {/* Columna 4: Legal */}
          <div className="text-center sm:text-left">
            <h4 className="font-black text-slate-900 mb-5 uppercase text-xs tracking-[0.2em]">Legal</h4>
            <ul className="space-y-3 font-bold text-sm">
              <li><Link href="/terminos" className="text-slate-500 hover:text-emerald-600 transition-colors">Términos y Condiciones</Link></li>
              <li><Link href="/privacidad" className="text-slate-500 hover:text-emerald-600 transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/reembolsos" className="text-slate-500 hover:text-emerald-600 transition-colors">Política de Reembolsos</Link></li>
            </ul>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-400 text-center md:text-left">
            © {currentYear} Mascotiq. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full">
            Hecho con <Heart className="w-3 h-3 text-emerald-500 fill-current mx-1" /> para tus mejores amigos
          </div>
        </div>
      </div>
    </footer>
  );
}