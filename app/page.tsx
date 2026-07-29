import snapshotsData from "../public/data/snapshots.json";

type Snapshot = {
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

const timeZone = "America/Sao_Paulo";
const expectedHours = [14, 15, 16, 17, 18, 19, 20, 21];
const snapshots = [...(snapshotsData as Snapshot[])].sort((a, b) =>
  a.collectedAt.localeCompare(b.collectedAt),
);
const latest = snapshots.at(-1);
const previous = snapshots.at(-2);
const repository =
  latest?.repository ?? process.env.GITHUB_REPOSITORY ?? "repo-pulse";
const repositoryUrl = repository.includes("/")
  ? `https://github.com/${repository}`
  : null;

const localDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function localDate(value: string) {
  return localDateFormatter.format(new Date(value));
}

function localHour(value: string) {
  return Number(
    new Intl.DateTimeFormat("pt-BR", {
      timeZone,
      hour: "2-digit",
      hour12: false,
    }).format(new Date(value)),
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone,
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatNumber(value: number | undefined) {
  return value === undefined ? "—" : new Intl.NumberFormat("pt-BR").format(value);
}

function delta(current: number | undefined, before: number | undefined) {
  if (current === undefined || before === undefined) return null;
  return current - before;
}

const referenceDay = latest ? localDate(latest.collectedAt) : localDate(new Date().toISOString());
const daySnapshots = snapshots.filter(
  (snapshot) => localDate(snapshot.collectedAt) === referenceDay,
);
const recentSnapshots = snapshots.slice(-10).reverse();

const metrics = [
  {
    label: "Estrelas",
    value: latest?.stars,
    change: delta(latest?.stars, previous?.stars),
  },
  {
    label: "Forks",
    value: latest?.forks,
    change: delta(latest?.forks, previous?.forks),
  },
  {
    label: "Itens abertos",
    value: latest?.openItems,
    change: delta(latest?.openItems, previous?.openItems),
  },
  {
    label: "Observadores",
    value: latest?.subscribers,
    change: delta(latest?.subscribers, previous?.subscribers),
  },
];

export default function Home() {
  return (
    <main>
      <header className="site-header shell">
        <div className="brand" aria-label="Repo Pulse">
          <span className="brand-mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>repo pulse</span>
        </div>
        {repositoryUrl ? (
          <a className="repository-link" href={repositoryUrl}>
            Ver repositório <span aria-hidden="true">↗</span>
          </a>
        ) : (
          <span className="repository-pending">Vínculo após a publicação</span>
        )}
      </header>

      <section className="hero shell">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="live-dot" aria-hidden="true" />
            monitoramento automático e transparente
          </div>
          <h1>
            Pulso do repositório,
            <span> sem ruído.</span>
          </h1>
          <p>
            Oito fotografias diárias da atividade real deste projeto, coletadas
            entre 14h e 21h no horário de São Paulo.
          </p>
        </div>

        <div className="hero-status">
          <span className="status-label">Última leitura</span>
          <strong>{latest ? formatDate(latest.collectedAt) : "Aguardando coleta"}</strong>
          <span className="status-repository">{repository}</span>
          <div className="pulse-track" aria-hidden="true">
            <span />
          </div>
        </div>
      </section>

      <section className="metrics shell" aria-labelledby="metrics-title">
        <div className="section-heading">
          <div>
            <span className="section-index">01</span>
            <h2 id="metrics-title">Estado atual</h2>
          </div>
          <span>Fonte: API do GitHub</span>
        </div>

        <div className="metric-grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <span>{metric.label}</span>
              <strong>{formatNumber(metric.value)}</strong>
              <small className={metric.change && metric.change !== 0 ? "changed" : "stable"}>
                {metric.change === null
                  ? "sem histórico"
                  : metric.change === 0
                    ? "sem mudança"
                    : `${metric.change > 0 ? "+" : ""}${metric.change} desde a última leitura`}
              </small>
            </article>
          ))}
        </div>
      </section>

      <section className="activity shell" aria-labelledby="activity-title">
        <div className="section-heading">
          <div>
            <span className="section-index">02</span>
            <h2 id="activity-title">Janela diária</h2>
          </div>
          <span>{referenceDay.split("-").reverse().join("/")}</span>
        </div>

        <div className="schedule-grid">
          {expectedHours.map((hour) => {
            const reading = daySnapshots.find(
              (snapshot) => localHour(snapshot.collectedAt) === hour,
            );
            return (
              <div className={`schedule-slot ${reading ? "complete" : "pending"}`} key={hour}>
                <span>{String(hour).padStart(2, "0")}:00</span>
                <i aria-hidden="true" />
                <small>{reading ? "coletado" : "aguardando"}</small>
              </div>
            );
          })}
        </div>
      </section>

      <section className="history shell" aria-labelledby="history-title">
        <div className="section-heading">
          <div>
            <span className="section-index">03</span>
            <h2 id="history-title">Leituras recentes</h2>
          </div>
          <span>{snapshots.length} registros preservados</span>
        </div>

        <div className="history-table" role="region" aria-label="Histórico de leituras" tabIndex={0}>
          <div className="history-row history-head">
            <span>Coletado em</span>
            <span>Branch</span>
            <span>SHA observado</span>
            <span>Tamanho</span>
            <span>Origem</span>
          </div>
          {recentSnapshots.length ? (
            recentSnapshots.map((snapshot) => (
              <div className="history-row" key={snapshot.collectedAt}>
                <span>{formatDate(snapshot.collectedAt)}</span>
                <span>{snapshot.defaultBranch}</span>
                <span className="mono">{snapshot.branchHead.slice(0, 7)}</span>
                <span>{formatNumber(snapshot.sizeKb)} KB</span>
                <span className="source-tag">automação [bot]</span>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <span>00</span>
              <p>A primeira leitura aparecerá após a automação ser executada.</p>
            </div>
          )}
        </div>
      </section>

      <section className="transparency shell" aria-labelledby="transparency-title">
        <div>
          <span className="section-index">POLÍTICA</span>
          <h2 id="transparency-title">O que cada commit significa</h2>
          <p>
            Cada alteração automática adiciona uma observação datada à série
            histórica. Não há commits vazios, autoria humana simulada ou mensagens
            que escondam a automação.
          </p>
        </div>
        <ul>
          <li><span>01</span> Dados obtidos pela API oficial do GitHub</li>
          <li><span>02</span> Autor identificado como github-actions[bot]</li>
          <li><span>03</span> Mensagens encerradas com o marcador [bot]</li>
        </ul>
      </section>

      <footer className="shell">
        <span>Repo Pulse</span>
        <p>Métricas reais. Automação transparente.</p>
        <span>{new Date().getUTCFullYear()}</span>
      </footer>
    </main>
  );
}
