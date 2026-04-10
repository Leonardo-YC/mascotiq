// 👇 Importación actualizada apuntando a la nueva subcarpeta
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* 📱 Sidebar Lateral (Importado como componente modular) */}
      <AdminSidebar />

      {/* 🖥️ Contenido Principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}