import Parse from "./parse.js";

/**
 * Deletes ALL rows from the Task and Application classes.
 * Tasks must be deleted first (they have a pointer to Application).
 *
 * Usage: import { clearDatabase } from "./services/clearDatabase.js";
 *        clearDatabase();
 */
export async function clearDatabase() {
  console.log("Clearing database...");

  // Delete all tasks first (they reference applications)
  const Task = Parse.Object.extend("Task");
  let taskQuery = new Parse.Query(Task);
  taskQuery.limit(1000);
  let tasks = await taskQuery.find();

  while (tasks.length > 0) {
    await Parse.Object.destroyAll(tasks);
    console.log(`  Deleted ${tasks.length} tasks`);
    taskQuery = new Parse.Query(Task);
    taskQuery.limit(1000);
    tasks = await taskQuery.find();
  }

  // Then delete all applications
  const Application = Parse.Object.extend("Application");
  let appQuery = new Parse.Query(Application);
  appQuery.limit(1000);
  let apps = await appQuery.find();

  while (apps.length > 0) {
    await Parse.Object.destroyAll(apps);
    console.log(`  Deleted ${apps.length} applications`);
    appQuery = new Parse.Query(Application);
    appQuery.limit(1000);
    apps = await appQuery.find();
  }

  console.log("Database cleared!");
}
