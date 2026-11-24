import History from "../history";
import Icon from "../icons";
import PageHeading from "../page-heading";
import { readings } from "../dashboard-data";

export const metadata = { title: "Histórico de leituras — Repo Pulse" };

const rows = [...readings]
  .reverse()
  .map(({ collectedAt, branchHead, defaultBranch, repository, sizeKb }) => ({
    collectedAt,
    branchHead,
    defaultBranch,
    repository,
    sizeKb,
  }));

export default function HistoryPage() {
  return (
    <>
      <PageHeading
        title="Histórico de leituras"
        action={
          <a href="../data/snapshots.json" download="repo-pulse.json" className="quiet-button">
            <Icon name="download" /> Baixar JSON
          </a>
        }
      />
      <History rows={rows} />
    </>
  );
}
