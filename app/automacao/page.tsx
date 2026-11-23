import Icon from "../icons";
import PageHeading from "../page-heading";
import { readings, referenceDay, repoUrl } from "../dashboard-data";
import { dayKey, formatDay, localTime } from "../telemetry";

export const metadata = { title: "Automação — Repo Pulse" };

const latestDay = readings.filter((reading) => dayKey(reading.collectedAt) === referenceDay);
const hours = Array.from({ length: 8 }, (_, i) => i + 14);

export default function AutomationPage() {
  return (
    <>
      <PageHeading title="Automação" />
      <section className="panel schedule-panel" aria-labelledby="schedule-title">
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
              Execuções da coleta <Icon name="arrow" size={12} />
            </a>
          )}
        </div>
      </section>
      <section className="panel schedule-panel" aria-labelledby="archive-title">
        <div className="panel-head">
          <h2 id="archive-title">
            <Icon name="branch" />
            Arquivo mensal
          </h2>
        </div>
        <p>
          Todos os dias às 22h17 de São Paulo, a automação registra o estado da <code>main</code> na
          branch <code>mensal/AAAA-MM</code>.
        </p>
        {repoUrl && (
          <div className="schedule-note">
            <a href={repoUrl + "/actions/workflows/archive-month.yml"}>
              Execuções do arquivo mensal <Icon name="arrow" size={12} />
            </a>
          </div>
        )}
      </section>
    </>
  );
}
