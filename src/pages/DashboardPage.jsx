import { applications, tasks } from "../data/mockData.js";
import ApplicationCard from "../components/ApplicationCard.jsx";
import ReminderCard from "../components/ReminderCard.jsx";
import DetailPanel from "../components/DetailPanel.jsx";

export default function DashboardPage() {
  const openTasks = tasks.filter((task) => task.completedAt === null);

  // For now, show the first application in the detail panel
  const selectedApplication = applications[0];

  return (
    <div className="page-layout">
      <div className="header-band">
        <nav className="top-bar">
          <button className="btn btn-secondary">My lists ›</button>
          <button className="btn btn-secondary">Settings</button>
        </nav>
      </div>

      <div className="dashboard-container">
        <main className="dashboard">
          <div className="dashboard-header">
            <h2>All applications</h2>
            <button className="btn btn-primary btn-add">+ Add</button>
          </div>

          <h3>Reminders</h3>
          {openTasks.map((task) => (
            <ReminderCard key={`${task.applicationId}-${task.taskNumber}`} task={task} />
          ))}

          <h3>Applications</h3>
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </main>

        <DetailPanel application={selectedApplication} />
      </div>
    </div>
  );
}
