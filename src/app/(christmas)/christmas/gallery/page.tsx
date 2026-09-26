import { connection } from "next/server";
import Gallery from "@/components/Gallery";
import { getApprovedPhotos } from "@/lib/photos";

export default async function ChristmasGalleryPage() {
  await connection();
  const photos = await getApprovedPhotos("christmas");
  return <Gallery photos={photos} collection="christmas" titleClassName="mountains-christmas" />;
}
