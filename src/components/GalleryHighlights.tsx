import Image from "next/image";
import Link from "next/link";
import type { GalleryPhoto } from "@/lib/photos";

export default function GalleryHighlights({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) return null;

  return (
    <section className="highlights">
      <div className="wrap">
        <div className="highlights-head">
          <h2>Over the years</h2>
          <Link href="/gallery">See the whole gallery</Link>
        </div>
        <div className="highlights-grid">
          {photos.map((photo) => (
            <figure key={photo.id} className="polaroid">
              <span className="pin" aria-hidden="true" />
              <Image
                src={photo.url}
                width={photo.width}
                height={photo.height}
                sizes="(max-width: 700px) 45vw, 280px"
                alt={`Soup in the Park, ${photo.album}`}
              />
              <figcaption>{photo.album}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
