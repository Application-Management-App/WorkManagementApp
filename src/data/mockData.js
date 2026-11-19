// Mock data based on the ER diagram and Hand-in 2 requirements.
// Replace with Parse backend calls once the service layer is connected.
// 
// ---> RIGHT NOW MADE WITH AI SINCE WE WILL REPLACE IT WITH BACK-END AND ACTUAL DATA <---

export const currentUser = {
  id: "user1",
  name: "Kaj",
  email: "kaj@example.com",
  deadlineReminderDays: 7,
  followupAfterDeadlineDays: 14,
  followupAfterSendingDays: 42,
};

export const companies = [
  { id: "comp1", name: "Café Nord" },
  { id: "comp2", name: "TechFlow ApS" },
  { id: "comp3", name: "GreenBuild Denmark" },
  { id: "comp4", name: "Nordic Design Studio" },
];

export const contactPersons = [
  {
    id: "cp1",
    companyId: "comp1",
    name: "Mads Holm",
    email: "mads@cafenord.dk",
    phone: "20 30 40 50",
  },
  {
    id: "cp2",
    companyId: "comp2",
    name: "Sara Jensen",
    email: "sara@techflow.dk",
    phone: "+45 12 34 56 78",
  },
  {
    id: "cp3",
    companyId: "comp4",
    name: "Mikkel Holm",
    email: "mikkel@nordicdesign.dk",
    phone: null,
  },
];

export const lists = [
  { id: "list1", name: "Unsorted", ownerId: "user1" },
  { id: "list2", name: "Top picks", ownerId: "user1" },
  { id: "list3", name: "Part-time", ownerId: "user1" },
  { id: "list4", name: "Café jobs", ownerId: "user1" },
];

export const applications = [
  {
    id: "app1",
    userId: "user1",
    companyId: "comp1",
    contactPersonId: "cp1",
    jobTitle: "Barista",
    url: "https://cafenord.dk/jobs/barista",
    postingText:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    deadline: "2026-10-30",
    status: "saved",
    notes: "Talked to Mads at the counter, friendly team",
    followUpDate: null,
    listId: "list4",
  },
  {
    id: "app2",
    userId: "user1",
    companyId: "comp2",
    contactPersonId: "cp2",
    jobTitle: "Frontend Developer Intern",
    url: "https://techflow.dk/careers/frontend-intern",
    postingText: null,
    deadline: "2026-12-01",
    status: "applied",
    notes: "Sara said they review applications in January",
    followUpDate: "2026-12-15",
    listId: "list2",
  },
  {
    id: "app3",
    userId: "user1",
    companyId: "comp3",
    contactPersonId: null,
    jobTitle: "Sustainability Analyst",
    url: "https://greenbuild.dk/jobs/analyst",
    postingText: null,
    deadline: "2026-11-25",
    status: "interview",
    notes: "Interview scheduled for Nov 28",
    followUpDate: null,
    listId: "list2",
  },
  {
    id: "app4",
    userId: "user1",
    companyId: "comp4",
    contactPersonId: "cp3",
    jobTitle: "UX Designer",
    url: null,
    postingText: null,
    deadline: "2026-11-20",
    status: "saved",
    notes: null,
    followUpDate: null,
    listId: "list3",
  },
  {
    id: "app5",
    userId: "user1",
    companyId: "comp1",
    contactPersonId: null,
    jobTitle: "Shift Manager",
    url: null,
    postingText: null,
    deadline: null,
    status: "rejected",
    notes: "They went with someone with more experience",
    followUpDate: null,
    listId: "list1",
  },
];

export const tasks = [
  // app1: Café Nord Barista — matches wireframe steps
  {
    applicationId: "app1",
    taskNumber: 1,
    title: "Tailor CV",
    taskType: "custom",
    completedAt: "2026-10-14T10:00:00",
  },
  {
    applicationId: "app1",
    taskNumber: 2,
    title: "Write cover letter",
    taskType: "custom",
    completedAt: null,
  },
  {
    applicationId: "app1",
    taskNumber: 3,
    title: "Application sent",
    taskType: "application_sent",
    completedAt: null,
  },

  // app2: TechFlow Frontend Intern (applied)
  {
    applicationId: "app2",
    taskNumber: 1,
    title: "Write cover letter",
    taskType: "custom",
    completedAt: "2026-11-10T14:30:00",
  },
  {
    applicationId: "app2",
    taskNumber: 2,
    title: "Update portfolio",
    taskType: "custom",
    completedAt: "2026-11-12T09:00:00",
  },
  {
    applicationId: "app2",
    taskNumber: 3,
    title: "Application sent",
    taskType: "application_sent",
    completedAt: "2026-11-14T16:00:00",
  },

  // app3: GreenBuild Analyst (interview)
  {
    applicationId: "app3",
    taskNumber: 1,
    title: "Tailor CV",
    taskType: "custom",
    completedAt: "2026-11-05T11:00:00",
  },
  {
    applicationId: "app3",
    taskNumber: 2,
    title: "Application sent",
    taskType: "application_sent",
    completedAt: "2026-11-06T10:00:00",
  },
  {
    applicationId: "app3",
    taskNumber: 3,
    title: "Prepare for interview",
    taskType: "custom",
    completedAt: null,
  },

  // app4: Nordic Design UX Designer (saved)
  {
    applicationId: "app4",
    taskNumber: 1,
    title: "Application sent",
    taskType: "application_sent",
    completedAt: null,
  },

  // app5: Café Nord Shift Manager (rejected)
  {
    applicationId: "app5",
    taskNumber: 1,
    title: "Application sent",
    taskType: "application_sent",
    completedAt: "2026-10-20T12:00:00",
  },
];

// Helper: look up a company name by ID
export function getCompanyName(companyId) {
  const company = companies.find((c) => c.id === companyId);
  return company ? company.name : "Unknown company";
}

// Helper: look up the list name by ID
export function getListName(listId) {
  const list = lists.find((l) => l.id === listId);
  return list ? list.name : "Unsorted";
}

// Helper: get all tasks for an application
export function getTasksForApplication(applicationId) {
  return tasks.filter((t) => t.applicationId === applicationId);
}
