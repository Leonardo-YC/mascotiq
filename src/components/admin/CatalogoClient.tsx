"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Plus, Search, Edit, Trash2, Package, X, Save,
  AlertTriangle, ImageIcon, ShoppingBag, Layers, Eye, EyeOff
} from "lucide-react";
import { createProduct, deleteProduct, updateProduct, toggleProductActive } from "@/actions/catalogo-actions";
import { ImageUpload } from "@/components/quiz/ImageUpload";

function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}

interface Plan  { id: number; name: string }
interface Cat   { id: number; name: string }
interface Prod  {
  id: number; name: string; description: string; ingredients: string | null;
  price: string; subscriptionPrice: string; imageUrl: string | null;
  categoryName: string | null; categoryId: number | null;
  isActive: boolean; planIds: number[]; planNames: string[];
}

export function CatalogoClient({
  initialProducts,
  categories,
  availablePlans,
}: {
  initialProducts: Prod[];
  categories: Cat[];
  availablePlans: Plan[];
}) {
  const [searchTerm, setSearchTerm]   = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl]       = useState("");
  const [selectedPlanIds, setSelectedPlanIds] = useState<number[]>([]);

  const [modalState, setModalState] = useState<{
    isOpen: boolean; mode: "create" | "edit"; product: Prod | null;
  }>({ isOpen: false, mode: "create", product: null });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean; id: number | null; name: string;
  }>({ isOpen: false, id: null, name: "" });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeModal(); setDeleteModal({ isOpen: false, id: null, name: "" }); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (modalState.isOpen || deleteModal.isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [modalState.isOpen, deleteModal.isOpen]);

  const openModal = (mode: "create" | "edit", product: Prod | null = null) => {
    setModalState({ isOpen: true, mode, product });
    setImageUrl(product?.imageUrl || "");
    setSelectedPlanIds(product?.planIds || []);
  };
  const closeModal = () => {
    setModalState({ isOpen: false, mode: "create", product: null });
    setImageUrl("");
    setSelectedPlanIds([]);
  };

  const togglePlan = (planId: number) => {
    setSelectedPlanIds(prev =>
      prev.includes(planId) ? prev.filter(id => id !== planId) : [...prev, planId]
    );
  };

  const filteredProducts = initialProducts.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.categoryName && p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("imageUrl", imageUrl);

    if (modalState.mode === "create") {
      await createProduct(formData, selectedPlanIds);
    } else if (modalState.product) {
      await updateProduct(modalState.product.id, formData, selectedPlanIds);
    }
    setIsSubmitting(false);
    closeModal();
  };

  const confirmDelete = async () => {
    if (!deleteModal.id) return;
    setIsSubmitting(true);
    await deleteProduct(deleteModal.id);
    setIsSubmitting(false);
    setDeleteModal({ isOpen: false, id: null, name: "" });
  };

  return (
    <>
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Catálogo de Productos</h1>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Gestiona los suplementos y asigna cada uno a sus planes correspondientes.
          </p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Nuevo Producto
        </button>
      </div>

      {/* Buscador */}
      <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
        <Search className="w-5 h-5 text-slate-400 ml-2" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o categoría..."
          className="flex-1 bg-transparent border-none focus:outline-none text-slate-700 font-medium placeholder:text-slate-400 text-sm"
        />
        <span className="text-xs text-slate-400 font-medium mr-2">
          {filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                <th className="p-4">Producto</th>
                <th className="p-4">Categoría</th>
                <th className="p-4">Planes</th>
                <th className="p-4">Precio sub.</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredProducts.map(product => (
                <tr key={product.id} className={`hover:bg-slate-50 transition-colors ${!product.isActive ? "opacity-50" : ""}`}>
                  <td className="p-4 flex items-center gap-3">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0 border border-slate-200">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                    )}
                    <span className="font-bold text-slate-900 text-sm line-clamp-1">{product.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border border-emerald-100">
                      {product.categoryName || "General"}
                    </span>
                  </td>
                  <td className="p-4">
                    {product.planNames.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.planNames.map(pn => (
                          <span key={pn} className="text-[9px] font-bold bg-blue-50 text-blue-700 border border-blue-100 px-1.5 py-0.5 rounded-full">
                            {pn.replace("Plan Senior ", "")}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Sin plan</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-slate-900 font-black text-sm">S/ {product.subscriptionPrice}</span>
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      product.isActive
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}>
                      {product.isActive ? "Activo" : "Oculto"}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-1">
                    <button
                      onClick={() => toggleProductActive(product.id, !product.isActive)}
                      className={`p-2 rounded-lg transition-colors ${product.isActive ? "text-slate-400 hover:text-amber-600 hover:bg-amber-50" : "text-slate-400 hover:text-emerald-600 hover:bg-emerald-50"}`}
                      title={product.isActive ? "Ocultar" : "Activar"}
                    >
                      {product.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => openModal("edit", product)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, id: product.id, name: product.name })}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-sm font-medium">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MODAL CREAR / EDITAR ── */}
      {modalState.isOpen && (
        <Portal>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 99999 }}
            className="flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
            onClick={closeModal}
          >
            <div
              style={{ maxWidth: "900px", maxHeight: "calc(100vh - 2rem)", width: "100%" }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200"
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50 shrink-0">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-emerald-600" />
                  {modalState.mode === "create" ? "Agregar Producto" : "Editar Producto"}
                </h3>
                <button onClick={closeModal} className="text-slate-400 hover:text-slate-700 p-1.5 hover:bg-slate-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body: formulario izquierda + imagen derecha */}
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">

                {/* Formulario */}
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 p-6 overflow-y-auto md:w-[55%] md:border-r md:border-slate-100"
                >
                  <input type="hidden" name="imageUrl" value={imageUrl} />

                  {/* Nombre */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Nombre del producto</label>
                    <input
                      name="name"
                      defaultValue={modalState.product?.name}
                      required
                      placeholder="Ej. Aceite de Salmón Omega 3+"
                      className="w-full mt-1 border-b-2 border-slate-200 py-1.5 focus:border-emerald-500 focus:outline-none font-medium text-slate-900 placeholder:text-slate-300 bg-transparent text-sm"
                    />
                  </div>

                  {/* Descripción */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Descripción</label>
                    <textarea
                      name="description"
                      defaultValue={modalState.product?.description}
                      rows={2}
                      placeholder="Describe el beneficio principal del producto..."
                      className="w-full mt-1 border-b-2 border-slate-200 py-1.5 focus:border-emerald-500 focus:outline-none text-slate-700 bg-transparent resize-none text-sm"
                    />
                  </div>

                  {/* Ingredientes */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Ingredientes activos</label>
                    <textarea
                      name="ingredients"
                      defaultValue={modalState.product?.ingredients || ""}
                      rows={2}
                      placeholder="Glucosamina 500mg, Condroitina 400mg..."
                      className="w-full mt-1 border-b-2 border-slate-200 py-1.5 focus:border-emerald-500 focus:outline-none text-slate-700 bg-transparent resize-none text-sm"
                    />
                  </div>

                  {/* Categoría */}
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Categoría</label>
                    <select
                      name="categoryId"
                      defaultValue={modalState.product?.categoryId || ""}
                      className="w-full mt-1 border-b-2 border-slate-200 py-1.5 focus:border-emerald-500 focus:outline-none text-slate-700 bg-white text-sm"
                    >
                      <option value="">-- Seleccionar --</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Precios */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Precio referencial (S/)</label>
                      <input
                        name="price"
                        type="number"
                        step="0.01"
                        defaultValue={modalState.product?.price}
                        required
                        placeholder="120.00"
                        className="w-full mt-1 border-b-2 border-slate-200 py-1.5 focus:border-emerald-500 focus:outline-none text-slate-700 bg-transparent text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Precio con suscripción (S/)</label>
                      <input
                        name="subscriptionPrice"
                        type="number"
                        step="0.01"
                        defaultValue={modalState.product?.subscriptionPrice}
                        required
                        placeholder="89.00"
                        className="w-full mt-1 border-b-2 border-emerald-300 py-1.5 focus:border-emerald-500 focus:outline-none font-bold text-emerald-700 bg-emerald-50/60 px-2 rounded-t-md text-sm"
                      />
                    </div>
                  </div>

                  {/* Planes */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" /> Planes que incluyen este producto
                      </label>
                      {selectedPlanIds.length > 0 && (
                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                          {selectedPlanIds.length} seleccionado{selectedPlanIds.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 gap-2">
                      {availablePlans.map(plan => {
                        const checked = selectedPlanIds.includes(plan.id);
                        return (
                          <div
                            key={plan.id}
                            onClick={() => togglePlan(plan.id)}
                            className={`flex items-center gap-3 p-2.5 rounded-xl border-2 cursor-pointer transition-all text-sm ${
                              checked
                                ? "border-emerald-500 bg-emerald-50/50"
                                : "border-slate-100 hover:border-emerald-200 hover:bg-slate-50"
                            }`}
                          >
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
                              checked ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                            }`}>
                              {checked && (
                                <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <span className={`font-semibold ${checked ? "text-emerald-800" : "text-slate-600"}`}>
                              {plan.name.replace("Plan Senior ", "")}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full mt-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl flex justify-center items-center gap-2 transition-colors disabled:opacity-50 text-sm"
                  >
                    <Save className="w-4 h-4" />
                    {isSubmitting ? "Guardando..." : "Guardar Producto"}
                  </button>
                </form>

                {/* Columna imagen */}
                <div className="hidden md:flex flex-col md:w-[45%] bg-slate-50 p-6 gap-4 overflow-y-auto">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5" /> Fotografía del Producto
                  </p>
                  <div className="relative w-full rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-white" style={{ paddingTop: "125%" }}>
                    {imageUrl ? (
                      <>
                        <img src={imageUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setImageUrl("")}
                          className="absolute top-3 right-3 bg-red-600 text-white p-2 rounded-full shadow-lg hover:bg-red-700 z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                        <ShoppingBag className="w-12 h-12 text-slate-200" strokeWidth={1.2} />
                        <p className="text-slate-400 text-xs font-medium">La imagen aparecerá aquí</p>
                      </div>
                    )}
                  </div>
                  {!imageUrl && (
                    <div className="space-y-2">
                      <ImageUpload value={imageUrl} onChange={setImageUrl} isProduct={true} />
                      <p className="text-center text-[10px] text-slate-400 font-medium">
                        JPG, PNG o WebP · 800×800 px · máx. 4 MB
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Portal>
      )}

      {/* ── MODAL ELIMINAR ── */}
      {deleteModal.isOpen && (
        <Portal>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 99999 }}
            className="flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
          >
            <div
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-slate-900 mb-2">¿Eliminar producto?</h3>
              <p className="text-slate-500 text-sm mb-6">
                Estás a punto de eliminar <strong className="text-slate-800">{deleteModal.name}</strong>. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, id: null, name: "" })}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? "Borrando..." : "Sí, eliminar"}
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </>
  );
}