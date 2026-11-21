import { useState } from "react";

/**
 * Form component for creating or editing a job application.
 * Used in two modes:
 *   - New mode: all fields start empty (no initialData prop)
 *   - Edit mode: fields are pre-filled from initialData prop
 *
 * Uses controlled inputs — each field's value is managed by React state.
 *
 * @param {Object} props
 * @param {Object} [props.initialData] - Pre-fill data for edit mode
 * @param {Function} props.onSubmit - Called with form data on submission
 * @param {Function} props.onCancel - Called when the user cancels
 * @param {Function} [props.onBack] - Mobile back button handler
 */
export default function AddApplicationForm({ initialData, onSubmit, onCancel, onBack }) {
  const isEditing = Boolean(initialData);

  const [companyName, setCompanyName] = useState(initialData?.companyName || "");
  const [jobTitle, setJobTitle] = useState(initialData?.jobTitle || "");
  const [url, setUrl] = useState(initialData?.url || "");
  const [deadline, setDeadline] = useState(
    initialData?.deadline
      ? new Date(initialData.deadline).toISOString().split("T")[0]
      : ""
  );
  const [notes, setNotes] = useState(initialData?.notes || "");

  /** Validates required fields and calls onSubmit with trimmed data */
  function handleSubmit(e) {
    e.preventDefault();

    if (companyName.trim() === "") return;

    onSubmit({
      companyName: companyName.trim(),
      jobTitle: jobTitle.trim(),
      url: url.trim(),
      deadline: deadline || null,
      notes: notes.trim(),
    });
  }

  return (
    <aside className="detail-panel">
      {onBack && (
        <button className="ghost-btn detail-back" onClick={onBack}>
          ‹ All applications
        </button>
      )}

      <div className="detail-header">
        <h2>{isEditing ? "Edit application" : "New application"}</h2>
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <form className="add-app-form" onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="companyName">Company *</label>
          <input
            id="companyName"
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="e.g. Google"
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="jobTitle">Job title</label>
          <input
            id="jobTitle"
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="e.g. Frontend Developer"
          />
        </div>

        <div className="form-field">
          <label htmlFor="url">Job posting URL</label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="form-field">
          <label htmlFor="deadline">Deadline</label>
          <input
            id="deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="form-field">
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any notes about this application..."
            rows={3}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          {isEditing ? "Save changes" : "Save application"}
        </button>
      </form>
    </aside>
  );
}
