"use server";
import { db } from "@/lib/db/index";
import { users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getUsers() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin" && role !== "staff") {
    return { success: false, error: "Sin permisos." };
  }
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return { success: true, data: allUsers };
  } catch (error: unknown) {
    console.error("Error al cargar usuarios:", error);
    return { success: false, error: "Error al cargar usuarios." };
  }
}

export async function updateUserRole(userId: string, role: "user" | "staff" | "admin") {
  const { sessionClaims } = await auth();
  const callerRole = (sessionClaims?.metadata as { role?: string })?.role;
  if (callerRole !== "admin") {
    return { success: false, error: "Sin permisos." };
  }
  try {
    await db.update(users).set({ role }).where(eq(users.id, userId));
    const clerk = await clerkClient();
    await clerk.users.updateUser(userId, { publicMetadata: { role } });
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error al cambiar rol:", error);
    return { success: false, error: "No se pudo cambiar el rol." };
  }
}

export async function deleteUser(userId: string) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string })?.role;
  if (role !== "admin") {
    return { success: false, error: "Sin permisos." };
  }
  try {
    await db.delete(users).where(eq(users.id, userId));
    revalidatePath("/admin/usuarios");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error al eliminar usuario:", error);
    return { success: false, error: "No se pudo eliminar el usuario." };
  }
}

export async function inviteUser(email: string, role: "user" | "staff" | "admin") {
  const { sessionClaims } = await auth();
  const callerRole = (sessionClaims?.metadata as { role?: string })?.role;
  if (callerRole !== "admin") {
    return { success: false, error: "Sin permisos." };
  }
  try {
    const clerk = await clerkClient();
    await clerk.invitations.createInvitation({
      emailAddress: email,
      publicMetadata: { role },
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
    });
    return { success: true };
  } catch (error: unknown) {
    console.error("Error al invitar:", error);
    const clerkError = error as { errors?: { code: string }[] };
    if (clerkError?.errors?.[0]?.code === "duplicate_record") {
      return { success: false, error: "Ya existe una invitación pendiente para este correo." };
    }
    return { success: false, error: "No se pudo enviar la invitación." };
  }
}