import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const repository = process.env.GITHUB_REPOSITORY;
const token = process.env.GITHUB_TOKEN;
const apiUrl = process.env.GITHUB_API_URL ?? "https://api.github.com";

if (!repository || !repository.includes("/")) {
  throw new Error("GITHUB_REPOSITORY deve estar no formato owner/repository.");
}

if (!token) {
  throw new Error("GITHUB_TOKEN não está disponível para consultar a API.");
}

const headers = {
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${token}`,
  "User-Agent": "repo-pulse-transparent-metrics",
  "X-GitHub-Api-Version": "2022-11-28",
};

async function github(path) {
  const response = await fetch(`${apiUrl}${path}`, { headers });
  if (!response.ok) {
    throw new Error(`GitHub API respondeu ${response.status} em ${path}.`);
  }
  return response.json();
}

function localParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
}

const [owner, name] = repository.split("/");
const repo = await github(`/repos/${owner}/${name}`);
const branch = await github(
  `/repos/${owner}/${name}/branches/${encodeURIComponent(repo.default_branch)}`,
);
const now = new Date();
const slot = localParts(now);
const slotKey = `${slot.year}-${slot.month}-${slot.day}T${slot.hour}`;
const dataPath = resolve("public/data/snapshots.json");

await mkdir(dirname(dataPath), { recursive: true });

let snapshots = [];
try {
  snapshots = JSON.parse(await readFile(dataPath, "utf8"));
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}

const alreadyCollected = snapshots.some((snapshot) => {
  const existing = localParts(new Date(snapshot.collectedAt));
  return `${existing.year}-${existing.month}-${existing.day}T${existing.hour}` === slotKey;
});

if (alreadyCollected) {
  console.log(`A janela ${slotKey}:00 já possui uma leitura; nenhuma alteração feita.`);
  process.exit(0);
}

snapshots.push({
  automated: true,
  branchHead: branch.commit.sha,
  collectedAt: now.toISOString(),
  defaultBranch: repo.default_branch,
  forks: repo.forks_count,
  language: repo.language,
  openItems: repo.open_issues_count,
  repository,
  sizeKb: repo.size,
  source: "github-api",
  stars: repo.stargazers_count,
  subscribers: repo.subscribers_count,
});

snapshots = snapshots.slice(-1440);
await writeFile(dataPath, `${JSON.stringify(snapshots, null, 2)}\n`, "utf8");
console.log(`Leitura ${slotKey}:00 registrada com dados da API do GitHub.`);
