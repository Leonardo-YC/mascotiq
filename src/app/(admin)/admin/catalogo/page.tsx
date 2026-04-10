import { getAdminProducts, getCategories } from "@/actions/catalogo-actions";
import { db } from "@/lib/db/index";
import { plans } from "@/lib/db/schema";
import { CatalogoClient } from "@/components/admin/CatalogoClient";

export default async function CatalogoManagerPage() {
  const [productsResponse, categoriesResponse, allPlans] = await Promise.all([
    getAdminProducts(),
    getCategories(),
    db.select({ id: plans.id, name: plans.name }).from(plans).orderBy(plans.id),
  ]);

  const realProducts   = productsResponse.success && productsResponse.data   ? productsResponse.data   : [];
  const realCategories = categoriesResponse.success && categoriesResponse.data ? categoriesResponse.data : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-sans">
      <CatalogoClient
        initialProducts={realProducts as any}
        categories={realCategories as any}
        availablePlans={allPlans}
      />
    </div>
  );
}