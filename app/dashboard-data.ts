import snapshotsData from "../public/data/snapshots.json";
import { dayKey, type Snapshot } from "./telemetry";

export const readings = [...(snapshotsData as Snapshot[])].sort((a, b) =>
  a.collectedAt.localeCompare(b.collectedAt),
);
export const latest = readings.at(-1);
export const repository = process.env.GITHUB_REPOSITORY ?? latest?.repository ?? "";
export const [owner, name] = repository.split("/");
export const repoUrl = owner && name ? "https://github.com/" + repository : null;
export const referenceDay = dayKey(latest?.collectedAt ?? new Date().toISOString());
