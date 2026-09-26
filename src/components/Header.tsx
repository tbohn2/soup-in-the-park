"use client";

import { useEffect } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header({ logo }: { logo: StaticImageData }) {
  const pathname = usePathname();
  // In season the proxy rewrites "/" to "/christmas", so the browser path stays
  // "/". Visiting /christmas directly (to preview it) keeps links under it.
  const base = pathname.startsWith("/christmas") ? "/christmas" : "";
  const onGallery = pathname.endsWith("/gallery");

  useEffect(() => {
    // Bootstrap's JS drives the mobile dropdown and touches `document`, so load it client-side only.
    import("bootstrap/dist/js/bootstrap.bundle.min.js").catch((error) => {
      console.error("Failed to load Bootstrap JS:", error);
    });
  }, []);

  const signUpClick = () => {
    document.getElementById("Soups")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="py-2 d-flex align-items-center">
      <Image src={logo} alt="" priority sizes="350px" />
      <nav className="nav-mobile chewy fs-2 justify-content-evenly">
        <div className="dropdown">
          <span data-bs-toggle="dropdown" aria-expanded="false">
            &#9776;
          </span>
          <ul className="col-12 dropdown-menu m-0 p-0">
            <li className="col-12 fs-3 bg-yellow">
              <Link href={base || "/"} onClick={signUpClick}>
                Sign-up
              </Link>
            </li>
            <li className="col-12 fs-3 bg-yellow">
              <Link href={`${base}/gallery`}>Gallery</Link>
            </li>
          </ul>
        </div>
      </nav>
      <nav className="nav-desktop chewy bg-yellow fs-3 justify-content-evenly">
        <Link href={base || "/"} className={`nav-btn ${!onGallery ? "text-decoration-underline" : ""}`} onClick={signUpClick}>
          Sign-up
        </Link>
        <Link href={`${base}/gallery`} className={`nav-btn ${onGallery ? "text-decoration-underline" : ""}`}>
          Gallery
        </Link>
      </nav>
    </header>
  );
}
