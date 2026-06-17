import { University } from "@/types/university";

export const universitySeed: University[] = [
  {
    id: "1",

    name: "University of Sydney",

    country: "Australia",

    city: "Sydney",

    state: "NSW",

    postalCode: "2006",

    ranking: 19,

    website: "https://sydney.edu.au",

    applicationFee: 150,

    currency: "AUD",

    establishedYear: 1850,

    contactPerson: "John Smith",

    contactEmail: "admissions@sydney.edu.au",

    contactPhone: "+61 2 9351 2222",

    intakeNotes:
      "February and July intakes available",

    description:
      "Leading Australian research university.",

    status: "active",

    courses: [
      {
        id: "c1",

        name: "Master of Computer Science",

        courseCode: "MCS001",

        degree: "masters",

        durationMonths: 24,

        annualTuitionFee: 52000,

        totalTuitionFee: 104000,

        currency: "AUD",

        intake: "February",

        minimumPercentage: 60,

        backlogLimit: 5,

        ieltsOverall: 6.5,
      },

      {
        id: "c2",

        name: "MBA",

        courseCode: "MBA101",

        degree: "mba",

        durationMonths: 18,

        annualTuitionFee: 70000,

        totalTuitionFee: 105000,

        currency: "AUD",

        intake: "July",

        ieltsOverall: 7,
      },
    ],

    scholarships: [
      {
        id: "s1",

        name: "Vice Chancellor Scholarship",

        percentage: 25,
      },
    ],

    createdAt: new Date().toISOString(),

    updatedAt: new Date().toISOString(),
  },
];