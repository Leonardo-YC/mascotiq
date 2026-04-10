"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth, UserButton } from "@clerk/nextjs";
import { Menu, X, ShoppingBag, Activity, LayoutDashboard, Users, Layers, Mail } from "lucide-react";

export function PublicNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoaded, userId } = useAuth();
  const isSignedIn = !!userId;
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50 shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between h-20">

          <div className="flex items-center gap-8">
            <Link
              href={isLoaded && isSignedIn ? "/dashboard" : "/"}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity shrink-0"
            >
              <Image src="/logo.svg" alt="Mascotiq Logo" width={56} height={56} className="w-12 h-12 md:w-14 md:h-14" />
              <span className="text-2xl font-black text-slate-900 tracking-tighter">Mascotiq</span>
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              <Link href="/planes" className="text-slate-500 hover:text-emerald-600 font-bold text-sm transition-colors flex items-center gap-1.5">
                <Layers className="w-4 h-4" /> Planes
              </Link>
              <Link href="/catalogo" className="text-slate-500 hover:text-emerald-600 font-bold text-sm transition-colors flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4" /> Catálogo
              </Link>
              <Link href="/quiz" className="text-slate-500 hover:text-emerald-600 font-bold text-sm transition-colors flex items-center gap-1.5">
                <Activity className="w-4 h-4" />
                {isLoaded && isSignedIn ? "Nuevo Diagnóstico" : "Diagnóstico"}
              </Link>
              <Link href="/nosotros" className="text-slate-500 hover:text-emerald-600 font-bold text-sm transition-colors flex items-center gap-1.5">
                <Users className="w-4 h-4" /> Nosotros
              </Link>
              <Link href="/contacto" className="text-slate-500 hover:text-emerald-600 font-bold text-sm transition-colors flex items-center gap-1.5">
                <Mail className="w-4 h-4" /> Contacto
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            {!isLoaded && (
              <div className="flex items-center gap-4">
                <div className="h-8 w-24 bg-slate-100 rounded-xl animate-pulse" />
                <div className="h-9 w-28 bg-slate-100 rounded-2xl animate-pulse" />
              </div>
            )}
            {isLoaded && !isSignedIn && (
              <>
                <Link href="/sign-in" className="text-slate-600 font-bold hover:text-emerald-600 transition-colors text-sm">
                  Iniciar Sesión
                </Link>
                <Link href="/quiz" className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 active:scale-95 text-sm">
                  Empezar gratis
                </Link>
              </>
            )}
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-6">
                <Link href="/dashboard" className="flex items-center gap-2 text-slate-600 font-bold hover:text-emerald-600 transition-colors text-sm">
                  <LayoutDashboard className="w-4 h-4" /> Mi Panel
                </Link>
                <div className="h-8 w-[1px] bg-slate-100" />
                <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-emerald-500/10" } }} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            {!isLoaded && <div className="w-9 h-9 bg-slate-100 rounded-full animate-pulse" />}
            {isLoaded && isSignedIn && (
              <UserButton appearance={{ elements: { avatarBox: "w-9 h-9 border-2 border-emerald-500/10" } }} />
            )}
            <button onClick={toggleMobileMenu} className="text-slate-900 p-2 hover:bg-slate-50 rounded-xl transition-colors outline-none">
              {isMobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top-2">
          <div className="px-6 py-8 space-y-6 shadow-2xl">
            <Link href="/planes" onClick={toggleMobileMenu} className="flex items-center gap-4 text-slate-900 font-bold text-lg"><Layers className="w-5 h-5 text-emerald-500" /> Planes</Link>
            <Link href="/catalogo" onClick={toggleMobileMenu} className="flex items-center gap-4 text-slate-900 font-bold text-lg"><ShoppingBag className="w-5 h-5 text-emerald-500" /> Catálogo</Link>
            <Link href="/quiz" onClick={toggleMobileMenu} className="flex items-center gap-4 text-slate-900 font-bold text-lg">
              <Activity className="w-5 h-5 text-emerald-500" />
              {isLoaded && isSignedIn ? "Nuevo Diagnóstico" : "Diagnóstico Gratuito"}
            </Link>
            <Link href="/nosotros" onClick={toggleMobileMenu} className="flex items-center gap-4 text-slate-900 font-bold text-lg"><Users className="w-5 h-5 text-emerald-500" /> Nosotros</Link>
            <Link href="/contacto" onClick={toggleMobileMenu} className="flex items-center gap-4 text-slate-900 font-bold text-lg"><Mail className="w-5 h-5 text-emerald-500" /> Contacto</Link>
            <div className="pt-6 border-t border-slate-100 space-y-3">
              {!isLoaded && <div className="h-14 bg-slate-100 rounded-2xl animate-pulse" />}
              {isLoaded && !isSignedIn && (
                <>
                  <Link href="/quiz" onClick={toggleMobileMenu} className="block w-full text-center py-4 bg-slate-900 text-white font-bold rounded-2xl">Empezar Gratis</Link>
                  <Link href="/sign-in" onClick={toggleMobileMenu} className="block w-full text-center py-4 text-slate-600 font-bold">Ya tengo cuenta</Link>
                </>
              )}
              {isLoaded && isSignedIn && (
                <Link href="/dashboard" onClick={toggleMobileMenu} className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-4 rounded-2xl text-emerald-700 font-bold text-lg">
                  Ir a Mi Panel <LayoutDashboard className="w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}