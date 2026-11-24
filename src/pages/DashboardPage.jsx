import { useState, useEffect } from "react";
import {
  getApplications,
  createApplication,
  updateApplication,
  updateApplicationStatus,
  deleteApplication,
} from "../services/applicationService.js";
import {
  createApplicationSentStep,
  updateTaskNumber,
  getTasksByApplication,
  createTask,
  toggleTaskComplete,
  deleteTask,
} from "../services/taskService.js";
import ApplicationCard from "../components/ApplicationCard.jsx";
import ReminderCard from "../components/ReminderCard.jsx";
import DetailPanel from "../components/DetailPanel.jsx";
import AddApplicationForm from "../components/AddApplicationForm.jsx";

/**
 * Main dashboard page — the single top-level page component.
 * Manages all application state using the Lifting State Up pattern:
 * state lives here and is passed down to child components via props,
 * while callbacks are passed for children to trigger state changes.
 *
 * Layout: left sidebar (application list + reminders) and right panel
 * (detail view or add/edit form). On mobile, only one panel is visible.
 */
export default function DashboardPage() {
  const [applications, setApplications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingApp, setEditingApp] = useState(null);

  /**
   * Collect the first incomplete task per application for the reminders list.
   * Iterates over all apps and queries their tasks to find the first
   * one without a completedAt date.
   *
   * @param {Array<Object>} apps - List of application objects
   */
  async function refreshReminders(apps) {
    const items = [];
    for (const app of apps) {
      const tasks = await getTasksByApplication(app.id);
      const next = tasks.find((t) => t.completedAt == null);
      if (next) {
        items.push({ ...next, companyName: app.companyName });
      }
    }
    setReminders(items);
  }

  /**
   * Reload the task list for the currently selected application.
   *
   * @param {string} appId - Parse object ID of the application
   */
  async function refreshSelectedTasks(appId) {
    const tasks = await getTasksByApplication(appId);
    setSelectedTasks(tasks);
  }

  /** Load all applications and reminders on initial mount */
  useEffect(() => {
    async function init() {
      try {
        const apps = await getApplications();
        setApplications(apps);
        await refreshReminders(apps);
        if (apps.length > 0) {
          setSelectedApp(apps[0]);
          await refreshSelectedTasks(apps[0].id);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    }
    init();
  }, []);

  /**
   * Select an application: close the add form, load its tasks,
   * and open the detail panel on mobile.
   *
   * @param {Object} app - The application object to select
   */
  async function handleSelectApp(app) {
    setShowAddForm(false);
    setSelectedApp(app);
    await refreshSelectedTasks(app.id);
    setMobileDetailOpen(true);
  }

  /**
   * Toggle a task's completion and handle the R3 requirement:
   * if "Application sent" is completed while status is "saved",
   * automatically change the status to "applied".
   *
   * @param {string} taskId - Parse object ID of the task to toggle
   */
  async function handleToggleTask(taskId) {
    try {
      const result = await toggleTaskComplete(taskId);
      if (selectedApp) {
        const task = selectedTasks.find((t) => t.id === taskId);
        if (
          task &&
          task.title === "Application sent" &&
          result.completedAt !== null &&
          selectedApp.status === "saved"
        ) {
          await handleStatusChange(selectedApp.id, "applied");
        }
        await refreshSelectedTasks(selectedApp.id);
        await refreshReminders(applications);
      }
    } catch (err) {
      console.error("Failed to toggle task:", err);
    }
  }

  /**
   * Add a new custom step to the selected application.
   * While "Application sent" is open, new steps go above it,
   * so it stays at the bottom. Once it is ticked, new steps go below it.
   *
   * @param {string} title - Title for the new step
   */
  async function handleAddTask(title) {
    try {
      const sentStep = selectedTasks.find((t) => t.taskType === "submit");
      const highest = selectedTasks.length > 0
        ? Math.max(...selectedTasks.map((t) => t.taskNumber))
        : 0;

      await createTask({
        applicationId: selectedApp.id,
        taskNumber: highest + 1,
        title,
        taskType: "custom",
      });

      if (sentStep && sentStep.completedAt == null) {
        await updateTaskNumber(sentStep.id, highest + 2);
      }

      await refreshSelectedTasks(selectedApp.id);
      await refreshReminders(applications);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  }

  /**
   * Change an application's status.
   * Updates both the database and local React state to keep the UI in sync.
   *
   * @param {string} applicationId - Parse object ID
   * @param {string} newStatus - The new status value
   */
  async function handleStatusChange(applicationId, newStatus) {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
      if (selectedApp?.id === applicationId) {
        setSelectedApp((prev) => ({ ...prev, status: newStatus }));
        await refreshSelectedTasks(applicationId);
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  }

  /**
   * Enter edit mode: store the application data and show the edit form.
   *
   * @param {Object} app - The application to edit
   */
  function handleEditClick(app) {
    setEditingApp(app);
    setShowAddForm(false);
    setMobileDetailOpen(true);
  }

  /**
   * Submit edited application data, refresh the list, and exit edit mode.
   *
   * @param {Object} data - Updated form data
   */
  async function handleEditSubmit(data) {
    try {
      await updateApplication(editingApp.id, data);
      const apps = await getApplications();
      setApplications(apps);
      await refreshReminders(apps);
      const updated = apps.find((a) => a.id === editingApp.id);
      setEditingApp(null);
      if (updated) {
        setSelectedApp(updated);
        await refreshSelectedTasks(updated.id);
      }
    } catch (err) {
      console.error("Failed to update application:", err);
    }
  }

  /** Cancel editing and return to the detail view */
  function handleEditCancel() {
    setEditingApp(null);
  }

  /**
   * Delete an application after user confirmation via window.confirm().
   * Also removes associated tasks (handled by applicationService).
   * After deletion, selects the first remaining application.
   *
   * @param {string} applicationId - Parse object ID to delete
   */
  async function handleDeleteApplication(applicationId) {
    if (!window.confirm("Are you sure you want to delete this application?")) return;
    try {
      await deleteApplication(applicationId);
      const apps = await getApplications();
      setApplications(apps);
      await refreshReminders(apps);
      if (selectedApp?.id === applicationId) {
        if (apps.length > 0) {
          setSelectedApp(apps[0]);
          await refreshSelectedTasks(apps[0].id);
        } else {
          setSelectedApp(null);
          setSelectedTasks([]);
        }
      }
      setMobileDetailOpen(false);
    } catch (err) {
      console.error("Failed to delete application:", err);
    }
  }

  /**
   * Delete a single task and refresh the task list and reminders.
   *
   * @param {string} taskId - Parse object ID of the task to delete
   */
  async function handleDeleteTask(taskId) {
    try {
      await deleteTask(taskId);
      if (selectedApp) {
        await refreshSelectedTasks(selectedApp.id);
        await refreshReminders(applications);
      }
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  }

  /** Mobile back button: close the detail panel and reset form state */
  function handleMobileBack() {
    setMobileDetailOpen(false);
    setShowAddForm(false);
    setEditingApp(null);
  }

  /** Open the "add application" form and show it on mobile */
  function handleAddClick() {
    setShowAddForm(true);
    setMobileDetailOpen(true);
  }

  /**
   * Submit a new application, give it the "Application sent" step,
   * refresh the list, and select the newly created application.
   *
   * @param {Object} data - Form data for the new application
   */
  async function handleFormSubmit(data) {
    try {
      const created = await createApplication(data);
      await createApplicationSentStep(created.id);
      const apps = await getApplications();
      setApplications(apps);
      await refreshReminders(apps);
      setShowAddForm(false);
      setMobileDetailOpen(false);
      const newApp = apps.find((a) => a.id === created.id) || apps[0];
      if (newApp) {
        setSelectedApp(newApp);
        await refreshSelectedTasks(newApp.id);
      }
    } catch (err) {
      console.error("Failed to create application:", err);
    }
  }

  /** Cancel the add form and close it on mobile */
  function handleFormCancel() {
    setShowAddForm(false);
    setMobileDetailOpen(false);
  }

  // Decide what to show in the right panel based on current mode
  let rightPanel;
  if (showAddForm) {
    rightPanel = (
      <AddApplicationForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        onBack={handleMobileBack}
      />
    );
  } else if (editingApp) {
    rightPanel = (
      <AddApplicationForm
        initialData={editingApp}
        onSubmit={handleEditSubmit}
        onCancel={handleEditCancel}
        onBack={handleMobileBack}
      />
    );
  } else {
    rightPanel = (
      <DetailPanel
        application={selectedApp}
        tasks={selectedTasks}
        onToggleTask={handleToggleTask}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onStatusChange={handleStatusChange}
        onEdit={handleEditClick}
        onDeleteApplication={handleDeleteApplication}
        onBack={handleMobileBack}
      />
    );
  }

  return (
    <div className={`page-layout${mobileDetailOpen ? " mobile-detail-open" : ""}`}>
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
            <button className="btn btn-primary btn-add" onClick={handleAddClick}>+ Add</button>
          </div>
          <h3>Reminders</h3>
          {reminders.length === 0 ? (
            <p className="detail-muted">No open tasks</p>
          ) : (
            reminders.map((task) => (
              <ReminderCard key={task.id} task={task} />
            ))
          )}
          <h3>Applications</h3>
          {applications.map((app) => (
            <ApplicationCard
              key={app.id}
              application={app}
              isSelected={selectedApp?.id === app.id}
              onSelect={handleSelectApp}
            />
          ))}
        </main>
        {rightPanel}
      </div>
    </div>
  );
}
