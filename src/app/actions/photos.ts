"use server";

import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { toWebJpeg } from "@/lib/images";
import { COLLECTIONS, type Collection } from "@/lib/photos";

// Client compresses before upload; this leaves headroom under Vercel's 4.5MB body cap.
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const FIRST_YEAR = 1990;

export type SubmitPhotoResult = { ok: true } | { ok: false; error: string };

export async function submitPhoto(formData: FormData): Promise<SubmitPhotoResult> {
  const file = formData.get("photo");
  const collection = String(formData.get("collection") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 100);
  const yearInput = String(formData.get("year") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) return { ok: false, error: "Choose a photo to upload" };
  if (!file.type.startsWith("image/")) return { ok: false, error: "That file isn't an image" };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, error: "That photo is too large" };
  if (!COLLECTIONS.includes(collection as Collection)) return { ok: false, error: "Unknown gallery" };

  const year = yearInput ? Number(yearInput) : null;
  if (year !== null && (!Number.isInteger(year) || year < FIRST_YEAR || year > new Date().getFullYear())) {
    return { ok: false, error: "Enter a valid year" };
  }

  try {
    const image = await toWebJpeg(Buffer.from(await file.arrayBuffer()));
    const blob = await put(`submissions/${collection}/${randomUUID()}.jpg`, image.data, {
      access: "public",
      contentType: "image/jpeg",
    });
    await db.photo.create({
      data: {
        collection,
        album: year ? String(year) : "Undated",
        year,
        url: blob.url,
        pathname: blob.pathname,
        width: image.width,
        height: image.height,
        approved: false,
        submittedBy: name || null,
      },
    });
  } catch (error) {
    console.error("Photo submission failed", error);
    return { ok: false, error: "Upload failed; try again later" };
  }

  return { ok: true };
}
