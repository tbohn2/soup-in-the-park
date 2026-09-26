import { db } from "@/lib/db";
import type { EventConfig } from "@/lib/events";

export type SignupRow = { id: string; name: string; detail: string };
export type SignupBoard = Record<string, SignupRow[]>;

export async function getSignupBoard(event: EventConfig): Promise<SignupBoard> {
  const rows = await db.signup.findMany({
    where: { event: event.key },
    orderBy: { createdAt: "asc" },
    select: { id: true, category: true, name: true, detail: true },
  });

  const board: SignupBoard = Object.fromEntries(event.categories.map((c) => [c.key, []]));
  for (const { category, ...row } of rows) {
    board[category]?.push(row);
  }
  return board;
}
