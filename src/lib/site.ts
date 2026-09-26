import type { Metadata, Viewport } from "next";
import {
  Caveat,
  Chewy,
  Kaushan_Script,
  Montserrat,
  Mountains_of_Christmas,
  Patrick_Hand,
  Source_Sans_3,
  Zilla_Slab,
} from "next/font/google";
import appleTouchIcon from "@/assets/squareLogo.png";
import icon from "@/assets/loading.png";
import logo from "@/assets/logo.png";

// Soup season type follows the 2015 shirt: slab serif for "in the park",
// heavy sans for SOUP, plain sans for text, and handwriting for sign-ups.
const zilla = Zilla_Slab({ weight: ["300", "500", "700"], subsets: ["latin"], variable: "--font-zilla" });
const montserrat = Montserrat({ weight: "800", subsets: ["latin"], variable: "--font-montserrat" });
const sourceSans = Source_Sans_3({ weight: ["400", "600", "700"], subsets: ["latin"], variable: "--font-source" });
const caveat = Caveat({ weight: ["500", "700"], subsets: ["latin"], variable: "--font-caveat" });
// Neat printed handwriting for sign-up entries; Caveat is too loose to read in lists
const patrickHand = Patrick_Hand({ weight: "400", subsets: ["latin"], variable: "--font-hand" });

const chewy = Chewy({ weight: "400", subsets: ["latin"], variable: "--font-chewy" });
const kaushan = Kaushan_Script({ weight: "400", subsets: ["latin"], variable: "--font-kaushan" });
const mountains = Mountains_of_Christmas({ weight: "700", subsets: ["latin"], variable: "--font-mountains", adjustFontFallback: false });

export const soupFontClassName = `${zilla.variable} ${montserrat.variable} ${sourceSans.variable} ${caveat.variable} ${patrickHand.variable}`;
export const christmasFontClassName = `${chewy.variable} ${kaushan.variable} ${mountains.variable}`;

export const BOOTSTRAP_ICONS_URL = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css";

export const metadata: Metadata = {
  title: "Soup In The Park",
  icons: { icon: icon.src, apple: appleTouchIcon.src },
  appleWebApp: {
    title: "Soup in the Park",
    capable: true,
    statusBarStyle: "black-translucent",
    startupImage: logo.src,
  },
};

export const soupViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#E8895C",
};

export const christmasViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ff914d",
};
