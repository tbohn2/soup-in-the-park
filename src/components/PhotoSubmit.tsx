"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";
import { submitPhoto } from "@/app/actions/photos";
import type { Collection } from "@/lib/photos";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "done" } | { kind: "error"; message: string };

export default function PhotoSubmit({ collection }: { collection: Collection }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const file = formData.get("photo");
    if (!(file instanceof File) || file.size === 0) {
      setStatus({ kind: "error", message: "Choose a photo to upload" });
      return;
    }

    setStatus({ kind: "sending" });
    try {
      // Phone photos are often 5-10MB; shrink them here so the upload fits
      // the server limit. The server resizes again to the gallery size.
      const compressed = await imageCompression(file, { maxSizeMB: 3, maxWidthOrHeight: 2400, useWebWorker: true });
      formData.set("photo", compressed, file.name);
      formData.set("collection", collection);

      const result = await submitPhoto(formData);
      if (!result.ok) {
        setStatus({ kind: "error", message: result.error });
        return;
      }
      form.reset();
      setStatus({ kind: "done" });
    } catch (error) {
      console.error("Photo upload failed:", error);
      setStatus({ kind: "error", message: "Upload failed; try again later" });
    }
  };

  if (!open) {
    return (
      <button type="button" className="btn btn-light border my-2" onClick={() => setOpen(true)}>
        <i className="bi bi-camera"></i> Share a photo
      </button>
    );
  }

  return (
    <form className="photo-submit card p-3 my-3 col-xl-4 col-lg-6 col-md-8 col-11 d-flex flex-column gap-2" onSubmit={handleSubmit}>
      <h2 className="fs-4 mb-0">Share a photo</h2>
      <p className="mb-1 text-muted">Photos show up in the gallery once they&apos;re approved.</p>
      <input className="form-control" type="file" name="photo" accept="image/*" required />
      <input className="form-control" type="text" name="name" placeholder="Your name (optional)" maxLength={100} />
      <input
        className="form-control"
        type="number"
        name="year"
        placeholder="Year taken (optional)"
        min={1990}
        max={new Date().getFullYear()}
      />
      {status.kind === "error" && <div className="text-danger">{status.message}</div>}
      {status.kind === "done" && <div className="text-success">Thanks! Your photo will appear once it&apos;s approved.</div>}
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-dark flex-grow-1" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Uploading..." : "Upload"}
        </button>
        <button type="button" className="btn btn-outline-secondary" onClick={() => setOpen(false)}>
          Close
        </button>
      </div>
    </form>
  );
}
