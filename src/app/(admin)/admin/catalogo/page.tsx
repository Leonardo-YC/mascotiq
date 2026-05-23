import { getAdminProducts, getCategories } from "@/actions/catalogo-actions";
import { db } from "@/lib/db/index";
import { plans } from "@/lib/db/schema";
import { CatalogoClient, type CatalogoProduct, type CatalogoCategory, type CatalogoPlan } from "@/components/admin/CatalogoClient";

export default async function CatalogoManagerPage() {
  const [productsResponse, categoriesResponse, allPlans] = await Promise.all([
    getAdminProducts(),
    getCategories(),
    db.select({ id: plans.id, name: plans.name }).from(plans).orderBy(plans.id),
  ]);

  const realProducts: CatalogoProduct[] = productsResponse.success && productsResponse.data
    ? (productsResponse.data as CatalogoProduct[])
    : [];

  const realCategories: CatalogoCategory[] = categoriesResponse.success && categoriesResponse.data
    ? (categoriesResponse.data as CatalogoCategory[])
    : [];

  const availablePlans: CatalogoPlan[] = allPlans;

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-500 font-sans pb-10">
      <CatalogoClient
        initialProducts={realProducts}
        categories={realCategories}
        availablePlans={availablePlans}
      />
    </div>
  );
}