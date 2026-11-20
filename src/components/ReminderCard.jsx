import { applications, getCompanyName } from "../data/mockData.js";

export default function ReminderCard({ task }) {
  const application = applications.find((app) => app.id === task.applicationId);
  const companyName = application ? getCompanyName(application.companyId) : "Unknown";

  return (
    <div className="card card-reminder">
      <p><strong>{companyName}</strong> — {task.title}</p>
      <span className="arrow">›</span>
    </div>
  );
}
