// One-time migration of the gallery photos in src/assets to Vercel Blob.
// Safe to re-run: blobs are overwritten in place and rows upserted by pathname.
import { readdir } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";
import { db } from "@/lib/db";
import { toWebJpeg } from "@/lib/images";
import type { Collection } from "@/lib/photos";

const ASSETS = path.join(import.meta.dirname, "..", "src", "assets");

// Same order the old gallery showed them in.
const ALBUMS: { collection: Collection; folder: string; album: string; year: number | null; ext: string }[] = [
  ...["2005", "2007", "2009", "2010", "2011"].map((y) => ({ collection: "soup" as const, folder: y, album: y, year: Number(y), ext: ".jpg" })),
  { collection: "soup", folder: "Pines", album: "Pines", year: null, ext: ".jpg" },
  ...["2014", "2015", "2019"].map((y) => ({ collection: "soup" as const, folder: y, album: y, year: Number(y), ext: ".jpg" })),
  { collection: "christmas", folder: "christmas", album: "Christmas", year: null, ext: ".jpeg" },
];

async function main() {
  let sortOrder = 0;
  for (const { collection, folder, album, year, ext } of ALBUMS) {
    const files = (await readdir(path.join(ASSETS, folder)))
      .filter((f) => f.toLowerCase().endsWith(ext))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    for (const file of files) {
      const image = await toWebJpeg(path.join(ASSETS, folder, file));
      const pathname = `gallery/${collection}/${album}/${path.parse(file).name}.jpg`;
      const blob = await put(pathname, image.data, {
        access: "public",
        contentType: "image/jpeg",
        addRandomSuffix: false,
        allowOverwrite: true,
      });
      const data = { collection, album, year, url: blob.url, width: image.width, height: image.height, sortOrder, approved: true };
      await db.photo.upsert({ where: { pathname: blob.pathname }, create: { ...data, pathname: blob.pathname }, update: data });
      console.log(`${pathname}  ${image.width}x${image.height}  ${(image.data.length / 1024).toFixed(0)}KB`);
      sortOrder++;
    }
  }
  console.log(`Uploaded ${sortOrder} photos`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
