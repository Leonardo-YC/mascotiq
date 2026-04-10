"use client";
import { openCustomerPortal } from "@/actions/customer-portal-action";
import { deletePet, updatePet } from "@/actions/pet-actions";
import {
  Plus, Trash2, Settings, CreditCard, Dog, Cat, X, Save,
  Activity, Package, Truck, CheckCircle2, Camera,
  ChevronLeft, ChevronRight, PawPrint
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/quiz/ImageUpload";
import { ErrorModal } from "@/components/dashboard/modals/ErrorModal";
import { DeletePetModal } from "@/components/dashboard/modals/DeletePetModal";

function calcAge(birthDate: any): number {
  if (!birthDate) return 0;
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

const SUBS_PER_PAGE  = 2;
const PETS_PER_PAGE  = 6;

export function DashboardClient({
  initialPets,
  initialSubs,
}: {
  initialPets: any[];
  initialSubs: any[];
}) {
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

  const openEdit = (pet: any) => {
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

  const requestDelete = (pet: any) => {
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
    senior: { label: "Senior", cls: "bg-amber-50 text-amber-700 border border-amber-200" },
    adult:  { label: "Adulto", cls: "bg-blue-50 text-blue-700 border border-blue-200" },
    puppy:  { label: "Cachorro", cls: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  };

  // Paginación de suscripciones
  const totalSubsPages = Math.max(1, Math.ceil(initialSubs.length / SUBS_PER_PAGE));
  const paginatedSubs  = initialSubs.slice((subsPage - 1) * SUBS_PER_PAGE, subsPage * SUBS_PER_PAGE);

  // Paginación de mascotas
  const totalPetsPages = Math.max(1, Math.ceil(initialPets.length / PETS_PER_PAGE));
  const paginatedPets  = initialPets.slice((petsPage - 1) * PETS_PER_PAGE, petsPage * PETS_PER_PAGE);

  const PaginationBar = ({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) => (
    total > 1 ? (
      <div className="flex items-center justify-end gap-2 mt-3">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
          className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-30">
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-xs text-slate-400 font-medium">{page} / {total}</span>
        <button onClick={() => onChange(Math.min(total, page + 1))} disabled={page === total}
          className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-30">
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    ) : null
  );

  return (
    <>
      <div className="space-y-8 animate-in fade-in duration-500">

        {/* ── Planes Activos ── */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Tus Planes Activos</h2>
            {initialSubs.length > 0 && <Link href="/planes" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">+ Agregar plan</Link>}
          </div>

          {initialSubs.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Activity className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Aún no tienes un plan activo</h3>
              <p className="text-gray-500 text-xs mb-4 max-w-xs mx-auto">Haz el diagnóstico gratuito y te asignaremos el plan correcto para tu mascota.</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Link href="/quiz" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors text-xs">
                  <Activity className="w-3.5 h-3.5" /> Hacer diagnóstico
                </Link>
                <Link href="/planes" className="inline-flex items-center gap-2 border border-slate-200 text-slate-600 font-bold px-4 py-2 rounded-xl hover:border-emerald-400 hover:text-emerald-600 transition-colors text-xs">
                  Ver planes
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {paginatedSubs.map((subData, index) => {
                  const currentOrder = subData.orders[0];
                  return (
                    <div key={index} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      {/* Header compacto */}
                      <div className="bg-slate-900 px-4 py-3 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/20 blur-xl rounded-full" />
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <h3 className="text-sm font-black">{subData.plan?.name || "Plan"}</h3>
                            <p className="text-slate-400 text-[10px] mt-0.5">
                              Próximo cobro: {new Date(subData.subscription.currentPeriodEnd).toLocaleDateString("es-PE")}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${subData.subscription.status === "active" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}`}>
                              {subData.subscription.status === "active" ? "Activa" : subData.subscription.status}
                            </span>
                            <p className="text-base font-black text-white mt-1">S/ {subData.plan?.price}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex flex-col gap-3">
                        {/* Estado del pedido */}
                        {currentOrder && (
                          <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex items-center gap-2.5">
                            <div className="bg-blue-100 p-1.5 rounded-lg shrink-0">
                              <Truck className="w-3.5 h-3.5 text-blue-600" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Caja del mes</p>
                              <p className="font-bold text-slate-900 text-xs">{currentOrder.status}</p>
                            </div>
                          </div>
                        )}

                        {/* Productos (horizontal scroll en móvil) */}
                        {subData.products.length > 0 && (
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Tu caja incluye</p>
                            <div className="flex flex-wrap gap-1.5">
                              {subData.products.map((p: any) => (
                                <div key={p.id} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
                                  {p.imageUrl ? (
                                    <img src={p.imageUrl} alt={p.name} className="w-5 h-5 rounded object-cover" />
                                  ) : (
                                    <Package className="w-3.5 h-3.5 text-slate-400" />
                                  )}
                                  <span className="text-[10px] font-medium text-slate-700 max-w-[100px] truncate">{p.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Historial compacto */}
                        {subData.orders.length > 1 && (
                          <div className="border-t border-slate-100 pt-2">
                            <div className="flex gap-2 flex-wrap">
                              {subData.orders.slice(1, 4).map((o: any) => (
                                <span key={o.id} className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  {new Date(o.createdAt).toLocaleDateString("es-PE", { month: "short", year: "2-digit" })}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <button onClick={handleOpenPortal} disabled={isRedirecting}
                          className="w-full flex items-center justify-center gap-1.5 bg-slate-100 text-slate-700 py-2 rounded-xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50 text-xs">
                          <CreditCard className="w-3.5 h-3.5" />
                          {isRedirecting ? "Abriendo..." : "Gestionar Suscripción"}
                        </button>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-800">Tus Mascotas</h2>
            <Link href="/quiz" className="flex items-center gap-1.5 text-emerald-600 font-bold hover:text-emerald-700 transition-colors text-xs">
              <Plus className="w-3.5 h-3.5" /> Añadir Mascota
            </Link>
          </div>

          {initialPets.length === 0 ? (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <PawPrint className="w-6 h-6 text-slate-300" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Aún no has registrado a tu amigo</h3>
              <p className="text-gray-500 text-xs mb-4 max-w-xs mx-auto">El diagnóstico registra a tu mascota y determina el plan ideal para ella.</p>
              <Link href="/quiz" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors text-xs">
                <Activity className="w-3.5 h-3.5" /> Registrar mi mascota
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedPets.map(pet => {
                  const badge = stageBadge[pet.lifeStage ?? "adult"] ?? stageBadge.adult;
                  const ageYears = calcAge(pet.birthDate);

                  return (
                    <div key={pet.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-all">

                      {editingPetId === pet.id ? (
                        /* Modo edición compacto */
                        <div className="p-3 space-y-3 flex-1">
                          <ImageUpload value={editData.photoUrl} onChange={url => setEditData(p => ({ ...p, photoUrl: url }))} />
                          <div>
                            <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nombre</label>
                            <input value={editData.name} onChange={e => setEditData(p => ({ ...p, name: e.target.value }))} required className="w-full border-b border-gray-200 py-0.5 outline-none focus:border-emerald-500 font-bold text-gray-900 bg-transparent text-sm" />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Peso kg</label>
                              <input type="number" step="0.1" value={editData.weightKg} onChange={e => setEditData(p => ({ ...p, weightKg: e.target.value }))} className="w-full border-b border-gray-200 py-0.5 outline-none focus:border-emerald-500 text-gray-700 bg-transparent text-sm" />
                            </div>
                            <div>
                              <label className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Edad</label>
                              <input type="number" step="0.5" value={editData.ageYears} onChange={e => setEditData(p => ({ ...p, ageYears: e.target.value }))} className="w-full border-b border-gray-200 py-0.5 outline-none focus:border-emerald-500 text-gray-700 bg-transparent text-sm" />
                            </div>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={editData.isMixed} onChange={e => setEditData(p => ({ ...p, isMixed: e.target.checked, breed: e.target.checked ? "" : p.breed }))} className="w-3 h-3 accent-purple-600" />
                            <span className="text-xs font-bold text-purple-800">Híbrida</span>
                          </label>
                          <div className="flex gap-1.5">
                            <button type="button" onClick={() => handleSave(pet.id)} disabled={isSaving} className="flex-1 bg-emerald-600 text-white py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 hover:bg-emerald-700 disabled:opacity-50">
                              <Save className="w-3 h-3" /> {isSaving ? "..." : "Guardar"}
                            </button>
                            <button type="button" onClick={() => setEditingPetId(null)} className="px-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200">
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Modo vista */
                        <>
                          <div className="relative w-full overflow-hidden bg-slate-100" style={{ paddingTop: "70%" }}>
                            <div className="absolute inset-0">
                              {pet.photoUrl ? (
                                <Image src={pet.photoUrl} alt={pet.name} fill className="object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-emerald-50">
                                  {pet.species === "dog" ? <Dog className="w-10 h-10 text-slate-300" strokeWidth={1} /> : <Cat className="w-10 h-10 text-slate-300" strokeWidth={1} />}
                                </div>
                              )}
                            </div>
                            <div className="absolute top-1.5 right-1.5">
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badge.cls}`}>{badge.label}</span>
                            </div>
                          </div>

                          <div className="p-3 flex flex-col flex-1">
                            <h3 className="text-sm font-bold text-gray-900 mb-1 truncate">{pet.name}</h3>
                            <div className="space-y-0.5 text-[10px] text-gray-500 mb-2 flex-1">
                              <p>Peso: <span className="font-semibold text-gray-700">{pet.weightKg} kg</span></p>
                              {ageYears > 0 && <p>Edad: <span className="font-semibold text-gray-700">{ageYears} años</span></p>}
                              {pet.isMixed && <p className="font-bold text-purple-600">Híbrida</p>}
                              {!pet.isMixed && pet.breed && <p className="truncate">Raza: <span className="font-semibold text-gray-700">{pet.breed}</span></p>}
                            </div>
                            <div className="flex gap-1.5">
                              <button onClick={() => openEdit(pet)} className="flex-1 flex items-center justify-center gap-1 bg-slate-50 text-slate-700 py-1.5 rounded-xl font-semibold hover:bg-slate-100 transition-colors text-[10px]">
                                <Settings className="w-3 h-3" /> Editar
                              </button>
                              <button onClick={() => requestDelete(pet)} className="px-2 flex items-center justify-center bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors">
                                <Trash2 className="w-3 h-3" />
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