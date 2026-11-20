import { useState, useEffect } from "react";
import { getApplications } from "../services/applicationService.js";
import { getTasksByApplication } from "../services/taskService.js";
import ApplicationCard from "../components/ApplicationCard.jsx";
import ReminderCard from "../components/ReminderCard.jsx";
import DetailPanel from "../components/DetailPanel.jsx";

export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [openTasks, setOpenTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    async function loadData() {
      const apps = await getApplications();
      setApplications(apps);

      const allOpenTasks = [];
      for (const app of apps) {
        const tasks = await getTasksByApplication(app.id);
        const open = tasks
          .filter((t) => t.startingDate != null && t.completedAt == null)
          .map((t) => ({ ...t, companyName: app.companyName }));
        allOpenTasks.push(...open);
      }
      setOpenTasks(allOpenTasks);

      if (apps.length > 0) {
        const firstTasks = await getTasksByApplication(apps[0].id);
        setSelectedTasks(firstTasks);
      }
    }
    loadData();
  }, []);

  const selectedApplication = applications[0] || null;

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
            <ReminderCard key={`${task.id}`} task={task} />
          ))}

          <h3>Applications</h3>
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </main>

        <DetailPanel application={selectedApplication} tasks={selectedTasks} />
      </div>
    </div>
  );
}
