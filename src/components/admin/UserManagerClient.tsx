"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Mail, Dog, Cat, Crown, UserCircle2, Trash2,
  AlertTriangle, Search, Filter, ChevronLeft, ChevronRight,
  UserPlus, X, Send
} from "lucide-react";
import { deleteUser, updateUserRole, inviteUser } from "@/actions/user-actions";

interface Pet { id: number; name: string; species: string; lifeStage: string | null }
interface UserData {
  id: string; name: string; email: string; createdAt: Date; role: string;
  pets: Pet[]; activeSubs: number; totalSubs: number;
}

const PAGE_SIZE = 10;

export function UserManagerClient({
  users,
  isAdmin,
}: {
  users: UserData[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState<"all" | "active" | "free">("all");
  const [page, setPage]       = useState(1);

  // Modal eliminar
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: string; userName: string }>({
    isOpen: false, userId: "", userName: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  // Modal cambio de rol
  const [roleModal, setRoleModal] = useState<{
    isOpen: boolean; userId: string; userName: string; newRole: "user" | "staff" | "admin";
  }>({ isOpen: false, userId: "", userName: "", newRole: "user" });
  const [isChangingRole, setIsChangingRole] = useState(false);

  // Modal invitar
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole]   = useState<"user" | "staff" | "admin">("user");
  const [isInviting, setIsInviting]   = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);

  const filtered = useMemo(() => {
    return users.filter(u => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.pets.some(p => p.name.toLowerCase().includes(search.toLowerCase()));
      const matchesFilter =
        filter === "all" ? true :
        filter === "active" ? u.activeSubs > 0 : u.activeSubs === 0;
      return matchesSearch && matchesFilter;
    });
  }, [users, search, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFilterChange = (v: "all" | "active" | "free") => { setFilter(v); setPage(1); };

  const confirmDelete = async () => {
    setIsDeleting(true);
    await deleteUser(deleteModal.userId);
    setIsDeleting(false);
    setDeleteModal({ isOpen: false, userId: "", userName: "" });
    router.refresh();
  };

  const handleRoleChange = (userId: string, userName: string, newRole: "user" | "staff" | "admin") => {
    setRoleModal({ isOpen: true, userId, userName, newRole });
  };

  const confirmRoleChange = async () => {
    setIsChangingRole(true);
    await updateUserRole(roleModal.userId, roleModal.newRole);
    setIsChangingRole(false);
    setRoleModal({ isOpen: false, userId: "", userName: "", newRole: "user" });
    router.refresh();
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInviting(true);
    setInviteError("");
    const result = await inviteUser(inviteEmail, inviteRole);
    setIsInviting(false);
    if (result.success) {
      setInviteSuccess(true);
      setTimeout(() => {
        setInviteSuccess(false);
        setInviteModal(false);
        setInviteEmail("");
        setInviteRole("user");
      }, 2500);
    } else {
      setInviteError(result.error || "Error al invitar.");
    }
  };

  const roleLabels: Record<string, string> = {
    user: "Cliente", staff: "Staff (Logística)", admin: "Administrador",
  };

  return (
    <>
      {/* Cabecera con botón Invitar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="bg-white flex-1 p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 ml-1 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Buscar por nombre, correo o mascota..."
              className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm"
            />
          </div>
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
            <Filter className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
            {([["all", "Todos"], ["active", "Suscritos"], ["free", "Gratuitos"]] as const).map(([val, label]) => (
              <button
                key={val}
                onClick={() => handleFilterChange(val)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filter === val ? "bg-slate-900 text-white" : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Botón invitar — solo admin */}
        {isAdmin && (
          <button
            onClick={() => setInviteModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 text-sm transition-colors shadow-sm shrink-0"
          >
            <UserPlus className="w-4 h-4" /> Invitar Usuario
          </button>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="p-4">Cliente</th>
                <th className="p-4">Mascotas</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Rol</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-400 font-medium text-sm">
                    No se encontraron usuarios.
                  </td>
                </tr>
              ) : (
                paginated.map(user => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center shrink-0">
                          <UserCircle2 className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.pets.length === 0 ? (
                        <span className="text-slate-400 text-xs">Sin mascotas</span>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {user.pets.slice(0, 2).map(pet => (
                            <div key={pet.id} className="flex items-center gap-1.5">
                              {pet.species === "dog"
                                ? <Dog className="w-3.5 h-3.5 text-slate-400" />
                                : <Cat className="w-3.5 h-3.5 text-slate-400" />
                              }
                              <span className="text-xs font-semibold text-slate-700">{pet.name}</span>
                              {pet.lifeStage === "senior" && (
                                <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full font-bold">
                                  Senior
                                </span>
                              )}
                            </div>
                          ))}
                          {user.pets.length > 2 && (
                            <span className="text-xs text-slate-400 font-medium">+{user.pets.length - 2} más</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      {user.activeSubs > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <Crown className="w-3 h-3" /> Suscrito
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                          Gratuito
                        </span>
                      )}
                    </td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={e => handleRoleChange(user.id, user.name, e.target.value as any)}
                        disabled={!isAdmin}
                        className={`text-xs font-bold py-1.5 px-2 rounded-lg border cursor-pointer focus:outline-none transition-colors disabled:cursor-default ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : user.role === "staff"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        <option value="user">Cliente</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <a
                          href={`mailto:${user.email}`}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                        {isAdmin && (
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, userId: user.id, userName: user.name })}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
            <p className="text-xs text-slate-500 font-medium">
              Página {page} de {totalPages} · {filtered.length} usuarios
            </p>
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 disabled:opacity-30">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200 disabled:opacity-30">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal eliminar */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl mx-4 text-center">
            <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">¿Eliminar usuario?</h3>
            <p className="text-slate-500 text-sm mb-1">
              Estás a punto de eliminar a <strong>{deleteModal.userName}</strong>.
            </p>
            <p className="text-xs text-red-500 font-medium mb-6">
              Se eliminarán también sus mascotas y suscripciones.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal({ isOpen: false, userId: "", userName: "" })} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 text-sm">Cancelar</button>
              <button onClick={confirmDelete} disabled={isDeleting} className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 disabled:opacity-50 text-sm">
                {isDeleting ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal cambio de rol */}
      {roleModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl mx-4 text-center">
            <h3 className="text-lg font-black text-slate-900 mb-2">¿Cambiar rol?</h3>
            <p className="text-slate-500 text-sm mb-6">
              Cambiarás el rol de <strong>{roleModal.userName}</strong> a{" "}
              <strong className={roleModal.newRole === "admin" ? "text-purple-700" : roleModal.newRole === "staff" ? "text-blue-700" : "text-slate-700"}>
                {roleLabels[roleModal.newRole]}
              </strong>.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setRoleModal({ isOpen: false, userId: "", userName: "", newRole: "user" })} className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 text-sm">Cancelar</button>
              <button onClick={confirmRoleChange} disabled={isChangingRole} className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-50 text-sm">
                {isChangingRole ? "Guardando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal invitar usuario */}
      {inviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-emerald-600" /> Invitar Usuario
              </h3>
              <button onClick={() => { setInviteModal(false); setInviteError(""); setInviteSuccess(false); }} className="text-slate-400 hover:text-slate-600 p-1.5 hover:bg-slate-100 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            {inviteSuccess ? (
              <div className="p-8 text-center">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="font-bold text-slate-900 mb-1">¡Invitación enviada!</p>
                <p className="text-sm text-slate-500">El usuario recibirá un correo para crear su cuenta.</p>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="p-5 space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Correo electrónico</label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full mt-1 border-b-2 border-slate-200 py-2 focus:border-emerald-500 focus:outline-none text-slate-900 bg-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Rol asignado</label>
                  <select
                    value={inviteRole}
                    onChange={e => setInviteRole(e.target.value as any)}
                    className="w-full mt-1 border-b-2 border-slate-200 py-2 focus:border-emerald-500 focus:outline-none text-slate-700 bg-transparent text-sm"
                  >
                    <option value="user">Cliente</option>
                    <option value="staff">Staff (Logística)</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                {inviteError && (
                  <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{inviteError}</p>
                )}
                <p className="text-xs text-slate-400">
                  El usuario recibirá un correo de Clerk para registrarse. El rol se asignará automáticamente.
                </p>
                <button
                  type="submit"
                  disabled={isInviting}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> {isInviting ? "Enviando..." : "Enviar Invitación"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}