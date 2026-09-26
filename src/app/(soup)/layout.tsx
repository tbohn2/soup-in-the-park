import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/soup.css";
import SoupHeader from "@/components/SoupHeader";
import { BOOTSTRAP_ICONS_URL, soupFontClassName } from "@/lib/site";

export { metadata, soupViewport as viewport } from "@/lib/site";

// Separate root layout from (christmas) so each season's global CSS never
// loads on the other's pages.
export default function SoupLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={soupFontClassName}>
      <head>
        <link rel="stylesheet" href={BOOTSTRAP_ICONS_URL} />
      </head>
      <body className="soup">
        <div className="collar" aria-hidden="true" />
        <SoupHeader />
        {children}
      </body>
    </html>
  );
}
