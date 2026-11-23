import Activity from "./activity";
import Icon from "./icons";
import PageHeading from "./page-heading";
import { latest, name, owner, readings, referenceDay, repository, repoUrl } from "./dashboard-data";
import { dailyCounts, dayKey, formatDay, number } from "./telemetry";

const previous = readings.at(-2);
const days = dailyCounts(readings, referenceDay);

function change(current?: number, prior?: number, unit = "") {
  if (current === undefined || prior === undefined) return "Sem comparação";
  const delta = current - prior;
  return delta === 0
    ? "Sem variação"
    : `${delta > 0 ? "+" : ""}${number(delta)}${unit} na última coleta`;
}

const metrics = [
  {
    label: "Leituras registradas",
    icon: "database",
    value: number(readings.length),
    detail: readings[0] ? "Desde " + formatDay(dayKey(readings[0].collectedAt)) : "Histórico vazio",
  },
  {
    label: "Tamanho",
    icon: "drive",
    value: latest ? number(latest.sizeKb) : "—",
    unit: "KB",
    detail: change(latest?.sizeKb, previous?.sizeKb, " KB"),
  },
  {
    label: "Estrelas",
    icon: "star",
    value: latest ? number(latest.stars) : "—",
    detail: change(latest?.stars, previous?.stars),
  },
  {
    label: "Forks",
    icon: "fork",
    value: latest ? number(latest.forks) : "—",
    detail: change(latest?.forks, previous?.forks),
  },
];

export default function Home() {
  return (
    <>
      <PageHeading title="Visão geral" />
      <section className="metric-band" aria-label="Métricas atuais">
        {metrics.map((metric) => (
          <article key={metric.label}>
            <h2>
              <Icon name={metric.icon} />
              {metric.label}
            </h2>
            <div className="metric-value">
              {metric.value}
              {metric.unit && <small>{metric.unit}</small>}
            </div>
            <p>{metric.detail}</p>
          </article>
        ))}
      </section>
      <div className="analysis-grid">
        <Activity days={days} hasData={Boolean(latest)} />
        <aside className="panel repo-panel" aria-labelledby="repo-title">
          <div className="panel-head">
            <h2 id="repo-title">
              <Icon name="book" />
              Repositório
            </h2>
          </div>
          <dl>
            <div>
              <dt>Autor das coletas</dt>
              <dd>
                {owner && name ? (
                  <a className="identity" href={"https://github.com/" + owner}>
                    @{owner}
                    <Icon name="arrow" size={12} />
                  </a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt>Branch padrão</dt>
              <dd>
                <Icon name="branch" size={13} />
                {latest?.defaultBranch ?? "—"}
              </dd>
            </div>
            <div>
              <dt>Linguagem</dt>
              <dd>
                {latest?.language === "TypeScript" && <i className="language-dot" />}
                {latest?.language ?? "—"}
              </dd>
            </div>
            <div>
              <dt>Itens abertos</dt>
              <dd>{latest ? number(latest.openItems) : "—"}</dd>
            </div>
            <div>
              <dt>Observadores</dt>
              <dd>{latest ? number(latest.subscribers) : "—"}</dd>
            </div>
          </dl>
          {repoUrl && (
            <a className="repo-source" href={`https://api.github.com/repos/${repository}`}>
              <Icon name="database" size={13} />
              API do GitHub
              <Icon name="arrow" size={12} />
            </a>
          )}
        </aside>
      </div>
    </>
  );
}
