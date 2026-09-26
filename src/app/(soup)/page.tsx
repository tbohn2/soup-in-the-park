import { connection } from "next/server";
import GalleryHighlights from "@/components/GalleryHighlights";
import GrassBand from "@/components/GrassBand";
import SoupHero from "@/components/SoupHero";
import SoupSignUp from "@/components/SoupSignUp";
import { SOUP_EVENT } from "@/lib/events";
import { getHighlights } from "@/lib/photos";
import { getSignupBoard } from "@/lib/signups";

export default async function SignUpPage() {
  await connection();
  const [board, highlights] = await Promise.all([getSignupBoard(SOUP_EVENT), getHighlights("soup", 4)]);

  return (
    <main>
      <SoupHero />
      <GrassBand id="grass-hero" />
      <SoupSignUp initialBoard={board} />
      <GalleryHighlights photos={highlights} />
    </main>
  );
}
