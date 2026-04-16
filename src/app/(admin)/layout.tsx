"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* 🍔 Barra Superior (Solo visible en Móvil) para abrir el Menú */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 z-40 flex items-center px-4 shadow-md justify-between">
         <h2 className="text-xl font-black text-emerald-400 tracking-tight leading-none">Mascotiq OS</h2>
         <button 
           onClick={() => setIsSidebarOpen(true)}
           className="text-white p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
         >
           <Menu className="w-6 h-6" />
         </button>
      </div>

      {/* 📱 Overlay de fondo oscuro en móvil cuando el menú está abierto */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 📱 Sidebar Lateral (Responsive) */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out w-72 bg-slate-900
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        {/* Botón de cerrar en móvil, posicionado dentro del sidebar */}
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden absolute top-4 right-4 text-slate-400 hover:text-white p-1"
        >
          <X className="w-6 h-6" />
        </button>
        <AdminSidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* 🖥️ Contenido Principal */}
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0"> {/* pt-16 da espacio a la barra superior en móvil */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}