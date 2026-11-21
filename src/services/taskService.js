import Parse from "./parse.js";

/**
 * Default tasks assigned per application status.
 * When a status is set, all tasks from the status chain are considered.
 * Each task has a title and a taskType for categorization.
 */
const STATUS_TASKS = {
  saved: [
    { title: "Read job posting and research company", taskType: "research" },
    { title: "Tailor CV to position", taskType: "document" },
    { title: "Write cover letter", taskType: "document" },
    { title: "Application sent", taskType: "submit" },
  ],
  applied: [
    { title: "Send reminder", taskType: "custom" },
    { title: "Receive response", taskType: "custom" },
  ],
  interview: [
    { title: "Schedule interview", taskType: "custom" },
    { title: "Prepare for interview", taskType: "custom" },
  ],
  accepted: [
    { title: "Send follow-up email", taskType: "custom" },
  ],
  rejected: [
    { title: "Send follow-up email", taskType: "custom" },
    { title: "Ask for rejection reason", taskType: "custom" },
  ],
};

/**
 * Defines which statuses' tasks are cumulative.
 * For example, "interview" includes tasks from "saved", "applied", and "interview".
 * "rejected" branches off from "applied" (does not include "interview" tasks).
 */
const STATUS_CHAIN = {
  saved: ["saved"],
  applied: ["saved", "applied"],
  interview: ["saved", "applied", "interview"],
  accepted: ["saved", "applied", "interview", "accepted"],
  rejected: ["saved", "applied", "rejected"],
  closed: ["saved"],
};

/**
 * Add default tasks for a given status, skipping duplicates.
 * Uses the STATUS_CHAIN to determine which cumulative tasks should exist,
 * then compares against existing task titles using a Set for O(1) lookups.
 *
 * @param {string} applicationId - Parse object ID of the application
 * @param {string} status - The new status to add tasks for
 */
export async function addDefaultTasksForStatus(applicationId, status) {
  const chain = STATUS_CHAIN[status] || ["saved"];

  const requiredTasks = [];
  for (const s of chain) {
    const tasks = STATUS_TASKS[s] || [];
    for (const t of tasks) {
      requiredTasks.push(t);
    }
  }

  const existing = await getTasksByApplication(applicationId);
  const existingTitles = new Set(existing.map((t) => t.title));

  let nextNumber = existing.length > 0
    ? Math.max(...existing.map((t) => t.taskNumber)) + 1
    : 1;

  for (const task of requiredTasks) {
    if (!existingTitles.has(task.title)) {
      await createTask({
        applicationId,
        taskNumber: nextNumber,
        title: task.title,
        taskType: task.taskType,
      });
      nextNumber++;
    }
  }
}

/**
 * Fetch all tasks for a given application, ordered by taskNumber.
 * Uses a Parse Pointer to query by the application relationship.
 * Maps Parse results to plain objects; uses ?? null for completedAt
 * because Parse returns undefined (not null) for unset fields.
 *
 * @param {string} applicationId - Parse object ID
 * @returns {Promise<Array<Object>>} Sorted array of task objects
 */
export async function getTasksByApplication(applicationId) {
  const Task = Parse.Object.extend("Task");
  const query = new Parse.Query(Task);

  const appPointer = Parse.Object.extend("Application")
    .createWithoutData(applicationId);
  query.equalTo("application", appPointer);
  query.ascending("taskNumber");

  const results = await query.find();

  return results.map((t) => ({
    id: t.id,
    taskNumber: t.get("taskNumber"),
    title: t.get("title"),
    taskType: t.get("taskType"),
    completedAt: t.get("completedAt") ?? null,
  }));
}

/**
 * Create a new task linked to an application via a Parse Pointer.
 *
 * @param {Object} data - Task data
 * @param {string} data.applicationId - Parent application's Parse ID
 * @param {number} data.taskNumber - Order number for sorting
 * @param {string} data.title - Task title
 * @param {string} [data.taskType="custom"] - Task category
 * @returns {Promise<Object>} The newly created task object
 */
export async function createTask(data) {
  const Task = Parse.Object.extend("Task");
  const task = new Task();

  const appPointer = Parse.Object.extend("Application")
    .createWithoutData(data.applicationId);
  task.set("application", appPointer);
  task.set("taskNumber", data.taskNumber);
  task.set("title", data.title);
  task.set("taskType", data.taskType || "custom");

  const saved = await task.save();

  return {
    id: saved.id,
    taskNumber: saved.get("taskNumber"),
    title: saved.get("title"),
    taskType: saved.get("taskType"),
    completedAt: saved.get("completedAt") ?? null,
  };
}

/**
 * Toggle a task's completion state.
 * If not completed: sets completedAt to current date.
 * If already completed: uses Parse unset() to clear completedAt.
 *
 * @param {string} taskId - Parse object ID of the task
 * @returns {Promise<Object>} Object with id and completedAt (Date or null)
 */
export async function toggleTaskComplete(taskId) {
  const Task = Parse.Object.extend("Task");
  const query = new Parse.Query(Task);
  const task = await query.get(taskId);

  if (task.get("completedAt") == null) {
    task.set("completedAt", new Date());
  } else {
    task.unset("completedAt");
  }

  await task.save();

  return {
    id: task.id,
    completedAt: task.get("completedAt") ?? null,
  };
}

/**
 * Permanently delete a task from the database.
 *
 * @param {string} taskId - Parse object ID of the task to delete
 */
export async function deleteTask(taskId) {
  const Task = Parse.Object.extend("Task");
  const query = new Parse.Query(Task);
  const task = await query.get(taskId);
  await task.destroy();
}
