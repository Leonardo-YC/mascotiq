import { db } from "@/lib/db/index";
import { users, pets, subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Users, Crown, Dog } from "lucide-react";
import { UserManagerClient } from "@/components/admin/UserManagerClient";
import { auth } from "@clerk/nextjs/server";

export default async function UsersManagerPage() {
  const { sessionClaims } = await auth();
  const callerRole = (sessionClaims?.metadata as { role?: string })?.role;
  const isAdmin = callerRole === "admin";

  const allUsers = await db.select().from(users);

  const usersWithData = await Promise.all(
    allUsers.map(async user => {
      const userPets = await db.select().from(pets).where(eq(pets.userId, user.id));
      const userSubs = await db.select().from(subscriptions).where(eq(subscriptions.userId, user.id));
      const activeSubs = userSubs.filter(s => s.status === "active").length;
      return { ...user, pets: userPets, activeSubs, totalSubs: userSubs.length };
    })
  );

  const totalUsers  = usersWithData.length;
  const totalActive = usersWithData.filter(u => u.activeSubs > 0).length;
  const totalPets   = usersWithData.reduce((acc, u) => acc + u.pets.length, 0);

  return (
    <div className="space-y-10 animate-in fade-in duration-500 font-sans pb-10 w-full overflow-hidden">
      
      {/* 🚀 Cabecera Boutique */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-slate-600 text-[10px] font-black uppercase tracking-widest mb-3 border border-slate-200">
            <Users className="w-3.5 h-3.5" /> Comunidad
          </div>
          <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-slate-900">Gestión de Usuarios</h1>
          <p className="text-slate-500 mt-2 font-medium text-sm">
            Administra la base de clientes registrados.
            {isAdmin && " Como admin puedes invitar equipo y cambiar roles."}
          </p>
        </div>
      </div>

      {/* 📈 Tarjetas de Métricas */}
      {/* FIX: Se ajustó el Grid a 1 col (móvil), 2 col (tablet/laptops peq), 3 col (PC grande) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow min-w-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border bg-emerald-50 text-emerald-600 border-emerald-100 shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mb-1.5 truncate">Total Usuarios</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{totalUsers}</p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow min-w-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border bg-blue-50 text-blue-600 border-blue-100 shrink-0">
            <Crown className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mb-1.5 truncate">Con Suscripción</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{totalActive}</p>
        </div>

        <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow min-w-0">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border bg-amber-50 text-amber-600 border-amber-100 shrink-0">
            <Dog className="w-6 h-6" />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight mb-1.5 truncate">Mascotas Registradas</p>
          <p className="text-3xl font-black text-slate-900 tracking-tighter">{totalPets}</p>
        </div>
      </div>

      {/* 🧩 Componente Interactivo */}
      <UserManagerClient users={usersWithData} isAdmin={isAdmin} />
      
    </div>
  );
}