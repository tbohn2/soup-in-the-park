import Image from "next/image";
import type { Metadata } from "next";
import { approvePhoto, deletePhoto, logout } from "@/app/actions/admin";
import { adminConfigured, isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { EVENTS } from "@/lib/events";
import LoginForm from "./LoginForm";

export const metadata: Metadata = { title: "Admin | Soup In The Park", robots: { index: false } };

export default async function AdminPage() {
  if (!adminConfigured()) {
    return (
      <div className="main-content d-flex flex-column align-items-center p-4">
        <p className="fs-4">Admin is disabled. Set ADMIN_PASSWORD to enable it.</p>
      </div>
    );
  }
  if (!(await isAdmin())) {
    return (
      <div className="main-content d-flex flex-column align-items-center">
        <LoginForm />
      </div>
    );
  }

  const [pending, signupCounts] = await Promise.all([
    db.photo.findMany({ where: { approved: false }, orderBy: { createdAt: "asc" } }),
    db.signup.groupBy({ by: ["event"], _count: true }),
  ]);
  const countFor = (key: string) => signupCounts.find((c) => c.event === key)?._count ?? 0;

  return (
    <div className="main-content d-flex flex-column align-items-center gap-3 pb-5">
      <div className="panel my-3 col-xl-6 col-lg-8 col-md-9 col-11">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="panel-title mb-0">Sign-ups</h2>
          <form action={logout}>
            <button className="btn btn-sm btn-outline-secondary" type="submit">
              Sign out
            </button>
          </form>
        </div>
        <ul className="list-unstyled fs-5 mt-3 mb-0">
          {EVENTS.map((event) => (
            <li key={event.key} className="d-flex justify-content-between py-1">
              <span>
                {event.key} ({countFor(event.key)} rows)
              </span>
              <a href={`/admin/export/${event.key}`}>
                <i className="bi bi-download"></i> CSV
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="panel col-xl-6 col-lg-8 col-md-9 col-11">
        <h2 className="panel-title">Photos waiting for approval ({pending.length})</h2>
        {pending.length === 0 && <p className="fs-5 mb-0">Nothing to review.</p>}
        <div className="d-flex flex-wrap gap-3">
          {pending.map((photo) => (
            <div key={photo.id} className="card" style={{ width: 260 }}>
              <Image
                src={photo.url}
                width={photo.width}
                height={photo.height}
                sizes="260px"
                className="card-img-top object-fit-cover"
                style={{ height: 200 }}
                alt=""
              />
              <div className="card-body p-2">
                <p className="mb-2 small">
                  {photo.collection} &middot; {photo.album}
                  {photo.submittedBy && <> &middot; from {photo.submittedBy}</>}
                </p>
                <div className="d-flex gap-2">
                  <form action={approvePhoto.bind(null, photo.id)} className="flex-grow-1">
                    <button className="btn btn-sm btn-success w-100" type="submit">
                      Approve
                    </button>
                  </form>
                  <form action={deletePhoto.bind(null, photo.id)} className="flex-grow-1">
                    <button className="btn btn-sm btn-danger w-100" type="submit">
                      Delete
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
