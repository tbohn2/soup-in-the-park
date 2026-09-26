"use server";

import { db } from "@/lib/db";
import { getEvent } from "@/lib/events";
import { getSignupBoard, type SignupBoard } from "@/lib/signups";

const MAX_FIELD_LENGTH = 100;
const MAX_ROWS_PER_SAVE = 100;

type RowInput = { name: string; detail: string };

export type SaveSignupsInput = {
  event: string;
  category: string;
  create?: RowInput;
  updates: (RowInput & { id: string })[];
  deleteIds: string[];
};

export type SaveSignupsResult = { ok: true; board: SignupBoard } | { ok: false; error: string };

function clean(row: RowInput): RowInput | null {
  const name = row.name.trim();
  const detail = row.detail.trim();
  if (!name || !detail || name.length > MAX_FIELD_LENGTH || detail.length > MAX_FIELD_LENGTH) return null;
  return { name, detail };
}

// One save per card, mirroring the old sheet flow, but applied as row-level
// changes so two people saving at once no longer overwrite each other.
export async function saveSignups(input: SaveSignupsInput): Promise<SaveSignupsResult> {
  const event = getEvent(input.event);
  if (!event || !event.categories.some((c) => c.key === input.category)) {
    return { ok: false, error: "Unknown sign-up section" };
  }

  if (input.updates.length > MAX_ROWS_PER_SAVE || input.deleteIds.length > MAX_ROWS_PER_SAVE) {
    return { ok: false, error: "Too many changes at once" };
  }

  const deleteIds = new Set(input.deleteIds);
  const create = input.create ? clean(input.create) : undefined;
  const updates = input.updates.filter((u) => !deleteIds.has(u.id)).map((u) => ({ id: u.id, row: clean(u) }));
  if (create === null || updates.some((u) => u.row === null)) {
    return { ok: false, error: `Please fill in both fields (up to ${MAX_FIELD_LENGTH} characters)` };
  }

  const scope = { event: event.key, category: input.category };
  try {
    await db.$transaction([
      ...(create ? [db.signup.create({ data: { ...scope, ...create } })] : []),
      ...updates.map((u) => db.signup.updateMany({ where: { id: u.id, ...scope }, data: u.row! })),
      ...(deleteIds.size > 0 ? [db.signup.deleteMany({ where: { id: { in: [...deleteIds] }, ...scope } })] : []),
    ]);
  } catch (error) {
    console.error("Failed to save sign-ups", error);
    return { ok: false, error: "Error saving data; try again later" };
  }

  return { ok: true, board: await getSignupBoard(event) };
}
