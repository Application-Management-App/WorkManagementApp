export default function ApplicationCard({ application }) {
  const statusClass = `status-${application.status.toLowerCase()}`;

  return (
    <div className="card">
      <div>
        <h4>{application.companyName}</h4>
        <p>{application.jobTitle}</p>
      </div>
      <div className="card-right">
        <span className={`status-tag ${statusClass}`}>{application.status}</span>
        <span className="arrow">›</span>
      </div>
    </div>
  );
}
