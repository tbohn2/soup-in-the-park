import { connection } from "next/server";
import Gallery from "@/components/Gallery";
import { getApprovedPhotos } from "@/lib/photos";

export default async function GalleryPage() {
  await connection();
  const photos = await getApprovedPhotos("soup");
  return <Gallery photos={photos} collection="soup" titleClassName="gallery-title" />;
}
