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
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Gestión de Usuarios</h1>
        <p className="text-slate-500 mt-1 font-medium text-sm">
          Administra los dueños de mascotas registrados.
          {isAdmin && " Como admin puedes invitar nuevos usuarios y cambiar roles."}
        </p>
      </div>

      {/* Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-50 p-3 rounded-xl"><Users className="w-6 h-6 text-emerald-600" /></div>
          <div>
            <p className="text-2xl font-black text-slate-900">{totalUsers}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total usuarios</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-xl"><Crown className="w-6 h-6 text-blue-600" /></div>
          <div>
            <p className="text-2xl font-black text-slate-900">{totalActive}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Con suscripción</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="bg-amber-50 p-3 rounded-xl"><Dog className="w-6 h-6 text-amber-600" /></div>
          <div>
            <p className="text-2xl font-black text-slate-900">{totalPets}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Mascotas registradas</p>
          </div>
        </div>
      </div>

      <UserManagerClient users={usersWithData} isAdmin={isAdmin} />
    </div>
  );
}