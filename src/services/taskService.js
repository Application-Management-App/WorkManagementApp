import Parse from "./parse.js";

/**
 * Create the "Application sent" step that every application gets automatically.
 *
 * @param {string} applicationId - Parse object ID of the application
 * @returns {Promise<Object>} The created task object
 */
export async function createApplicationSentStep(applicationId) {
  return createTask({
    applicationId,
    taskNumber: 1,
    title: "Application sent",
    taskType: "submit",
  });
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

/**
 * Change the position number of a task.
 *
 * @param {string} taskId - Parse object ID of the task
 * @param {number} taskNumber - New position number
 */
export async function updateTaskNumber(taskId, taskNumber) {
  const Task = Parse.Object.extend("Task");
  const query = new Parse.Query(Task);
  const task = await query.get(taskId);
  task.set("taskNumber", taskNumber);
  await task.save();
}
