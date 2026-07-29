import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import test from "node:test";

const execute = promisify(execFile);
const collector = fileURLToPath(
  new URL("../scripts/collect-metrics.mjs", import.meta.url),
);

test("coleta dados reais do contrato da API e evita duplicatas na mesma hora", async () => {
  const workspace = await mkdtemp(join(tmpdir(), "repo-pulse-test-"));
  const server = createServer((request, response) => {
    response.setHeader("content-type", "application/json");
    if (request.url === "/repos/octo/repo") {
      response.end(
        JSON.stringify({
          default_branch: "main",
          forks_count: 3,
          language: "TypeScript",
          open_issues_count: 2,
          size: 128,
          stargazers_count: 7,
          subscribers_count: 1,
        }),
      );
      return;
    }
    if (request.url === "/repos/octo/repo/branches/main") {
      response.end(JSON.stringify({ commit: { sha: "abc123456789" } }));
      return;
    }
    response.statusCode = 404;
    response.end("{}");
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const environment = {
    ...process.env,
    GITHUB_API_URL: `http://127.0.0.1:${address.port}`,
    GITHUB_REPOSITORY: "octo/repo",
    GITHUB_TOKEN: "test-token",
  };

  try {
    await execute(process.execPath, [collector], { cwd: workspace, env: environment });
    await execute(process.execPath, [collector], { cwd: workspace, env: environment });

    const snapshots = JSON.parse(
      await readFile(join(workspace, "public/data/snapshots.json"), "utf8"),
    );

    assert.equal(snapshots.length, 1);
    assert.deepEqual(
      {
        automated: snapshots[0].automated,
        branchHead: snapshots[0].branchHead,
        forks: snapshots[0].forks,
        repository: snapshots[0].repository,
        source: snapshots[0].source,
        stars: snapshots[0].stars,
      },
      {
        automated: true,
        branchHead: "abc123456789",
        forks: 3,
        repository: "octo/repo",
        source: "github-api",
        stars: 7,
      },
    );
  } finally {
    server.close();
    await rm(workspace, { recursive: true, force: true });
  }
});
