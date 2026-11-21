import Parse from "./parse.js";

/**
 * Fetch all job applications, ordered by most recently created.
 * Maps Parse objects to plain JS objects for use in React state.
 *
 * @returns {Promise<Array<Object>>} Array of application objects
 */
export async function getApplications() {
  const Application = Parse.Object.extend("Application");
  const query = new Parse.Query(Application);

  query.descending("createdAt");

  const results = await query.find();

  return results.map((app) => ({
    id: app.id,
    companyName: app.get("companyName"),
    jobTitle: app.get("jobTitle"),
    url: app.get("url"),
    postingText: app.get("postingText"),
    deadline: app.get("deadline"),
    status: app.get("status"),
    notes: app.get("notes"),
    followUpDate: app.get("followUpDate"),
  }));
}

/**
 * Create a new application with status "saved".
 * Only companyName is required; other fields default to empty strings.
 *
 * @param {Object} data - Application data from the form
 * @param {string} data.companyName - Company name (required)
 * @param {string} [data.jobTitle] - Job title
 * @param {string} [data.url] - Job posting URL
 * @returns {Promise<Object>} The newly created application object
 */
export async function createApplication(data) {
  const Application = Parse.Object.extend("Application");
  const application = new Application();

  application.set("companyName", data.companyName);
  application.set("jobTitle", data.jobTitle || "");
  application.set("url", data.url || "");
  application.set("status", "saved");

  const result = await application.save();

  return {
    id: result.id,
    companyName: result.get("companyName"),
    jobTitle: result.get("jobTitle"),
    url: result.get("url"),
    postingText: result.get("postingText"),
    deadline: result.get("deadline"),
    status: result.get("status"),
    notes: result.get("notes"),
    followUpDate: result.get("followUpDate"),
  };
}

/**
 * Update only the status field of an application.
 * Used when changing status via the dropdown in DetailPanel.
 *
 * @param {string} applicationId - Parse object ID
 * @param {string} newStatus - New status value (e.g. "applied", "interview")
 * @returns {Promise<Object>} Object with id and updated status
 */
export async function updateApplicationStatus(applicationId, newStatus) {
  const Application = Parse.Object.extend("Application");
  const query = new Parse.Query(Application);

  const application = await query.get(applicationId);
  application.set("status", newStatus);

  await application.save();

  return {
    id: application.id,
    status: application.get("status"),
  };
}

/**
 * Update multiple fields of an existing application.
 * Uses Parse unset() for clearing the deadline field,
 * since Parse stores undefined (not null) for missing fields.
 *
 * @param {string} applicationId - Parse object ID
 * @param {Object} data - Fields to update
 * @returns {Promise<Object>} The fully updated application object
 */
export async function updateApplication(applicationId, data) {
  const Application = Parse.Object.extend("Application");
  const query = new Parse.Query(Application);

  const application = await query.get(applicationId);

  if (data.companyName !== undefined) application.set("companyName", data.companyName);
  if (data.jobTitle !== undefined) application.set("jobTitle", data.jobTitle);
  if (data.url !== undefined) application.set("url", data.url);
  if (data.notes !== undefined) application.set("notes", data.notes);

  if (data.deadline !== undefined) {
    if (data.deadline) {
      application.set("deadline", data.deadline);
    } else {
      application.unset("deadline");
    }
  }

  await application.save();

  return {
    id: application.id,
    companyName: application.get("companyName"),
    jobTitle: application.get("jobTitle"),
    url: application.get("url"),
    postingText: application.get("postingText"),
    deadline: application.get("deadline"),
    status: application.get("status"),
    notes: application.get("notes"),
    followUpDate: application.get("followUpDate"),
  };
}

/**
 * Delete an application and all its associated tasks.
 * Uses Parse.Object.destroyAll() for batch task deletion,
 * then destroys the application itself.
 *
 * @param {string} applicationId - Parse object ID of the application to delete
 */
export async function deleteApplication(applicationId) {
  const Task = Parse.Object.extend("Task");
  const taskQuery = new Parse.Query(Task);
  const appPointer = Parse.Object.extend("Application").createWithoutData(applicationId);
  taskQuery.equalTo("application", appPointer);
  const tasks = await taskQuery.find();
  await Parse.Object.destroyAll(tasks);

  const Application = Parse.Object.extend("Application");
  const query = new Parse.Query(Application);
  const application = await query.get(applicationId);
  await application.destroy();
}
