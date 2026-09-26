"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Collection, GalleryPhoto } from "@/lib/photos";
import PhotoSubmit from "./PhotoSubmit";

type Props = {
  photos: GalleryPhoto[];
  collection: Collection;
  titleClassName: string;
};

const ALL = "all";

export default function Gallery({ photos, collection, titleClassName }: Props) {
  const [album, setAlbum] = useState(ALL);
  const [newestFirst, setNewestFirst] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [focusedLoading, setFocusedLoading] = useState(false);
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());

  const albums = useMemo(() => [...new Set(photos.map((p) => p.album))], [photos]);

  // Photos arrive oldest first with undated sets last; reversing the dated
  // part keeps undated sets at the end in both directions.
  const visible = useMemo(() => {
    const filtered = album === ALL ? photos : photos.filter((p) => p.album === album);
    if (!newestFirst) return filtered;
    const dated = filtered.filter((p) => p.year !== null);
    const undated = filtered.filter((p) => p.year === null);
    return [...dated.reverse(), ...undated];
  }, [photos, album, newestFirst]);

  const focused = focusedIndex !== null ? visible[focusedIndex] : null;

  const step = useCallback(
    (delta: number) => {
      setFocusedLoading(true);
      setFocusedIndex((i) => (i === null ? i : (i + delta + visible.length) % visible.length));
    },
    [visible.length],
  );

  useEffect(() => {
    if (focusedIndex === null) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") step(-1);
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "Escape") setFocusedIndex(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focusedIndex, step]);

  return (
    <div id="gallery" className="main-content fade-in d-flex flex-column align-items-center">
      <h1 className={titleClassName}>Over the Years</h1>
      {albums.length > 1 && (
        <div className="gallery-controls d-flex flex-wrap justify-content-center align-items-center gap-2 my-2">
          <select
            className="form-select w-auto"
            aria-label="Filter by year"
            value={album}
            onChange={(e) => {
              setFocusedIndex(null);
              setAlbum(e.target.value);
            }}
          >
            <option value={ALL}>All years</option>
            {albums.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-light border" onClick={() => {
              setFocusedIndex(null);
              setNewestFirst((v) => !v);
            }}>
            <i className={`bi ${newestFirst ? "bi-sort-down" : "bi-sort-up"}`}></i> {newestFirst ? "Newest first" : "Oldest first"}
          </button>
        </div>
      )}
      <PhotoSubmit collection={collection} />
      {photos.length === 0 && <p className="fs-4 my-4">No photos yet.</p>}
      <div className="d-flex flex-wrap justify-content-evenly">
        {visible.map((photo, index) => (
          <div key={photo.id} className="gallery-img-container my-3 d-flex justify-content-center align-items-center">
            <Image
              src={photo.url}
              width={photo.width}
              height={photo.height}
              sizes="(max-width: 768px) 90vw, 600px"
              className={`gallery-img col-12 ${loaded.has(photo.id) ? "loaded" : ""}`}
              alt={`Soup in the Park, ${photo.album}`}
              onLoad={() => setLoaded((prev) => new Set(prev).add(photo.id))}
              onClick={() => setFocusedIndex(index)}
            />
          </div>
        ))}
      </div>
      {focused && (
        <div id="focused-img" className="show">
          {focusedLoading && <div className="spinner-border" role="status"></div>}
          <button id="close-btn" onClick={() => setFocusedIndex(null)}>
            &times;
          </button>
          <button id="prev-btn" className="gal-nav-btn" onClick={() => step(-1)}>
            &lt;
          </button>
          <button id="next-btn" className="gal-nav-btn" onClick={() => step(1)}>
            &gt;
          </button>
          <Image
            key={focused.id}
            className="fade-in"
            src={focused.url}
            width={focused.width}
            height={focused.height}
            sizes="90vw"
            style={{ width: "auto", height: "auto" }}
            alt=""
            onLoad={() => setFocusedLoading(false)}
          />
        </div>
      )}
    </div>
  );
}
