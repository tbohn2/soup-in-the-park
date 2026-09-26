"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { isAdmin, signIn, signOut } from "@/lib/admin";

export async function login(_prev: string | null, formData: FormData): Promise<string | null> {
  const ok = await signIn(String(formData.get("password") ?? ""));
  if (!ok) return "Wrong password";
  redirect("/admin");
}

export async function logout() {
  await signOut();
  redirect("/admin");
}

async function requireAdmin() {
  if (!(await isAdmin())) throw new Error("Not signed in as admin");
}

export async function approvePhoto(id: string) {
  await requireAdmin();
  await db.photo.update({ where: { id }, data: { approved: true } });
  revalidatePath("/admin");
}

export async function deletePhoto(id: string) {
  await requireAdmin();
  const photo = await db.photo.findUnique({ where: { id }, select: { url: true } });
  if (!photo) return;
  // Delete the file first: a leftover row is visible in admin and retryable, an orphaned blob isn't.
  await del(photo.url);
  await db.photo.delete({ where: { id } });
  revalidatePath("/admin");
}
