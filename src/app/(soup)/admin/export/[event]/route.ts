import { isAdmin } from "@/lib/admin";
import { db } from "@/lib/db";
import { getEvent } from "@/lib/events";

function csvCell(value: string) {
  // Leading =, +, -, @ would run as a formula when opened in a spreadsheet.
  const safe = /^[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export async function GET(_request: Request, ctx: RouteContext<"/admin/export/[event]">) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const { event: eventKey } = await ctx.params;
  const event = getEvent(eventKey);
  if (!event) return new Response("Unknown event", { status: 404 });

  const rows = await db.signup.findMany({ where: { event: event.key }, orderBy: [{ category: "asc" }, { createdAt: "asc" }] });
  const titles = new Map(event.categories.map((c) => [c.key, c.title]));
  const lines = [
    ["Section", "Name", "Detail", "Signed up"].map(csvCell).join(","),
    ...rows.map((r) => [titles.get(r.category) ?? r.category, r.name, r.detail, r.createdAt.toISOString()].map(csvCell).join(",")),
  ];

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${event.key}-signups.csv"`,
    },
  });
}
