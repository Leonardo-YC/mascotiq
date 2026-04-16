"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, PackageSearch, Users, Layers, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function AdminSidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user } = useUser();
  const role = (user?.publicMetadata as { role?: string })?.role || "user";

  const links =
    role === "staff"
      ? [{ href: "/admin/pedidos", label: "Pedidos", icon: Truck }]
      : [
          { href: "/admin",          label: "Métricas", icon: LayoutDashboard },
          { href: "/admin/catalogo",  label: "Catálogo", icon: PackageSearch },
          { href: "/admin/planes",    label: "Planes",   icon: Layers },
          { href: "/admin/pedidos",   label: "Pedidos",  icon: Truck },
          { href: "/admin/usuarios",  label: "Usuarios", icon: Users },
        ];

  return (
    <aside className="w-72 bg-slate-900 text-white flex flex-col shadow-2xl h-full">
      {/* ── Logo + Branding ── */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/admin" onClick={onClose} className="flex items-center gap-3 hover:opacity-90 transition-opacity w-max">
          <div className="bg-white/10 p-1.5 rounded-xl shrink-0">
            <Image
              src="/logo.svg"
              alt="Mascotiq Logo"
              width={36}
              height={36}
              className="w-9 h-9 object-contain"
            />
          </div>
          <div>
            <h2 className="text-2xl font-black text-emerald-400 tracking-tighter leading-none">Mascotiq</h2>
            <p className="text-[9px] text-slate-500 uppercase tracking-[0.2em] font-bold mt-1">Admin OS</p>
          </div>
        </Link>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 p-5 space-y-2 overflow-y-auto">
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4 px-3">Gestión Principal</p>
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all text-sm font-bold ${
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* ── User info ── */}
      <div className="p-6 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/10">
          <div className="bg-slate-800 p-0.5 rounded-full shrink-0 shadow-sm">
            <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10" } }} />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-black text-white truncate tracking-tight">
              {user?.firstName || "Usuario"}
            </span>
            <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest mt-0.5">
              {role}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}