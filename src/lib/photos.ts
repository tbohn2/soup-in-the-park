import { db } from "@/lib/db";

export const COLLECTIONS = ["soup", "christmas"] as const;
export type Collection = (typeof COLLECTIONS)[number];

export type GalleryPhoto = {
  id: string;
  url: string;
  width: number;
  height: number;
  album: string;
  year: number | null;
};

const photoSelect = { id: true, url: true, width: true, height: true, album: true, year: true } as const;

// Oldest first; undated sets (like Pines) go after the dated ones.
export function getApprovedPhotos(collection: Collection): Promise<GalleryPhoto[]> {
  return db.photo.findMany({
    where: { collection, approved: true },
    orderBy: [{ year: { sort: "asc", nulls: "last" } }, { sortOrder: "asc" }, { createdAt: "asc" }],
    select: photoSelect,
  });
}

// A few dated photos spread across the years, one per year, for the sign-up page.
export async function getHighlights(collection: Collection, count: number): Promise<GalleryPhoto[]> {
  const photos = await db.photo.findMany({
    where: { collection, approved: true, year: { not: null } },
    orderBy: [{ year: "asc" }, { sortOrder: "asc" }],
    select: photoSelect,
  });
  const firstPerYear = photos.filter((p, i) => i === 0 || photos[i - 1].year !== p.year);
  if (firstPerYear.length <= count) return firstPerYear;
  const step = (firstPerYear.length - 1) / (count - 1);
  return Array.from({ length: count }, (_, i) => firstPerYear[Math.round(i * step)]);
}
