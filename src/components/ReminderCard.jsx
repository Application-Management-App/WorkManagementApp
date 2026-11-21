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
