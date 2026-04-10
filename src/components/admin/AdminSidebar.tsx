"use client";
import { UserButton, useUser } from "@clerk/nextjs";
import { LayoutDashboard, PackageSearch, Users, Layers, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const role = (user?.publicMetadata as { role?: string })?.role || "user";

  const links =
    role === "staff"
      ? [{ href: "/admin/pedidos", label: "Pedidos", icon: Truck }]
      : [
          { href: "/admin",           label: "Métricas", icon: LayoutDashboard },
          { href: "/admin/catalogo",  label: "Catálogo", icon: PackageSearch },
          { href: "/admin/planes",    label: "Planes",   icon: Layers },
          { href: "/admin/pedidos",   label: "Pedidos",  icon: Truck },
          { href: "/admin/usuarios",  label: "Usuarios", icon: Users },
        ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex-col hidden md:flex">
      {/* ── Logo + Branding ── */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/admin" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
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
            <h2 className="text-xl font-black text-emerald-400 tracking-tight leading-none">Mascotiq</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">Admin Panel</p>
          </div>
        </Link>
      </div>

      {/* ── Nav links ── */}
      <nav className="flex-1 p-4 space-y-1.5">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
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
      <div className="p-4 border-t border-slate-800 flex items-center gap-3">
        <div className="bg-slate-800 p-1 rounded-full">
          <UserButton />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-bold text-white truncate">
            {user?.firstName || "Usuario"}
          </span>
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
            {role}
          </span>
        </div>
      </div>
    </aside>
  );
}