import { connection } from "next/server";
import ChristmasSignUp from "@/components/ChristmasSignUp";
import { CHRISTMAS_EVENT } from "@/lib/events";
import { getSignupBoard } from "@/lib/signups";

export default async function ChristmasSignUpPage() {
  await connection();
  const board = await getSignupBoard(CHRISTMAS_EVENT);
  return <ChristmasSignUp initialBoard={board} />;
}
