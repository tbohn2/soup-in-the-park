import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/christmasApp.css";
import "@/styles/christmasSignUp.css";
import "@/styles/christmasGallery.css";
import "@/styles/shared.css";
import christmasLogo from "@/assets/christmas/nativity-1.jpeg";
import Header from "@/components/Header";
import { BOOTSTRAP_ICONS_URL, christmasFontClassName } from "@/lib/site";

export { metadata, christmasViewport as viewport } from "@/lib/site";

export default function ChristmasLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={christmasFontClassName}>
      <head>
        <link rel="stylesheet" href={BOOTSTRAP_ICONS_URL} />
      </head>
      <body className="body">
        <div className="bg-yellow text-blue">
          <Header logo={christmasLogo} />
          {children}
        </div>
      </body>
    </html>
  );
}
