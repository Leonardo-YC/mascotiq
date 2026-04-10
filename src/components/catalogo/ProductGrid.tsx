"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search, ShoppingBag, ArrowRight, Dog, Cat,
  SlidersHorizontal, X, ChevronLeft, ChevronRight,
  ChevronDown, ChevronRight as ChevronRightIcon
} from "lucide-react";

interface ProductWithPlans {
  id: number;
  name: string;
  description: string;
  ingredients: string | null;
  price: string;
  subscriptionPrice: string;
  imageUrl: string | null;
  categoryName: string | null;
  planNames: string[];
  minPlanPrice: string | null;
}

function getSpeciesFromPlans(planNames: string[]): "dog" | "cat" | "both" {
  const hasDog = planNames.some(p => p.includes("Perro"));
  const hasCat = planNames.some(p => p.includes("Gato"));
  if (hasDog && hasCat) return "both";
  if (hasDog) return "dog";
  if (hasCat) return "cat";
  return "both";
}

function getDogSizesFromPlans(planNames: string[]): string[] {
  const sizes: string[] = [];
  if (planNames.some(p => p.includes("Pequeño"))) sizes.push("Pequeño");
  if (planNames.some(p => p.includes("Mediano"))) sizes.push("Mediano");
  if (planNames.some(p => p.includes("Grande") && !p.includes("Gigante"))) sizes.push("Grande");
  if (planNames.some(p => p.includes("Gigante"))) sizes.push("Gigante");
  return sizes;
}

function getSpeciesBadges(planNames: string[]): string[] {
  const badges = new Set<string>();
  planNames.forEach(p => {
    if (p.includes("Perro")) badges.add("Perro");
    if (p.includes("Gato")) badges.add("Gato");
  });
  return Array.from(badges);
}

const DOG_SIZES = ["Pequeño", "Mediano", "Grande", "Gigante"] as const;

function useResponsivePageSize() {
  const [pageSize, setPageSize] = useState(12);
  useEffect(() => {
    const update = () => {
      if (window.innerWidth >= 1280) setPageSize(16);
      else if (window.innerWidth >= 1024) setPageSize(12);
      else if (window.innerWidth >= 768) setPageSize(8);
      else setPageSize(4);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return pageSize;
}

export function ProductGrid({ initialProducts }: { initialProducts: ProductWithPlans[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<"all" | "dog" | "cat">("all");
  const [selectedDogSize, setSelectedDogSize] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = useResponsivePageSize();

  const categories = Array.from(
    new Set(initialProducts.map(p => p.categoryName).filter(Boolean))
  ) as string[];

  const filteredProducts = initialProducts.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? product.categoryName === selectedCategory : true;
    const species = getSpeciesFromPlans(product.planNames);
    const matchesSpecies = selectedSpecies === "all" ? true : species === selectedSpecies || species === "both";
    const matchesDogSize =
      selectedSpecies !== "dog" || !selectedDogSize ? true :
      getDogSizesFromPlans(product.planNames).includes(selectedDogSize);
    return matchesSearch && matchesCategory && matchesSpecies && matchesDogSize;
  });

  useEffect(() => { setCurrentPage(1); }, [searchTerm, selectedCategory, selectedSpecies, selectedDogSize]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const paginated = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeFilterCount =
    (selectedCategory ? 1 : 0) + (selectedSpecies !== "all" ? 1 : 0) + (selectedDogSize ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedSpecies("all");
    setSelectedDogSize(null);
  };

  const FiltersPanel = () => (
    <div className="space-y-6">
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Tipo de mascota</p>
        <div className="space-y-1">
          <button onClick={() => { setSelectedSpecies("all"); setSelectedDogSize(null); }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left ${selectedSpecies === "all" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            Todas las mascotas
          </button>
          <div>
            <button onClick={() => { setSelectedSpecies("dog"); setSelectedDogSize(null); }}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left ${selectedSpecies === "dog" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              <Dog className="w-4 h-4" /> Perros
              {selectedSpecies === "dog" ? <ChevronDown className="w-3.5 h-3.5 ml-auto" /> : <ChevronRightIcon className="w-3.5 h-3.5 ml-auto opacity-40" />}
            </button>
            {selectedSpecies === "dog" && (
              <div className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-3">
                <button onClick={() => setSelectedDogSize(null)} className={`w-full text-left text-xs font-semibold px-2 py-1.5 rounded-md transition-all ${!selectedDogSize ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                  Todos los perros
                </button>
                {DOG_SIZES.map(size => (
                  <button key={size} onClick={() => setSelectedDogSize(size)}
                    className={`w-full text-left text-xs font-semibold px-2 py-1.5 rounded-md transition-all ${selectedDogSize === size ? "bg-emerald-600 text-white" : "text-slate-500 hover:bg-slate-100"}`}>
                    {size}
                    <span className="text-[10px] opacity-60 ml-1">
                      {size === "Pequeño" && "< 10 kg"}{size === "Mediano" && "10–25 kg"}
                      {size === "Grande" && "25–45 kg"}{size === "Gigante" && "> 45 kg"}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => { setSelectedSpecies("cat"); setSelectedDogSize(null); }}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all text-left ${selectedSpecies === "cat" ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            <Cat className="w-4 h-4" /> Gatos
          </button>
        </div>
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Categoría</p>
        <div className="space-y-1">
          <button onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCategory === null ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
            Todas
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-all ${selectedCategory === cat ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>
      {activeFilterCount > 0 && (
        <button onClick={clearFilters} className="w-full py-1.5 text-xs font-bold text-red-500 border border-red-200 hover:border-red-300 rounded-lg transition-colors">
          Limpiar filtros
        </button>
      )}
    </div>
  );

  return (
    <div className="flex gap-8 items-start animate-in fade-in duration-500">
      {/* Sidebar desktop */}
      <aside className="w-52 shrink-0 hidden lg:block sticky top-24">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <p className="text-sm font-black text-slate-900 mb-4">Filtros</p>
          <FiltersPanel />
        </div>
      </aside>

      <div className="flex-1 min-w-0 space-y-4">
        {/* Búsqueda + filtros móvil */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input type="text" placeholder="Buscar suplementos..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400" />
          </div>
          <button onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50">
            <SlidersHorizontal className="w-4 h-4" /> Filtros
            {activeFilterCount > 0 && (
              <span className="bg-slate-900 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">{activeFilterCount}</span>
            )}
          </button>
        </div>

        {/* Chips activos */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedSpecies !== "all" && (
              <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full">
                {selectedSpecies === "dog" ? "Perros" : "Gatos"}
                <button onClick={() => { setSelectedSpecies("all"); setSelectedDogSize(null); }}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedDogSize && (
              <span className="inline-flex items-center gap-1.5 bg-slate-700 text-white text-xs font-bold px-3 py-1 rounded-full">
                {selectedDogSize}
                <button onClick={() => setSelectedDogSize(null)}><X className="w-3 h-3" /></button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {selectedCategory}
                <button onClick={() => setSelectedCategory(null)}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        <p className="text-xs text-slate-400 font-medium">{filteredProducts.length} producto{filteredProducts.length !== 1 ? "s" : ""}</p>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <ShoppingBag className="w-10 h-10 text-slate-200 mx-auto mb-3" strokeWidth={1} />
            <p className="font-bold text-slate-500 text-sm">Sin resultados</p>
            <button onClick={clearFilters} className="mt-2 text-xs text-emerald-600 font-bold hover:underline">Ver todos</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginated.map(product => {
              const speciesBadges = getSpeciesBadges(product.planNames);
              return (
                <Link href={`/catalogo/${product.id}`} key={product.id}
                  className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all overflow-hidden">
                  {product.imageUrl ? (
                    <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
                      <Image src={product.imageUrl} alt={product.name} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                    </div>
                  ) : (
                    <div className="w-full aspect-square bg-slate-50 flex items-center justify-center border-b border-slate-100">
                      <ShoppingBag className="w-8 h-8 text-slate-200" strokeWidth={1} />
                    </div>
                  )}
                  <div className="p-3 flex-grow space-y-1.5">
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider border border-emerald-100">
                      {product.categoryName || "General"}
                    </span>
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2">{product.name}</h3>
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed">{product.description}</p>
                    {speciesBadges.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-0.5">
                        {speciesBadges.map(badge => (
                          <span key={badge} className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${badge === "Perro" ? "text-blue-600 bg-blue-50 border-blue-200" : "text-purple-600 bg-purple-50 border-purple-200"}`}>
                            {badge === "Perro" ? <Dog className="w-2.5 h-2.5" /> : <Cat className="w-2.5 h-2.5" />}
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Precio — ahora basado en el plan */}
                  <div className="px-3 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
                    <div>
                      {product.minPlanPrice ? (
                        <>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Plan desde</p>
                          <p className="text-sm font-black text-slate-900">S/ {product.minPlanPrice}<span className="text-[10px] text-slate-400 font-medium">/mes</span></p>
                        </>
                      ) : (
                        <>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Plan</p>
                          <p className="text-xs font-bold text-slate-400">Por confirmar</p>
                        </>
                      )}
                    </div>
                    <div className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-200 group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white transition-all">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-xs text-slate-400 font-medium">Página {currentPage} de {totalPages}</p>
            <div className="flex items-center gap-2">
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                .reduce<(number | "...")[]>((acc, p, i, arr) => {
                  if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                  acc.push(p); return acc;
                }, [])
                .map((item, i) => item === "..." ? (
                  <span key={`d-${i}`} className="text-slate-400 text-sm px-1">…</span>
                ) : (
                  <button key={item} onClick={() => setCurrentPage(item as number)}
                    className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${currentPage === item ? "bg-slate-900 text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                    {item}
                  </button>
                ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Drawer filtros móvil */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-[99999] lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center p-5 border-b border-slate-100">
              <p className="font-black text-slate-900 text-sm">Filtros</p>
              <button onClick={() => setShowMobileFilters(false)} className="p-1.5 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5"><FiltersPanel /></div>
            <div className="p-5 border-t border-slate-100">
              <button onClick={() => setShowMobileFilters(false)} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm">
                Ver {filteredProducts.length} resultado{filteredProducts.length !== 1 ? "s" : ""}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}