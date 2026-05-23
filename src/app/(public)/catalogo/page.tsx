import { getCatalogoProducts } from "@/actions/catalogo-actions";
import { ProductGrid, type ProductWithPlans } from "@/components/catalogo/ProductGrid";

export default async function CatalogoPage() {
  const response = await getCatalogoProducts();
  const products: ProductWithPlans[] = response.success && response.data
    ? (response.data as ProductWithPlans[])
    : [];

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Catálogo de Suplementos
          </h1>
          <p className="text-slate-500 mt-1 text-sm font-medium">
            Vitrina de referencia. Cada producto forma parte de un{" "}
            <span className="text-emerald-600 font-bold">plan mensual de suscripción</span>{" "}
            — no se vende de forma individual.
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <ProductGrid initialProducts={products} />
      </div>
    </main>
  );
}