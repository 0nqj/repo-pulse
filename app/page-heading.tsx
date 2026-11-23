import type { ReactNode } from "react";
import Icon from "./icons";
import { latest, name, owner, repoUrl } from "./dashboard-data";
import { localDate, localTime } from "./telemetry";

export default function PageHeading({ title, action }: { title: string; action?: ReactNode }) {
  const updated = latest ? new Date(latest.collectedAt) : null;
  return (
    <div className="overview">
      <div>
        <h1>{title}</h1>
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
      {action ?? (
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
      )}
    </div>
  );
}
