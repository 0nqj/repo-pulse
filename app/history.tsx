"use client";

import { useState } from "react";
import Icon from "./icons";
import { localDate, localTime, number, type Snapshot } from "./telemetry";

export type HistoryRow = Pick<
  Snapshot,
  "collectedAt" | "branchHead" | "defaultBranch" | "sizeKb" | "repository"
>;
const pageSize = 8;
export default function History({ rows }: { rows: HistoryRow[] }) {
  const [page, setPage] = useState(0);
  const pages = Math.ceil(rows.length / pageSize);
  const start = page * pageSize;
  const visible = rows.slice(start, start + pageSize);
  return (
    <section id="historico" className="panel history-panel" aria-labelledby="history-title">
      <div className="panel-head">
        <h2 id="history-title">
          <Icon name="history" />
          Histórico de leituras
        </h2>
        <a href="./data/snapshots.json" download="repo-pulse.json" className="quiet-button">
          <Icon name="download" />
          Baixar JSON
        </a>
      </div>
      {rows.length ? (
        <>
          <div
            className="table-scroll"
            role="region"
            tabIndex={0}
            aria-label="Histórico de leituras, tabela com rolagem horizontal"
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">
                    Coleta <span aria-hidden="true">↓</span>
                  </th>
                  <th scope="col">Branch</th>
                  <th scope="col">Commit observado</th>
                  <th scope="col" className="numeric">
                    Tamanho
                  </th>
                  <th scope="col">Origem</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((row) => {
                  const date = new Date(row.collectedAt);
                  return (
                    <tr key={row.collectedAt}>
                      <td>
                        <time dateTime={row.collectedAt}>
                          <span>{localDate.format(date).replaceAll(" de ", " ")}</span>
                          <span className="table-hour">{localTime.format(date)}</span>
                        </time>
                      </td>
                      <td>
                        <span className="inline-value">
                          <Icon name="branch" size={13} />
                          {row.defaultBranch}
                        </span>
                      </td>
                      <td>
                        <a
                          className="commit-link"
                          href={`https://github.com/${row.repository}/commit/${row.branchHead}`}
                          aria-label={`Abrir commit ${row.branchHead.slice(0, 7)}`}
                        >
                          <Icon name="commit" size={14} />
                          {row.branchHead.slice(0, 7)}
                        </a>
                      </td>
                      <td className="numeric">{number(row.sizeKb)} KB</td>
                      <td>
                        <span className="inline-value origin">
                          <Icon name="bot" size={14} />
                          GitHub Actions
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="history-foot">
            <span aria-live="polite">
              {number(start + 1)}–{number(start + visible.length)} de {number(rows.length)} leituras
            </span>
            <div className="pager">
              <button
                aria-label="Página anterior"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                <Icon name="back" size={15} />
              </button>
              <span>
                {page + 1} / {pages}
              </span>
              <button
                aria-label="Próxima página"
                disabled={page + 1 === pages}
                onClick={() => setPage(page + 1)}
              >
                <Icon name="next" size={15} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <p className="empty">Aguardando a primeira leitura do repositório.</p>
      )}
    </section>
  );
}
