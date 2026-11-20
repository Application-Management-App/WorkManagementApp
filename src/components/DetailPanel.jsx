const STATUSES = ["saved", "applied", "interview", "accepted", "rejected", "closed"];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

export default function DetailPanel({ application, tasks = [] }) {
  if (!application) return null;

  return (
    <aside className="detail-panel">
      <div className="detail-header">
        <div>
          <h2>{application.companyName}</h2>
          <p className="detail-muted">{application.jobTitle}</p>
        </div>
        <button className="btn btn-secondary btn-sm">Edit</button>
      </div>

      <div className="detail-selectors">
        <div className="detail-select-group">
          <label>Status</label>
          <select className="detail-select" defaultValue={application.status}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="detail-section-title">Details</h3>
      <dl className="detail-list">
        {application.deadline && (
          <>
            <dt>Deadline</dt>
            <dd>{formatDate(application.deadline)}</dd>
          </>
        )}
        {application.url && (
          <>
            <dt>Posting</dt>
            <dd>
              <a
                href={application.url}
                className="detail-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {application.url.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </>
        )}
        {application.notes && (
          <>
            <dt>Notes</dt>
            <dd>{application.notes}</dd>
          </>
        )}
      </dl>

      <h3 className="detail-section-title">Steps</h3>
      <ul className="step-list">
        {tasks.map((task) => {
          const isSubmit = task.taskType === "submit";
          return (
            <li key={task.id} className="step-item">
              <span
                className={`step-check${task.completedAt ? " step-done" : ""}`}
              >
                {task.completedAt ? "✓" : ""}
              </span>
              <span
                className={`step-text${task.completedAt ? " step-text-done" : ""}`}
              >
                {task.title}
              </span>
              <span className="step-meta">
                {task.completedAt
                  ? formatDate(task.completedAt)
                  : isSubmit
                    ? "always here"
                    : ""}
              </span>
              {task.completedAt && !isSubmit && (
                <button className="ghost-btn ghost-btn--delete">×</button>
              )}
            </li>
          );
        })}
      </ul>
      <button className="ghost-btn">+ Add step</button>

      {application.postingText && (
        <>
          <h3 className="detail-section-title">Job posting</h3>
          <p className="posting-text">{application.postingText}</p>
          <button className="ghost-btn ghost-btn--accent">
            Show full text ›
          </button>
        </>
      )}
    </aside>
  );
}
