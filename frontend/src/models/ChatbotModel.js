export const initialChats = [
  { id: 1, title: "Labor Law Question", folderId: null },
  { id: 2, title: "Contract Issue", folderId: null }
];

export const initialFolders = [
  { id: 1, name: "Work", chatIds: [], color: "#BE2A41" },
  { id: 2, name: "Study", chatIds: [], color: "#E78A48" }
];

export const lawsList = [
  // Employment
  {
    id: "F5QMNLEkKmAh4zlYr073",
    name: "Finnish Employment Contracts Act",
    category: "Employment",
    link: "https://www.finlex.fi/en/legislation/2001/55"
  },
  {
    id: "Hrhf4r69hR3fuy5qYipd",
    name: "Act on Equality between Women and Men",
    category: "Employment",
    link: "https://www.finlex.fi/en/legislation/1986/609"
  },
  {
    id: "eo5UkUtWL6XWmNrhNpXr",
    name: "Act on Privacy in Working Life",
    category: "Employment",
    link: "https://www.finlex.fi/en/legislation/2004/759"
  },
  {
    id: "lyunouCMu7QOKcU3wRl4",
    name: "Act on Health Care Professionals",
    category: "Employment",
    link: "https://www.finlex.fi/en/legislation/1994/559"
  },
  {
    id: "D8eIg932tuODAaySL6cL",
    name: "Act on Social Welfare Professionals",
    category: "Employment",
    link: "https://www.finlex.fi/en/legislation/2015/817"
  },
  // Working Hours & Leave
  {
    id: "fnG0lxxRH6WL0U4a6yqe",
    name: "Working Hours Act",
    category: "Working Hours & Leave",
    link: "https://www.finlex.fi/en/legislation/2019/872"
  },
  {
    id: "4OcnZCQPBjyg0FTzInhh",
    name: "Annual Holidays Act",
    category: "Working Hours & Leave",
    link: "https://www.finlex.fi/en/legislation/2005/162"
  },
  {
    id: "fz4fCjUC6rfuTwSQHz0q",
    name: "Study Leave Act",
    category: "Working Hours & Leave",
    link: "https://www.finlex.fi/en/legislation/1979/864"
  },
  // Safety & Equality
  {
    id: "alIhG8Y1CVoNQ49llLSI",
    name: "Occupational Safety and Health Act",
    category: "Safety & Equality",
    link: "https://www.finlex.fi/en/legislation/2002/738"
  },
  {
    id: "UVuzgQSsNfTV8QmpDSfx",
    name: "Non-Discrimination Act",
    category: "Safety & Equality",
    link: "https://www.finlex.fi/en/legislation/2014/1325"
  },
  {
    id: "UaKp743x0nbRNBN3PgT1",
    name: "Act on Occupational Safety and Health Enforcement",
    category: "Safety & Equality",
    link: "https://www.finlex.fi/en/legislation/2006/44"
  },
  {
    id: "5SLYQSrnRQwogR5wSyOd",
    name: "Act on the Publicity of Government Activities",
    category: "Safety & Equality",
    link: "https://www.finlex.fi/en/legislation/1999/621"
  },
  // Cooperation
  {
    id: "DoXpudNQCSw9qMTaSR1F",
    name: "Cooperation within Undertakings Act",
    category: "Cooperation",
    link: "https://www.finlex.fi/en/legislation/2021/1333"
  },
  {
    id: "0ESDIWZFtEm36z6EWvUs",
    name: "Act on Cooperation between Employer and Employees in Municipalities",
    category: "Cooperation",
    link: "https://www.finlex.fi/en/legislation/2007/449",
  },
  // Collective Agreements
  {
    id: "BSkq9y4w5nqVxm4cTDz4",
    name: "Municipal Health and Social Services Agreement (HYVTES)",
    category: "Collective Agreements",
    link: "https://www.kt.fi/sopimukset/hyvtes/2025-2028/kokoteksti"
  },
  {
    id: "gl5SJiz82csQqSUo4acZ",
    name: "Social and Health Care Collective Agreement (Sote-sopimus)",
    category: "Collective Agreements",
    link: "https://www.kt.fi/sopimukset/sote/2025-2028/kokoteksti"
  },
  {
    id: "wDfxMlGMJTbI6wn0gPIB",
    name: "General Municipal Collective Agreement (YTES)",
    category: "Collective Agreements",
    link: "https://www.kt.fi/sopimukset/ytes/2025-2028/kokoteksti"
  }
];

export const initialMessages = [
  {
    role: "assistant",
    content: "WELCOME_VIEW"
  }
];