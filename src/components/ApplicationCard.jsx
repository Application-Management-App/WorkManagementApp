/**
 * Card component displaying a single application in the sidebar list.
 * Shows company name, job title, and a colour-coded status tag.
 * Highlights when selected via the card-selected CSS class.
 *
 * @param {Object} props
 * @param {Object} props.application - Application data object
 * @param {boolean} props.isSelected - Whether this card is currently active
 * @param {Function} props.onSelect - Callback when the card is clicked
 */
export default function ApplicationCard({ application, isSelected, onSelect }) {
  const statusClass = `status-${application.status.toLowerCase()}`;

  return (
    <div
      className={`card${isSelected ? " card-selected" : ""}`}
      onClick={() => onSelect(application)}
    >
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
