import { useState } from "react";

/** All possible application statuses for the status dropdown */
const STATUSES = ["saved", "applied", "interview", "accepted", "rejected", "closed"];

/**
 * Format a date value to a readable string (e.g. "21 Nov 2026").
 * Returns null if no date is provided.
 *
 * @param {Date|string|null} d - Date to format
 * @returns {string|null} Formatted date string or null
 */
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

/**
 * Right-side panel showing full details of the selected application.
 * Displays: company info, status dropdown, details (deadline, URL, notes),
 * task checklist with add/delete/toggle, and edit/delete actions.
 *
 * Uses Lifting State Up — all data modifications call parent callbacks
 * rather than managing their own data fetching.
 *
 * @param {Object} props
 * @param {Object|null} props.application - Currently selected application
 * @param {Array<Object>} props.tasks - Tasks belonging to the selected application
 * @param {Function} props.onToggleTask - Toggle task completion (taskId)
 * @param {Function} props.onAddTask - Add a new custom task (title)
 * @param {Function} props.onDeleteTask - Delete a task (taskId)
 * @param {Function} props.onStatusChange - Change application status (appId, newStatus)
 * @param {Function} props.onEdit - Enter edit mode for this application
 * @param {Function} props.onDeleteApplication - Delete this application (appId)
 * @param {Function} [props.onBack] - Mobile back button handler
 */
export default function DetailPanel({
  application,
  tasks = [],
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onStatusChange,
  onEdit,
  onDeleteApplication,
  onBack,
}) {
  const [newStepTitle, setNewStepTitle] = useState("");
  const [showAddStep, setShowAddStep] = useState(false);

  if (!application) return null;

  /** Validate and submit a new custom task, then reset the input */
  function handleAddStep() {
    if (newStepTitle.trim() === "") return;
    onAddTask(newStepTitle.trim());
    setNewStepTitle("");
    setShowAddStep(false);
  }

  /** Pass the new status value to the parent callback */
  function handleStatusChange(e) {
    onStatusChange(application.id, e.target.value);
  }

  return (
    <aside className="detail-panel">
      {onBack && (
        <button className="ghost-btn detail-back" onClick={onBack}>
          ‹ All applications
        </button>
      )}

      <div className="detail-header">
        <div>
          <h2>{application.companyName}</h2>
          <p className="detail-muted">{application.jobTitle}</p>
        </div>
        <div className="detail-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => onEdit(application)}>Edit</button>
          <button className="btn btn-danger btn-sm" onClick={() => onDeleteApplication(application.id)}>Delete</button>
        </div>
      </div>

      <div className="detail-selectors">
        <div className="detail-select-group">
          <label>Status</label>
          <select
            className="detail-select"
            value={application.status}
            onChange={handleStatusChange}
          >
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
                onClick={() => onToggleTask(task.id)}
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
              {!isSubmit && (
                <button
                  className="ghost-btn ghost-btn--delete"
                  onClick={() => onDeleteTask(task.id)}
                  title="Delete step"
                >
                  ×
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {showAddStep ? (
        <div className="add-step-form">
          <input
            type="text"
            className="add-step-input"
            placeholder="Step title..."
            value={newStepTitle}
            onChange={(e) => setNewStepTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddStep()}
            autoFocus
          />
          <button className="btn btn-primary btn-sm" onClick={handleAddStep}>
            Add
          </button>
          <button
            className="ghost-btn"
            onClick={() => {
              setShowAddStep(false);
              setNewStepTitle("");
            }}
          >
            Cancel
          </button>
        </div>
      ) : (
        <button className="ghost-btn" onClick={() => setShowAddStep(true)}>
          + Add step
        </button>
      )}

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
