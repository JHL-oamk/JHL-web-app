export const initialChats = [
  { id: 1, title: "Labor Law Question", folderId: null },
  { id: 2, title: "Contract Issue", folderId: null }
];

export const initialFolders = [
  { id: 1, name: "Work", chatIds: [], color: "#BE2A41" },
  { id: 2, name: "Study", chatIds: [], color: "#E78A48" }
];

export const lawsList = [
  {
    name: "Act on the Publicity of Government Activities",
    link: "https://www.finlex.fi/fi/lainsaadanto/1999/621"
  },
  {
    name: "Finnish Employment Contracts Act",
    link: "https://www.finlex.fi/en/legislation/2001/55"
  }
];

// ChatbotModel.js
export const initialMessages = [
  {
    role: "assistant",
    content: "WELCOME_VIEW" // We use a unique string to identify the special UI
  }
];