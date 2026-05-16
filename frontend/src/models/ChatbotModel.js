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
    id: "F5QMNLEkKmAh4zlYr073",
    name: "Finnish Employment Contracts Act",
    category: "Work",
    link: "https://www.finlex.fi/en/legislation/2001/55"
  },
  {
    id: "fnG0lxxRH6WL0U4a6yqe",
    name: "Working Hours Act",
    category: "Work",
    link: "https://www.finlex.fi/en/legislation/2019/872"
  },
  {
    id: "4OcnZCQPBjyg0FTzInhh",
    name: "Annual Holidays Act",
    category: "Work",
    link: "https://www.finlex.fi/en/legislation/2005/162"
  },
  {
    id: "alIhG8Y1CVoNQ49llLSI",
    name: "Occupational Safety and Health Act",
    category: "Study",
    link: "https://www.finlex.fi/en/legislation/2002/738"
  },
  {
    id: "UVuzgQSsNfTV8QmpDSfx",
    name: "Non-Discrimination Act",
    category: "Study",
    link: "https://www.finlex.fi/en/legislation/2014/1325"
  },
  {
    id: "DoXpudNQCSw9qMTaSR1F",
    name: "Cooperation within Undertakings Act",
    category: "Something else",
    link: "https://www.finlex.fi/en/legislation/2021/1333"
  },
  {
    id: "5SLYQSrnRQwogR5wSyOd",
    name: "Act on the Publicity of Government Activities",
    category: "Something else",
    link: "https://www.finlex.fi/en/legislation/1999/621"
  }
];

export const initialMessages = [
  {
    role: "assistant",
    content: "WELCOME_VIEW"
  }
];