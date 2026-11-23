import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const archive = fileURLToPath(new URL("../scripts/archive-month.sh", import.meta.url));

test("atualiza a branch uma vez por dia e fecha o mês no último registro", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "repo-pulse-archive-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const env = { ...process.env, GITHUB_REPOSITORY_OWNER: "octo", GITHUB_REPOSITORY_OWNER_ID: "12345" };
  const run = (cmd, ...args) =>
    execFileSync(cmd, args, { cwd: dir, env, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  const git = (...args) => run("git", ...args);
  const record = (day) => {
    git("fetch", "origin");
    run("bash", archive, day);
  };
  git("init", "--bare", "--initial-branch=main", "remote.git");
  git("init", "--initial-branch=main");
  git("config", "user.name", "Teste");
  git("config", "user.email", "teste@example.invalid");
  git("remote", "add", "origin", "./remote.git");
  function updateMain(data) {
    writeFileSync(join(dir, "leituras"), data);
    git("add", "leituras");
    git("commit", "-m", "Atualizar leituras");
    git("push", "origin", "main");
    return git("rev-parse", "main");
  }

  const november = "origin/mensal/2026-11";
  const december = "origin/mensal/2026-12";
  const first = updateMain("primeira coleta");
  record("2026-11-29");
  const initial = git("rev-parse", november);
  assert.equal(git("show", november + ":.repo-pulse/arquivo-diario"), "2026-11-29 " + first);
  assert.equal(git("log", "-1", "--format=%an|%ae|%cn", november),
    "octo|12345+octo@users.noreply.github.com|github-actions[bot]");
  git("switch", "main");
  const next = updateMain("segunda coleta");
  record("2026-11-29");
  assert.equal(git("rev-parse", november), initial);
  record("2026-11-30");
  const closed = git("rev-parse", november);
  assert.notEqual(closed, initial);
  assert.equal(git("show", november + ":leituras"), "segunda coleta");
  assert.equal(git("show", november + ":.repo-pulse/arquivo-diario"), "2026-11-30 " + next);
  git("merge-base", "--is-ancestor", initial, closed);

  record("2026-12-01");
  assert.equal(git("rev-parse", november), closed);
  assert.equal(git("rev-parse", december + "^"), next);
  assert.equal(git("show", december + ":.repo-pulse/arquivo-diario"), "2026-12-01 " + next);
  assert.equal(git("rev-parse", "origin/main"), next);
});
