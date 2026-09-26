// Copies the current soup sign-ups from the Google Sheet (via its Apps Script)
// into Neon. Run once more right before cutover to pick up late sign-ups.
// Refuses to touch an event that already has rows unless --replace is passed,
// so it can't clobber sign-ups made on the new site.
import { db } from "@/lib/db";
import { SOUP_EVENT } from "@/lib/events";

const SHEET_URL = "https://script.google.com/macros/s/AKfycbyN0yil3m_DANY2UEcWHkXhBAmg8nS2aUBcM_1EC5cRdA8S7uTqneF2Xk9SYNRfbHhjUA/exec";

async function main() {
  const replace = process.argv.includes("--replace");
  const existing = await db.signup.count({ where: { event: SOUP_EVENT.key } });
  if (existing > 0 && !replace) {
    throw new Error(`${SOUP_EVENT.key} already has ${existing} rows; pass --replace to overwrite them`);
  }

  const response = await fetch(SHEET_URL);
  if (!response.ok) throw new Error(`Sheet request failed: ${response.status}`);
  const sheet = (await response.json()) as Record<string, unknown>;

  // Sheet rows are [name, detail]; skip blanks the sheet sometimes returns.
  const base = Date.now();
  const rows = SOUP_EVENT.categories.flatMap(({ key }) => {
    const values = Array.isArray(sheet[key]) ? (sheet[key] as unknown[][]) : [];
    return values
      .map(([name, detail]) => ({ name: String(name ?? "").trim(), detail: String(detail ?? "").trim() }))
      .filter((r) => r.name || r.detail)
      .map((r, i) => ({ ...r, event: SOUP_EVENT.key, category: key, createdAt: new Date(base + i) }));
  });

  await db.$transaction([
    db.signup.deleteMany({ where: { event: SOUP_EVENT.key } }),
    db.signup.createMany({ data: rows }),
  ]);
  console.log(`Imported ${rows.length} sign-ups into ${SOUP_EVENT.key}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
