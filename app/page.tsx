import snapshotsData from "../public/data/snapshots.json";
import Activity from "./activity";
import History from "./history";
import Icon from "./icons";
import Nav from "./nav";
import {
  dailyCounts,
  dayKey,
  formatDay,
  localDate,
  localTime,
  number,
  type Snapshot,
} from "./telemetry";

const readings = [...(snapshotsData as Snapshot[])].sort((a, b) =>
  a.collectedAt.localeCompare(b.collectedAt),
);
const latest = readings.at(-1);
const previous = readings.at(-2);
const repository = process.env.GITHUB_REPOSITORY ?? latest?.repository ?? "";
const [owner, name] = repository.split("/");
const repoUrl = owner && name ? "https://github.com/" + repository : null;
const updated = latest ? new Date(latest.collectedAt) : null;
const referenceDay = dayKey(latest?.collectedAt ?? new Date().toISOString());
const days = dailyCounts(readings, referenceDay);
const latestDay = readings.filter((reading) => dayKey(reading.collectedAt) === referenceDay);
const hours = Array.from({ length: 8 }, (_, i) => i + 14);
const history = [...readings]
  .reverse()
  .map(({ collectedAt, branchHead, defaultBranch, repository, sizeKb }) => ({
    collectedAt,
    branchHead,
    defaultBranch,
    repository,
    sizeKb,
  }));

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
      <a className="skip-link" href="#visao-geral">
        Pular para o painel
      </a>
      <header className="topbar">
        <div className="shell header-inner">
          <a href="#visao-geral" className="brand" aria-label="Repo Pulse, início">
            <span className="brand-mark">
              <Icon name="pulse" size={23} />
            </span>
            Repo Pulse
          </a>
          <Nav />
          {repoUrl && (
            <a className="github-button" href={repoUrl}>
              <Icon name="github" size={15} />
              GitHub
              <Icon name="arrow" size={12} />
            </a>
          )}
        </div>
      </header>
      <main className="shell" id="visao-geral">
        <div className="overview">
          <div>
            <h1>Visão geral</h1>
            <div className="repo-path">
              <Icon name="book" size={15} />
              {repoUrl ? (
                <a href={repoUrl}>
                  {owner}
                  <span className="slash">/</span>
                  <strong>{name}</strong>
                </a>
              ) : (
                "Repositório pendente"
              )}
              {latest && (
                <span className="branch-tag">
                  <Icon name="branch" size={12} />
                  {latest.defaultBranch}
                </span>
              )}
            </div>
          </div>
          <div className="latest">
            <span>
              <i />
              Última coleta
            </span>
            {updated && latest ? (
              <time dateTime={latest.collectedAt}>
                {localDate.format(updated).replaceAll(" de ", " ")}
                <b>·</b>
                {localTime.format(updated)} BRT
              </time>
            ) : (
              <span>Aguardando coleta</span>
            )}
          </div>
        </div>
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
        <History rows={history} />
        <section id="automacao" className="panel schedule-panel" aria-labelledby="schedule-title">
          <div className="panel-head">
            <h2 id="schedule-title">
              <Icon name="calendar" />
              Agenda de coleta
            </h2>
            <span className="schedule-date">{formatDay(referenceDay)} · BRT</span>
          </div>
          <p>Coletas agendadas a cada hora, das 14h07 às 21h07, no horário de São Paulo.</p>
          <div className="slots">
            {hours.map((hour) => {
              const reading = latestDay.find(
                (row) => Number(localTime.format(new Date(row.collectedAt)).slice(0, 2)) === hour,
              );
              return (
                <div key={hour}>
                  <strong>{hour}:07</strong>
                  <span className={reading ? "done" : ""}>
                    <i />
                    {reading ? "Registrada" : "Sem leitura"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="schedule-note">
            <Icon name="bot" size={15} />
            <span>O github-actions[bot] registra as coletas com a marca [bot].</span>
            {repoUrl && (
              <a href={repoUrl + "/actions/workflows/collect-metrics.yml"}>
                Ver execuções <Icon name="arrow" size={12} />
              </a>
            )}
          </div>
        </section>
      </main>
      <footer className="shell">
        <span>
          <Icon name="pulse" size={16} />
          Repo Pulse
        </span>
        <span>Horários de São Paulo · UTC−03</span>
      </footer>
    </>
  );
}
