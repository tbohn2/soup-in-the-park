"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BirdClock, { playRandomCall } from "./BirdClock";
import { LogoMark } from "./Logo";

const LINKS = [
  { href: "/", label: "Sign up" },
  { href: "/gallery", label: "Gallery" },
];

export default function SoupHeader() {
  const pathname = usePathname();
  const onGallery = pathname.startsWith("/gallery");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const clockRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [menuOpen]);

  const isCurrent = (href: string) => (href === "/gallery" ? onGallery : !onGallery);

  return (
    <header className="site-header wrap" data-home={pathname === "/"}>
      <Link
        href="/"
        className="site-mark"
        onClick={() => {
          // Sings only where the clock is showing; CSS decides that (phones get the bowl)
          if (clockRef.current?.checkVisibility()) playRandomCall();
        }}
      >
        <BirdClock ref={clockRef} className="bird-clock" />
        <LogoMark className="mark-bowl" />
        <span className="mark-words" aria-hidden="true">
          in the park
        </span>
        <span className="visually-hidden">Soup in the Park, home</span>
      </Link>

      <nav className="site-nav" aria-label="Main">
        {LINKS.map((link) => (
          <Link key={link.href} href={link.href} aria-current={isCurrent(link.href) ? "page" : undefined}>
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="menu" ref={menuRef}>
        <button
          type="button"
          className="key key-edit menu-button"
          aria-expanded={menuOpen}
          aria-controls="site-menu"
          aria-label="Menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg className="menu-icon" width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
            <path className="menu-line menu-line-top" d="M3 6h16" />
            <path className="menu-line menu-line-mid" d="M3 11h16" />
            <path className="menu-line menu-line-bottom" d="M3 16h16" />
          </svg>
        </button>
        {/* Stays mounted so it can animate out; inert keeps it out of reach while closed */}
        <nav id="site-menu" className="menu-panel" aria-label="Main" data-open={menuOpen} inert={!menuOpen}>
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isCurrent(link.href) ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
