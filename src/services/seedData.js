import Parse from "./parse.js";

/**
 * Seeds the database with 6 real Copenhagen student job applications
 * and their associated tasks. Run once to populate the dashboard.
 *
 * Usage: import { seedDatabase } from "./seedData.js";
 *        seedDatabase();
 *
 * startingDate logic for default tasks:
 *   - First task starts immediately (when the application is created).
 *   - Each next task starts when the previous one is completed.
 *   - If the previous task is not completed, startingDate stays null.
 */

const DEFAULT_TASKS = [
  { title: "Read job posting and research company", taskType: "research" },
  { title: "Tailor CV to position", taskType: "document" },
  { title: "Write cover letter", taskType: "document" },
  { title: "Application sent", taskType: "submit" },
];

const seedApplications = [
  // ───── IT JOBS ─────
  {
    companyName: "Performativ",
    jobTitle: "Junior AI Agent Engineer",
    url: "https://thehub.io/jobs/performativ-junior-ai-agent-engineer",
    postingText:
      "Paid student job building AI agents. Part-time, ~10 hours/week, flexible around studies.",
    status: "applied",
    notes: "Looks very relevant for my studies. AI focus is a plus.",
    deadline: new Date("2026-12-15"),
    followUpDate: new Date("2026-12-01"),
    tasks: [
      { ...DEFAULT_TASKS[0], startingDate: new Date("2026-11-06"), completedAt: new Date("2026-11-08") },
      { ...DEFAULT_TASKS[1], startingDate: new Date("2026-11-08"), completedAt: new Date("2026-11-10") },
      { ...DEFAULT_TASKS[2], startingDate: new Date("2026-11-10"), completedAt: new Date("2026-11-12") },
      { ...DEFAULT_TASKS[3], startingDate: new Date("2026-11-12"), completedAt: new Date("2026-11-13") },
      {
        title: "Prepare for technical interview",
        taskType: "custom",
        startingDate: new Date("2026-11-13"),
        completedAt: null,
      },
    ],
  },
  {
    companyName: "Queue-it",
    jobTitle: "IT Student for Product Technology",
    url: "https://studentconsulting.com/job-openings/queue-it/85969",
    postingText:
      "Full-stack student position working with C# in an innovative environment. 15-20 hrs/week.",
    status: "saved",
    notes: "C# required — need to check if my skills are sufficient.",
    deadline: null,
    followUpDate: null,
    tasks: [
      { ...DEFAULT_TASKS[0], startingDate: new Date("2026-11-18"), completedAt: null },
      { ...DEFAULT_TASKS[1], startingDate: null, completedAt: null },
      { ...DEFAULT_TASKS[2], startingDate: null, completedAt: null },
      { ...DEFAULT_TASKS[3], startingDate: null, completedAt: null },
    ],
  },
  {
    companyName: "Copenhagen Optimization",
    jobTitle: "IT Support Assistant",
    url: "https://copenhagenoptimization.teamtailor.com/jobs/6076811",
    postingText:
      "Tech-savvy student needed for IT support: installing software, setting up new computers, troubleshooting.",
    status: "interview",
    notes:
      "Interview scheduled for next week. Prepare examples of past IT support experience.",
    deadline: new Date("2026-11-30"),
    followUpDate: new Date("2026-11-25"),
    tasks: [
      { ...DEFAULT_TASKS[0], startingDate: new Date("2026-11-01"), completedAt: new Date("2026-11-03") },
      { ...DEFAULT_TASKS[1], startingDate: new Date("2026-11-03"), completedAt: new Date("2026-11-05") },
      { ...DEFAULT_TASKS[2], startingDate: new Date("2026-11-05"), completedAt: new Date("2026-11-06") },
      { ...DEFAULT_TASKS[3], startingDate: new Date("2026-11-06"), completedAt: new Date("2026-11-07") },
      {
        title: "Prepare for interview",
        taskType: "custom",
        startingDate: new Date("2026-11-07"),
        completedAt: null,
      },
    ],
  },

  // ───── NON-IT JOBS (restaurant / retail / hospitality) ─────
  {
    companyName: "Joe & The Juice",
    jobTitle: "Juicer (Part-time)",
    url: "https://www.joejuice.com/careers",
    postingText:
      "Join our team as a Juicer! Prepare juices, sandwiches and coffee in a fast-paced environment. Flexible shifts around your studies.",
    status: "rejected",
    notes:
      "Got a rejection email — they wanted someone with barista experience.",
    deadline: new Date("2026-11-01"),
    followUpDate: null,
    tasks: [
      { ...DEFAULT_TASKS[0], startingDate: new Date("2026-10-16"), completedAt: new Date("2026-10-18") },
      { ...DEFAULT_TASKS[1], startingDate: new Date("2026-10-18"), completedAt: new Date("2026-10-20") },
      { ...DEFAULT_TASKS[2], startingDate: new Date("2026-10-20"), completedAt: new Date("2026-10-21") },
      { ...DEFAULT_TASKS[3], startingDate: new Date("2026-10-21"), completedAt: new Date("2026-10-22") },
    ],
  },
  {
    companyName: "Flying Tiger Copenhagen",
    jobTitle: "Sales Assistant",
    url: "https://flyingtiger.com/careers",
    postingText:
      "Part-time sales assistant in our Strøget store. Customer service, stocking shelves, and cash register. 10-15 hrs/week.",
    status: "applied",
    notes: "Applied last week, waiting to hear back.",
    deadline: new Date("2026-12-01"),
    followUpDate: new Date("2026-11-28"),
    tasks: [
      { ...DEFAULT_TASKS[0], startingDate: new Date("2026-11-10"), completedAt: new Date("2026-11-12") },
      { ...DEFAULT_TASKS[1], startingDate: new Date("2026-11-12"), completedAt: new Date("2026-11-14") },
      { ...DEFAULT_TASKS[2], startingDate: new Date("2026-11-14"), completedAt: new Date("2026-11-15") },
      { ...DEFAULT_TASKS[3], startingDate: new Date("2026-11-15"), completedAt: new Date("2026-11-16") },
    ],
  },
  {
    companyName: "CABINN Copenhagen",
    jobTitle: "Night Receptionist (Part-time)",
    url: "https://www.cabinn.com/careers",
    postingText:
      "Part-time night receptionist at Kalvebod Brygge hotel. 3 shifts per week including every second weekend, 22.5 hrs/week.",
    status: "saved",
    notes: "",
    deadline: new Date("2026-12-20"),
    followUpDate: null,
    tasks: [
      { ...DEFAULT_TASKS[0], startingDate: new Date("2026-11-19"), completedAt: null },
      { ...DEFAULT_TASKS[1], startingDate: null, completedAt: null },
      { ...DEFAULT_TASKS[2], startingDate: null, completedAt: null },
      { ...DEFAULT_TASKS[3], startingDate: null, completedAt: null },
    ],
  },
];

export async function seedDatabase() {
  console.log("Starting database seed...");

  for (const appData of seedApplications) {
    try {
      const Application = Parse.Object.extend("Application");
      const application = new Application();

      application.set("companyName", appData.companyName);
      application.set("jobTitle", appData.jobTitle);
      application.set("url", appData.url);
      application.set("postingText", appData.postingText);
      application.set("status", appData.status);
      application.set("notes", appData.notes);
      application.set("deadline", appData.deadline);
      application.set("followUpDate", appData.followUpDate);

      const savedApp = await application.save();
      console.log(
        `Created application: ${appData.companyName} — ${appData.jobTitle}`
      );

      let taskNumber = 1;
      for (const taskData of appData.tasks) {
        const Task = Parse.Object.extend("Task");
        const task = new Task();

        task.set("application", savedApp);
        task.set("taskNumber", taskNumber);
        task.set("title", taskData.title);
        task.set("description", "");
        task.set("taskType", taskData.taskType);
        task.set("startingDate", taskData.startingDate);
        task.set("completedAt", taskData.completedAt);

        await task.save();
        console.log(`  — Task ${taskNumber}: ${taskData.title}`);
        taskNumber++;
      }
    } catch (error) {
      console.error(
        `Failed to seed ${appData.companyName}:`,
        error.message
      );
    }
  }

  console.log("Database seed complete!");
}
