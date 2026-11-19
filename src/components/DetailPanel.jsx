import {
  getCompanyName,
  getListName,
  getTasksForApplication,
  contactPersons,
} from "../data/mockData.js";

const STATUSES = ["saved", "applied", "interview", "accepted", "rejected", "closed"];

const formatDate = (str) =>
  str ? new Date(str).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : null;

export default function DetailPanel({ application }) {
  if (!application) return null;

  const companyName = getCompanyName(application.companyId);
  const listName = getListName(application.listId);
  const appTasks = getTasksForApplication(application.id);
  const contact = contactPersons.find((cp) => cp.id === application.contactPersonId);

  return (
    <aside className="detail-panel">
      {/* Header */}
      <div className="detail-header">
        <div>
          <h2>{companyName}</h2>
          <p className="detail-muted">{application.jobTitle}</p>
        </div>
        <button className="btn btn-secondary btn-sm">Edit</button>
      </div>

      {/* Status + List selectors */}
      <div className="detail-selectors">
        <div className="detail-select-group">
          <label>Status</label>
          <select className="detail-select" defaultValue={application.status}>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="detail-select-group">
          <label>List</label>
          <select className="detail-select" defaultValue={listName}>
            <option>{listName}</option>
          </select>
        </div>
      </div>

      {/* Details */}
      <h3 className="detail-section-title">Details</h3>
      <dl className="detail-list">
        {application.deadline && (
          <><dt>Deadline</dt><dd>{formatDate(application.deadline)}</dd></>
        )}
        {application.url && (
          <><dt>Posting</dt>
          <dd><a href={application.url} className="detail-link" target="_blank" rel="noopener noreferrer">
            {application.url.replace(/^https?:\/\//, "")}
          </a></dd></>
        )}
        {contact && (
          <><dt>Contact</dt>
          <dd>
            {contact.name}
            {contact.email && <><br /><span className="detail-muted">{contact.email}</span></>}
            {contact.phone && <span className="detail-muted"> · {contact.phone}</span>}
          </dd></>
        )}
        {application.notes && (
          <><dt>Notes</dt><dd>{application.notes}</dd></>
        )}
      </dl>

      {/* Steps */}
      <h3 className="detail-section-title">Steps</h3>
      <ul className="step-list">
        {appTasks.map((task) => {
          const alwaysHere = task.taskType === "application_sent";
          return (
            <li key={`${task.applicationId}-${task.taskNumber}`} className="step-item">
              <span className={`step-check${task.completedAt ? " step-done" : ""}`}>
                {task.completedAt ? "✓" : ""}
              </span>
              <span className={`step-text${task.completedAt ? " step-text-done" : ""}`}>
                {task.title}
              </span>
              <span className="step-meta">
                {task.completedAt ? formatDate(task.completedAt) : alwaysHere ? "always here" : ""}
              </span>
              {task.completedAt && !alwaysHere && (
                <button className="ghost-btn ghost-btn--delete">×</button>
              )}
            </li>
          );
        })}
      </ul>

      <button className="ghost-btn">+ Add step</button>

      {/* Job posting */}
      {application.postingText && (
        <>
          <h3 className="detail-section-title">Job posting</h3>
          <p className="posting-text">{application.postingText}</p>
          <button className="ghost-btn ghost-btn--accent">Show full text ›</button>
        </>
      )}
    </aside>
  );
}
