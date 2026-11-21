import Parse from "./parse.js";

export async function getTasksByApplication(applicationId) {
  const Task = Parse.Object.extend("Task");
  const query = new Parse.Query(Task);

  const applicationPointer = Parse.Object.extend("Application").createWithoutData(applicationId);
  query.equalTo("application", applicationPointer);
  query.ascending("taskNumber");

  const results = await query.find();

  return results.map((task) => ({
    id: task.id,
    taskNumber: task.get("taskNumber"),
    title: task.get("title"),
    description: task.get("description"),
    taskType: task.get("taskType"),
    startingDate: task.get("startingDate"),
    completedAt: task.get("completedAt"),
  }));
}

export async function createTask(data) {
  const Task = Parse.Object.extend("Task");
  const task = new Task();

  const applicationPointer = Parse.Object.extend("Application").createWithoutData(data.applicationId);
  task.set("application", applicationPointer);
  task.set("taskNumber", data.taskNumber);
  task.set("title", data.title);
  task.set("description", data.description || "");
  task.set("taskType", data.taskType || "custom");
  task.set("startingDate", data.startingDate || null);
  task.set("completedAt", null);

  const result = await task.save();

  return {
    id: result.id,
    taskNumber: result.get("taskNumber"),
    title: result.get("title"),
    description: result.get("description"),
    taskType: result.get("taskType"),
    startingDate: result.get("startingDate"),
    completedAt: result.get("completedAt"),
  };
}

export async function toggleTaskComplete(taskId) {
  const Task = Parse.Object.extend("Task");
  const query = new Parse.Query(Task);

  const task = await query.get(taskId);

  if (task.get("completedAt") === null) {
    task.set("completedAt", new Date());
  } else {
    task.set("completedAt", null);
  }

  await task.save();

  return {
    id: task.id,
    completedAt: task.get("completedAt"),
  };
}