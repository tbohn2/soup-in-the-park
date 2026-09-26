const EVENT_TIME_ZONE = "America/Phoenix";

// Christmas layout runs Oct 30 through Dec 31, judged by Arizona time so the
// switch doesn't happen at 5pm local when UTC rolls over.
export function isChristmasSeason(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: EVENT_TIME_ZONE,
    month: "numeric",
    day: "numeric",
  }).formatToParts(now);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  return (month === 10 && day >= 30) || month === 11 || month === 12;
}
