export type Snapshot = {
  automated: true;
  branchHead: string;
  collectedAt: string;
  defaultBranch: string;
  forks: number;
  language: string | null;
  openItems: number;
  repository: string;
  sizeKb: number;
  source: "github-api";
  stars: number;
  subscribers: number;
};

export type Day = { date: string; count: number };

export const timeZone = "America/Sao_Paulo";
const calendar = new Intl.DateTimeFormat("en-CA", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
export const dayKey = (timestamp: string) => calendar.format(new Date(timestamp));
export const localTime = new Intl.DateTimeFormat("pt-BR", {
  timeZone,
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});
export const localDate = new Intl.DateTimeFormat("pt-BR", {
  timeZone,
  day: "2-digit",
  month: "short",
  year: "numeric",
});
const shortDay = new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC", day: "2-digit", month: "short" });
export const formatDay = (day: string) =>
  shortDay
    .format(new Date(day + "T12:00:00Z"))
    .replace(" de ", " ")
    .replace(".", "");
export const number = (value: number) => value.toLocaleString("pt-BR");

export function dailyCounts(readings: Snapshot[], lastDate: string): Day[] {
  const totals = new Map<string, number>();
  for (const reading of readings) {
    const date = dayKey(reading.collectedAt);
    totals.set(date, (totals.get(date) ?? 0) + 1);
  }
  const lastDay = Date.parse(lastDate + "T12:00:00Z");
  return Array.from({ length: 90 }, (_, index) => {
    const date = new Date(lastDay - (89 - index) * 86400000).toISOString().slice(0, 10);
    return { date, count: totals.get(date) ?? 0 };
  });
}
