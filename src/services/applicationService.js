import Parse from "./parse.js";

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