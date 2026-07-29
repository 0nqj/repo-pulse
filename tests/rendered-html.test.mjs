import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exporta o painel transparente como HTML estático", async () => {
  const html = await readFile(new URL("out/index.html", root), "utf8");

  assert.match(html, /Repo Pulse/);
  assert.match(html, /Métricas reais\. Automação transparente\./);
  assert.match(html, /github-actions\[bot\]/);
  assert.match(html, /Aguardando coleta/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
});

test("mantém dados e agenda explicitamente automatizados", async () => {
  const [rawData, workflow] = await Promise.all([
    readFile(new URL("public/data/snapshots.json", root), "utf8"),
    readFile(new URL(".github/workflows/collect-metrics.yml", root), "utf8"),
  ]);

  const snapshots = JSON.parse(rawData);
  assert.ok(Array.isArray(snapshots));
  for (const snapshot of snapshots) {
    assert.equal(snapshot.automated, true);
    assert.equal(snapshot.source, "github-api");
  }
  assert.match(workflow, /cron: "7 14-21 \* \* \*"/);
  assert.match(workflow, /timezone: "America\/Sao_Paulo"/);
  assert.match(workflow, /github-actions\[bot\]/);
  assert.match(workflow, /repository snapshot \[bot\]/);
});
