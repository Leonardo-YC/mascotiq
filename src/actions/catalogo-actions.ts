"use server";
import { db } from "@/lib/db/index";
import { products, categories, planProducts, plans } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ── Catálogo público ─────────────────────────────────────────────────
export async function getCatalogoProducts() {
  try {
    const catalogo = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      ingredients: products.ingredients,
      price: products.price,
      subscriptionPrice: products.subscriptionPrice,
      imageUrl: products.imageUrl,
      categoryName: categories.name,
      categoryId: categories.id,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, true));

    // Una sola query para todas las relaciones plan-producto con precio del plan
    const allRelations = await db.select({
      productId: planProducts.productId,
      planId: plans.id,
      planName: plans.name,
      planPrice: plans.price,
    })
    .from(planProducts)
    .innerJoin(plans, eq(planProducts.planId, plans.id));

    const catalogoWithPlans = catalogo.map(p => {
      const rels = allRelations.filter(r => r.productId === p.id);
      const validPrices = rels
        .map(r => parseFloat(r.planPrice || "0"))
        .filter(price => price > 0);
      const minPlanPrice = validPrices.length > 0
        ? Math.min(...validPrices).toFixed(2)
        : null;

      return {
        ...p,
        planNames: rels.map(r => r.planName),
        planPrices: rels.map(r => ({ planId: r.planId, planName: r.planName, planPrice: r.planPrice })),
        minPlanPrice,
      };
    });

    return { success: true, data: catalogoWithPlans };
  } catch (error) {
    console.error("Error catálogo:", error);
    return { success: false, error: "No se pudo cargar el catálogo." };
  }
}

// ── Admin: todos los productos con sus planes ────────────────────────
export async function getAdminProducts() {
  try {
    const allProducts = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      ingredients: products.ingredients,
      price: products.price,
      subscriptionPrice: products.subscriptionPrice,
      imageUrl: products.imageUrl,
      isActive: products.isActive,
      categoryName: categories.name,
      categoryId: categories.id,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(products.name);

    const allRelations = await db.select({
      productId: planProducts.productId,
      planId: planProducts.planId,
      planName: plans.name,
    })
    .from(planProducts)
    .innerJoin(plans, eq(planProducts.planId, plans.id));

    return {
      success: true,
      data: allProducts.map(p => ({
        ...p,
        planIds: allRelations.filter(r => r.productId === p.id).map(r => r.planId),
        planNames: allRelations.filter(r => r.productId === p.id).map(r => r.planName),
      })),
    };
  } catch (error) {
    return { success: false, error: "Error al cargar productos." };
  }
}

// ── Detalle de un producto ────────────────────────────────────────────
export async function getProductById(productId: number) {
  try {
    const product = await db.select({
      id: products.id,
      name: products.name,
      description: products.description,
      ingredients: products.ingredients,
      price: products.price,
      subscriptionPrice: products.subscriptionPrice,
      imageUrl: products.imageUrl,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, productId))
    .limit(1);

    if (product.length === 0) return { success: false, error: "Producto no encontrado." };
    return { success: true, data: product[0] };
  } catch (error) {
    return { success: false, error: "Error al cargar el producto." };
  }
}

// ── Categorías para el formulario ────────────────────────────────────
export async function getCategories() {
  try {
    const data = await db.select().from(categories).orderBy(categories.name);
    return { success: true, data };
  } catch (error) {
    return { success: false, error: "Error al cargar categorías." };
  }
}

// ── Crear producto + asignar a planes ────────────────────────────────
export async function createProduct(formData: FormData, planIds: number[] = []) {
  try {
    const [newProduct] = await db.insert(products).values({
      name: formData.get("name") as string,
      categoryId: parseInt(formData.get("categoryId") as string) || null,
      price: formData.get("price") as string,
      subscriptionPrice: formData.get("subscriptionPrice") as string,
      description: (formData.get("description") as string) || "",
      ingredients: (formData.get("ingredients") as string) || "",
      imageUrl: formData.get("imageUrl") as string,
      isActive: true,
    }).returning();

    if (planIds.length > 0) {
      await db.insert(planProducts).values(
        planIds.map(planId => ({ planId, productId: newProduct.id }))
      );
    }

    revalidatePath("/admin/catalogo");
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error) {
    console.error("Error al crear:", error);
    return { success: false, error: "Error al crear el producto." };
  }
}

// ── Editar producto + actualizar planes ──────────────────────────────
export async function updateProduct(id: number, formData: FormData, planIds: number[] = []) {
  try {
    await db.update(products).set({
      name: formData.get("name") as string,
      categoryId: parseInt(formData.get("categoryId") as string) || null,
      price: formData.get("price") as string,
      subscriptionPrice: formData.get("subscriptionPrice") as string,
      description: (formData.get("description") as string) || "",
      ingredients: (formData.get("ingredients") as string) || "",
      imageUrl: formData.get("imageUrl") as string,
    }).where(eq(products.id, id));

    await db.delete(planProducts).where(eq(planProducts.productId, id));
    if (planIds.length > 0) {
      await db.insert(planProducts).values(
        planIds.map(planId => ({ planId, productId: id }))
      );
    }

    revalidatePath("/admin/catalogo");
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al actualizar." };
  }
}

// ── Eliminar producto ─────────────────────────────────────────────────
export async function deleteProduct(productId: number) {
  try {
    await db.delete(products).where(eq(products.id, productId));
    revalidatePath("/admin/catalogo");
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al eliminar." };
  }
}

// ── Toggle activo/inactivo ────────────────────────────────────────────
export async function toggleProductActive(productId: number, isActive: boolean) {
  try {
    await db.update(products).set({ isActive }).where(eq(products.id, productId));
    revalidatePath("/admin/catalogo");
    revalidatePath("/catalogo");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Error al cambiar estado." };
  }
}