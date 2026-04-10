"use server";
import { db } from "@/lib/db/index";
import { orders, subscriptions, users, plans } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";

// Obtener todos los pedidos — protegido para admin y staff
export async function getOrders() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin" && role !== "staff") {
    return { success: false, error: "Sin permisos." };
  }

  try {
    const allOrders = await db
      .select({
        id: orders.id,
        status: orders.status,
        trackingNumber: orders.trackingNumber,
        createdAt: orders.createdAt,
        customerName: users.name,
        customerEmail: users.email,
        planName: plans.name,
      })
      .from(orders)
      .innerJoin(subscriptions, eq(orders.subscriptionId, subscriptions.id))
      .innerJoin(users, eq(subscriptions.userId, users.id))
      .innerJoin(plans, eq(subscriptions.planId, plans.id))
      .orderBy(desc(orders.createdAt));

    return { success: true, data: allOrders };
  } catch (error) {
    return { success: false, error: "Error al cargar el panel de pedidos." };
  }
}

// Actualizar estado de un pedido — admin y staff
export async function updateOrderStatus(
  orderId: number,
  status: string,
  trackingNumber?: string
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin" && role !== "staff") {
    return { success: false, error: "Sin permisos." };
  }

  try {
    await db
      .update(orders)
      .set({
        status,
        trackingNumber: trackingNumber || null,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, orderId));

    revalidatePath("/admin/pedidos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "No se pudo actualizar el estado del pedido." };
  }
}