import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

test("exporta três páginas com destinos e conteúdo próprios", async () => {
  const [overview, history, automation] = await Promise.all(
    ["", "historico/", "automacao/"].map((route) =>
      readFile(new URL("out/" + route + "index.html", root), "utf8"),
    ),
  );
  const pages = [overview, history, automation];
  const links = ["Visão geral", "Histórico", "Automação"];
  const prefix =
    process.env.GITHUB_ACTIONS === "true" && process.env.GITHUB_REPOSITORY
      ? process.env.GITHUB_REPOSITORY.split("/")[1]
      : "";
  const base = prefix && !prefix.endsWith(".github.io") ? "/" + prefix : "";
  for (const [index, html] of pages.entries()) {
    const nav = html.match(/<nav\b[^>]*>([\s\S]*?)<\/nav>/)?.[1];
    assert.ok(nav);
    const anchors = [...nav.matchAll(/<a\b([^>]*)>([^<]*)<\/a>/g)];
    assert.deepEqual(
      anchors.map(([, attrs]) => attrs.match(/href="([^"]+)"/)?.[1]),
      [base + "/", base + "/historico/", base + "/automacao/"],
    );
    assert.deepEqual(
      anchors.filter(([, attrs]) => attrs.includes('aria-current="page"')).map(([, , label]) => label),
      [links[index]],
    );
    assert.doesNotMatch(html, /codex-preview|Your site is taking shape|SkeletonPreview/);
  }
  assert.match(overview, /Atividade de coleta/);
  assert.match(overview, /API do GitHub/);
  assert.doesNotMatch(overview, /<table\b|id="schedule-title"/);
  assert.match(history, /<h1>Histórico de leituras<\/h1>/);
  assert.match(history, /<table\b/);
  assert.match(history, /Baixar JSON/);
  assert.doesNotMatch(history, /id="chart-title"|id="schedule-title"/);
  assert.match(automation, /<h1>Automação<\/h1>/);
  assert.match(automation, /Agenda de coleta/);
  assert.match(automation, /github-actions\[bot\]/);
  assert.match(automation, /workflows\/collect-metrics\.yml/);
  assert.match(automation, /workflows\/archive-month\.yml/);
  assert.doesNotMatch(automation, /<table\b|id="chart-title"/);
});

test("mantém dados e agenda explicitamente automatizados", async () => {
  const [rawData, workflow, deployWorkflow] = await Promise.all([
    readFile(new URL("public/data/snapshots.json", root), "utf8"),
    readFile(new URL(".github/workflows/collect-metrics.yml", root), "utf8"),
    readFile(new URL(".github/workflows/deploy-pages.yml", root), "utf8"),
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
  assert.match(workflow, /actions\/checkout@v7/);
  assert.match(workflow, /actions\/setup-node@v7/);
  assert.match(deployWorkflow, /workflow_run:/);
  assert.match(deployWorkflow, /workflows: \["Coletar métricas do repositório"\]/);
  assert.match(deployWorkflow, /workflow_run\.conclusion == 'success'/);
  assert.match(deployWorkflow, /actions\/configure-pages@v6/);
  assert.match(deployWorkflow, /actions\/upload-pages-artifact@v5/);
  assert.match(deployWorkflow, /actions\/deploy-pages@v5/);
});
