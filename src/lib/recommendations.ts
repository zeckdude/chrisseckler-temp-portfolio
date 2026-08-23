export type RecommendationEra =
  | "toucan"
  | "dave"
  | "trailer-park"
  | "pro-print"
  | "early-career"
  | "education";

export type Recommendation = {
  name: string;
  title: string;
  company: string;
  relationship: string;
  date: string;
  quote: string;
  featured: boolean;
  era: RecommendationEra;
};

export const recommendationsMeta = {
  totalCount: 28,
  dateRange: "2010–2023",
  headline: "What colleagues say",
  subtext:
    "28 LinkedIn recommendations from direct managers, peers, and cross-functional partners — spanning startups, enterprise, and agency work from 2010 to 2023.",
  themes: [
    { label: "Attention to detail", detail: "Catches design and code issues before they ship." },
    { label: "Team-first", detail: "Puts the team ahead of himself; reliable under pressure." },
    { label: "Mentorship", detail: "Levels up junior engineers and non-technical partners alike." },
    { label: "User-first", detail: "Builds with the end user in mind, not just the ticket." },
    { label: "Proactive", detail: "Handles problems before they become major concerns." },
    { label: "Positive energy", detail: "Calm, organized, and genuinely fun to work with." },
  ],
};

export const recommendations: Recommendation[] = [
  {
    name: "David Cutherell",
    title: "Engineering Leader",
    company: "Toucan",
    relationship: "Direct manager",
    date: "May 2023",
    quote:
      "Chris's word is his bond. One of the hardest working engineers I've had the privilege of working with. He leads by example and is always striving for more knowledge. If you see his resume land on your desk, just hire him. He'll be one of the kindest and most dedicated engineers on your team.",
    featured: true,
    era: "toucan",
  },
  {
    name: "Shaun Merritt",
    title: "Co-Founder & CTO",
    company: "Toucan",
    relationship: "Direct manager",
    date: "April 2023",
    quote:
      "Here are a few of the things that happen when you start working with Chris: 1) Your projects get done on time or ahead of schedule. 2) Your team rises to more challenges because of his mentorship, mindset, and work ethic. 3) Issues that you didn't even know of start getting handled before they become a major concern.",
    featured: true,
    era: "toucan",
  },
  {
    name: "Kassandra Randazzo",
    title: "Product Design",
    company: "Toucan",
    relationship: "Senior colleague",
    date: "May 2023",
    quote:
      "Chris is truly a star engineer... he consistently impressed me with his attention to detail. He always had a sharp eye for catching even the smallest design or code issues... He seemed to thrive under pressure and was ready to take on new and exciting projects.",
    featured: true,
    era: "toucan",
  },
  {
    name: "Chas Bean",
    title: "Engineer",
    company: "Toucan",
    relationship: "Same team",
    date: "April 2023",
    quote:
      "His ability to mentor junior engineers, empathize with users, and build stable and scalable systems is really what sets him apart from others in his field.",
    featured: true,
    era: "toucan",
  },
  {
    name: "Joe Ritchey",
    title: "Technical Program Manager",
    company: "Toucan",
    relationship: "Same team",
    date: "May 2023",
    quote:
      "I always appreciated his attention to detail when scoping out engineering work, his ability to call things out if something didn't seem right, and always putting the team first before himself.",
    featured: true,
    era: "toucan",
  },
  {
    name: "Nathan Bergmoor",
    title: "Creative Director",
    company: "Toucan",
    relationship: "Same team",
    date: "May 2023",
    quote:
      "No matter the situation, he's always calm, organized and driven to make an impact. He taught me a lot about how to best work with engineers and even took the time to teach me some basic coding so I felt more empowered.",
    featured: true,
    era: "toucan",
  },
  {
    name: "Jade Karki",
    title: "Sign Language Events Manager",
    company: "Toucan",
    relationship: "Cross-functional partner",
    date: "April 2023",
    quote:
      "Working with Chris is always a fun time. He's got a great sense of humor, but also knows when to be serious and get things done.",
    featured: true,
    era: "toucan",
  },
  {
    name: "Kelly Gabrysch",
    title: "Creative Producer",
    company: "Trailer Park",
    relationship: "Senior colleague",
    date: "October 2014",
    quote:
      "Chris was amazing to work with. Both efficient and fast, his dedication showed itself by producing great products for very big clients such as Apple.",
    featured: true,
    era: "trailer-park",
  },
  {
    name: "Danny Duong",
    title: "Web Developer",
    company: "Trailer Park",
    relationship: "Same team",
    date: "October 2014",
    quote:
      "Chris always develops with the end user's best interest in mind. If he can't find the tools to solve the big problems, he will build them himself.",
    featured: true,
    era: "trailer-park",
  },
  {
    name: "Bruce Woo",
    title: "Software Engineering Leader",
    company: "Trailer Park",
    relationship: "Direct manager",
    date: "October 2014",
    quote:
      "Chris is a dedicated web developer with a wide range of skill sets that he applies to every project. He is well-organized and understands considerations beyond engineering, and always ready and enthusiastic to dive into the work.",
    featured: false,
    era: "trailer-park",
  },
  {
    name: "Ian Donahue",
    title: "Product Designer",
    company: "Dave.com",
    relationship: "Same team",
    date: "October 2019",
    quote:
      "Chris had a good eye for anticipating problems, planning solutions and pointing out inconsistencies. Very detail-oriented and also really easy to work with.",
    featured: false,
    era: "dave",
  },
  {
    name: "Steve Boelhouwer",
    title: "Space Ops Engineer",
    company: "Pro Print & Services",
    relationship: "Direct manager",
    date: "December 2012",
    quote:
      "Throughout this growth, Chris was one of the key developers that anchored the team and provided the stability, technical know-how, and innovation that drove its success.",
    featured: false,
    era: "pro-print",
  },
];

export const featuredRecommendations = recommendations.filter((r) => r.featured);
