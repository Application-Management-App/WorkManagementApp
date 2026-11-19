import { getCompanyName, getListName } from "../data/mockData.js";

export default function ApplicationCard({ application }) {
  const statusClass = `status-${application.status.toLowerCase()}`;

  return (
    <div className="card">
      <div>
        <h4>{getCompanyName(application.companyId)}</h4>
        <p>{application.jobTitle} · {getListName(application.listId)}</p>
      </div>
      <div className="card-right">
        <span className={`status-tag ${statusClass}`}>{application.status}</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}
