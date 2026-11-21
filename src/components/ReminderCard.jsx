/**
 * Card showing the next incomplete task for an application.
 * Displayed in the "Reminders" section of the dashboard
 * to give users a quick overview of pending actions.
 *
 * @param {Object} props
 * @param {Object} props.task - Task object with companyName and title
 */
export default function ReminderCard({ task }) {
  return (
    <div className="card card-reminder">
      <p>
        <strong>{task.companyName}</strong> — {task.title}
      </p>
      <span className="arrow">›</span>
    </div>
  );
}
