"use client";
import { openCustomerPortal } from "@/actions/customer-portal-action";
import { deletePet, updatePet } from "@/actions/pet-actions";
import {
  Plus, Trash2, Settings, CreditCard, Dog, Cat, X, Save,
  Activity, Package, Truck, CheckCircle2,
  ChevronLeft, ChevronRight, PawPrint
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/quiz/ImageUpload";
import { ErrorModal } from "@/components/dashboard/modals/ErrorModal";
import { DeletePetModal } from "@/components/dashboard/modals/DeletePetModal";

interface PetData {
  id: number;
  userId: string;
  name: string;
  species: string;
  breed: string | null;
  isMixed: boolean;
  birthDate: Date;
  weightKg: string;
  lifeStage: string | null;
  photoUrl: string | null;
  createdAt: Date;
}

interface ProductData {
  id: number;
  categoryId: number | null;
  name: string;
  description: string;
  ingredients: string | null;
  price: string;
  subscriptionPrice: string;
  imageUrl: string | null;
  isActive: boolean;
}

interface OrderData {
  id: number;
  subscriptionId: number;
  status: string;
  trackingNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SubRecord {
  id: number;
  userId: string;
  petId: number;
  planId: number;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodEnd: Date;
  createdAt: Date;
}

interface PlanRecord {
  id: number;
  name: string;
  description: string | null;
  price: string;
  stripePriceId: string;
  stripeProductId: string | null;
  interval: string;
  isActive: boolean;
}

interface SubData {
  subscription: SubRecord;
  plan: PlanRecord | null;
  products: ProductData[];
  orders: OrderData[];
}

function calcAge(birthDate: Date | string | null): number {
  if (!birthDate) return 0;
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

const SUBS_PER_PAGE  = 2;
const PETS_PER_PAGE  = 6;

export function DashboardClient({ initialPets, initialSubs }: { initialPets: PetData[]; initialSubs: SubData[]; }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({ isOpen: false, message: "" });
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; petId: number | null; petName: string; hasActiveSub: boolean }>({ isOpen: false, petId: null, petName: "", hasActiveSub: false });
  const [editingPetId, setEditingPetId] = useState<number | null>(null);
  const [editData, setEditData] = useState({ name: "", weightKg: "", breed: "", isMixed: false, ageYears: "", photoUrl: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [subsPage, setSubsPage] = useState(1);
  const [petsPage, setPetsPage] = useState(1);

  useEffect(() => { setMounted(true); }, []);

  const handleOpenPortal = async () => {
    setIsRedirecting(true);
    try { await openCustomerPortal(); }
    catch { setErrorModal({ isOpen: true, message: "Error al conectar con la pasarela de pagos." }); setIsRedirecting(false); }
  };

  const openEdit = (pet: PetData) => {
    setEditData({ name: pet.name, weightKg: pet.weightKg || "", breed: pet.breed || "", isMixed: pet.isMixed || false, ageYears: calcAge(pet.birthDate).toString(), photoUrl: pet.photoUrl || "" });
    setEditingPetId(pet.id);
  };

  const handleSave = async (petId: number) => {
    setIsSaving(true);
    const result = await updatePet(petId, { name: editData.name, weightKg: parseFloat(editData.weightKg), photoUrl: editData.photoUrl, breed: editData.breed, isMixed: editData.isMixed, ageYears: editData.ageYears ? parseFloat(editData.ageYears) : undefined });
    setIsSaving(false);
    if (result.success) { setEditingPetId(null); router.refresh(); }
    else setErrorModal({ isOpen: true, message: result.error || "Error al guardar." });
  };

  const requestDelete = (pet: PetData) => {
    const hasActiveSub = initialSubs.some(s => s.subscription?.petId === pet.id && s.subscription?.status === "active");
    setDeleteModal({ isOpen: true, petId: pet.id, petName: pet.name, hasActiveSub });
  };

  const confirmDelete = async () => {
    if (!deleteModal.petId) return;
    const result = await deletePet(deleteModal.petId);
    setDeleteModal({ isOpen: false, petId: null, petName: "", hasActiveSub: false });
    if (!result.success) setErrorModal({ isOpen: true, message: result.error || "No se pudo eliminar." });
    else router.refresh();
  };

  const stageBadge: Record<string, { label: string; cls: string }> = {
    senior: { label: "Senior", cls: "bg-amber-100 text-amber-800 border-amber-200" },
    adult:  { label: "Adulto", cls: "bg-blue-100 text-blue-800 border-blue-200" },
    puppy:  { label: "Cachorro", cls: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  };

  const totalSubsPages = Math.max(1, Math.ceil(initialSubs.length / SUBS_PER_PAGE));
  const paginatedSubs  = initialSubs.slice((subsPage - 1) * SUBS_PER_PAGE, subsPage * SUBS_PER_PAGE);
  const totalPetsPages = Math.max(1, Math.ceil(initialPets.length / PETS_PER_PAGE));
  const paginatedPets  = initialPets.slice((petsPage - 1) * PETS_PER_PAGE, petsPage * PETS_PER_PAGE);

  const PaginationBar = ({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) => (
    total > 1 ? (
      <div className="flex items-center justify-end gap-2 mt-6">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-500 font-bold uppercase tracking-widest px-2">Pág {page} de {total}</span>
        <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total}
          className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    ) : null
  );

  return (
    <>
      <div className="space-y-12 animate-in fade-in duration-500">
        {/* ── Planes Activos ── */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tus Planes Activos</h2>
            {initialSubs.length > 0 && (
              <Link href="/planes" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full transition-colors">
                <Plus className="w-3 h-3" /> Nuevo plan
              </Link>
            )}
          </div>
          {initialSubs.length === 0 ? (
            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border-2 border-dashed border-slate-200 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100">
                <Activity className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-2 tracking-tight">Aún no tienes suscripciones activas</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-md mx-auto font-medium leading-relaxed">
                Realiza el diagnóstico gratuito y deja que nuestro motor biológico te asigne el plan perfecto.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/quiz" className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
                  <Activity className="w-4 h-4" /> Hacer diagnóstico
                </Link>
                <Link href="/planes" className="inline-flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-2xl hover:border-slate-300 hover:bg-slate-50 transition-all">
                  Ver catálogo de planes
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {paginatedSubs.map((subData, index) => {
                  const currentOrder = subData.orders[0];
                  return (
                    <div key={index} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
                      <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-2xl rounded-full -mr-10 -mt-10" />
                        <div className="relative z-10 flex items-start justify-between gap-4">
                          <div>
                            <span className={`inline-block mb-2 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${subData.subscription.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                              {subData.subscription.status === "active" ? "● Activa" : subData.subscription.status}
                            </span>
                            <h3 className="text-xl font-black tracking-tight leading-tight">{subData.plan?.name || "Plan"}</h3>
                            <p className="text-slate-400 text-xs font-medium mt-1">
                              Próximo ciclo: {new Date(subData.subscription.currentPeriodEnd).toLocaleDateString("es-PE")}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Mes</p>
                            <p className="text-2xl font-black text-white">S/ {subData.plan?.price}</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-6 flex flex-col gap-6 flex-1">
                        {currentOrder && (
                          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                            <div className="bg-white p-2.5 rounded-xl shadow-sm border border-slate-100 shrink-0">
                              <Truck className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Caja actual</p>
                              <p className="font-bold text-slate-900 text-sm">{currentOrder.status}</p>
                            </div>
                          </div>
                        )}
                        {subData.products.length > 0 && (
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Fórmulas incluidas</p>
                            <div className="flex flex-wrap gap-2">
                              {subData.products.map((p) => (
                                <div key={p.id} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl pr-3 pl-1 py-1">
                                  {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.name} className="w-6 h-6 rounded-lg object-cover" />
                                  ) : (
                                    <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center">
                                      <Package className="w-3 h-3 text-slate-400" />
                                    </div>
                                  )}
                                  <span className="text-xs font-bold text-slate-700 max-w-[120px] truncate">{p.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="mt-auto pt-4 border-t border-slate-100">
                          <button onClick={handleOpenPortal} disabled={isRedirecting}
                            className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all disabled:opacity-50 active:scale-95">
                            <CreditCard className="w-4 h-4" />
                            {isRedirecting ? "Conectando..." : "Gestionar Suscripción"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <PaginationBar page={subsPage} total={totalSubsPages} onChange={setSubsPage} />
            </>
          )}
        </section>

        {/* ── Mascotas ── */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Tus Mascotas</h2>
            <Link href="/quiz" className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full transition-colors">
              <Plus className="w-3 h-3" /> Añadir Perfil
            </Link>
          </div>
          {initialPets.length === 0 ? (
            <div className="bg-white p-10 md:p-14 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-slate-100">
                <PawPrint className="w-8 h-8 text-slate-300" strokeWidth={1.5} />
              </div>
              <h3 className="font-black text-slate-900 text-xl mb-2 tracking-tight">Aún no has registrado a tu compañero</h3>
              <p className="text-slate-500 text-sm mb-8 max-w-sm mx-auto font-medium leading-relaxed">
                Empieza creando su perfil biológico para acceder a recomendaciones nutricionales precisas.
              </p>
              <Link href="/quiz" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-black text-xs uppercase tracking-widest px-8 py-4 rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 active:scale-95">
                <Activity className="w-4 h-4" /> Registrar mi mascota
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPets.map(pet => {
                  const badge = stageBadge[pet.lifeStage ?? "adult"] ?? stageBadge.adult;
                  const ageYears = calcAge(pet.birthDate);
                  return (
                    <div key={pet.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">
                      {editingPetId === pet.id ? (
                        <div className="p-6 flex flex-col gap-4 flex-1 bg-slate-50/50">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">Editar Perfil</h4>
                            <button type="button" onClick={() => setEditingPetId(null)} className="p-1.5 bg-white border border-slate-200 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-colors">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          <ImageUpload value={editData.photoUrl} onChange={url => setEditData(p => ({ ...p, photoUrl: url }))} />
                          <div className="space-y-3 mt-2">
                            <div>
                              <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Nombre</label>
                              <input value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} required className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none font-bold text-slate-900 text-sm transition-all" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Peso (kg)</label>
                                <input type="number" step="0.1" value={editData.weightKg} onChange={e => setEditData(p => ({ ...p, weightKg: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none font-bold text-slate-900 text-sm transition-all" />
                              </div>
                              <div>
                                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest ml-1">Edad</label>
                                <input type="number" step="0.5" value={editData.ageYears} onChange={e => setEditData(p => ({ ...p, ageYears: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 outline-none font-bold text-slate-900 text-sm transition-all" />
                              </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-3 rounded-xl border border-slate-200">
                              <input type="checkbox" checked={editData.isMixed} onChange={e => setEditData(p => ({ ...p, isMixed: e.target.checked, breed: e.target.checked ? "" : p.breed }))} className="w-4 h-4 accent-emerald-600 rounded" />
                              <span className="text-xs font-bold text-slate-700">Mascota Híbrida/Cruzada</span>
                            </label>
                          </div>
                          <div className="mt-auto pt-4">
                            <button type="button" onClick={() => handleSave(pet.id)} disabled={isSaving} className="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50 active:scale-95 shadow-lg shadow-emerald-600/20">
                              <Save className="w-4 h-4" /> {isSaving ? "Guardando..." : "Guardar Cambios"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="relative w-full aspect-[4/3] bg-slate-100 overflow-hidden group">
                            {pet.photoUrl ? (
                              <Image src={pet.photoUrl} alt={pet.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-slate-50">
                                {pet.species === "dog" ? <Dog className="w-12 h-12 text-slate-300" strokeWidth={1} /> : <Cat className="w-12 h-12 text-slate-300" strokeWidth={1} />}
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1.5 rounded-md shadow-sm border ${badge.cls}`}>
                                {badge.label}
                              </span>
                            </div>
                          </div>
                          <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight truncate">{pet.name}</h3>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6 flex-1">
                              <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Peso</p>
                                <p className="font-bold text-slate-700 text-sm">{pet.weightKg} kg</p>
                              </div>
                              <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Edad</p>
                                <p className="font-bold text-slate-700 text-sm">{ageYears > 0 ? `${ageYears} años` : "-"}</p>
                              </div>
                              <div className="col-span-2">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Raza / Tipo</p>
                                <p className="font-bold text-slate-700 text-sm truncate">
                                  {pet.isMixed ? "Híbrida" : (pet.breed || "No especificado")}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-auto">
                              <button onClick={() => openEdit(pet)} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 text-slate-600 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors text-xs">
                                <Settings className="w-3.5 h-3.5" /> Editar
                              </button>
                              <button onClick={() => requestDelete(pet)} className="px-4 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
              <PaginationBar page={petsPage} total={totalPetsPages} onChange={setPetsPage} />
            </>
          )}
        </section>
      </div>
      {mounted && deleteModal.isOpen && (
        <DeletePetModal petName={deleteModal.petName} hasActiveSub={deleteModal.hasActiveSub} onConfirm={confirmDelete} onClose={() => setDeleteModal({ isOpen: false, petId: null, petName: "", hasActiveSub: false })} />
      )}
      {mounted && errorModal.isOpen && (
        <ErrorModal message={errorModal.message} onClose={() => setErrorModal({ isOpen: false, message: "" })} />
      )}
    </>
  );
}