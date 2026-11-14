// Content mirrors info.md (single source of truth). Update info.md first.

export const identity = {
  fullName: "Muhammad Luqman Khokhar",
  firstName: "Muhammad",
  displayLines: ["LUQMAN", "KHOKHAR"],
  role: "Full Stack Software Engineer",
  location: "Daska City, Pakistan",
  timeZone: "Asia/Karachi",
  timeZoneLabel: "PKT",
  email: "mluqmangn@gmail.com",
  phone: "+92 3147551262",
  phoneHref: "tel:+923147551262",
  github: "https://github.com/Luqman-Khokhar",
  linkedin: "https://www.linkedin.com/in/mluqmangn/",
  cv: "/CV/Muhammad_Luqman_CV_(31Oct2025).pdf.pdf",
  portrait: "/portrait-gold.webp",
  availability: "Remote · PKT (UTC+5)",
  site: "https://muhammadluqmankhokhar.vercel.app/",
};

export const hero = {
  heading: "Muhammad Luqman Khokhar, Full-Stack Software Engineer",
  eyebrow: "Full-Stack Software Engineer · Web & Mobile",
  headline: "I build and ship web and mobile products.",
  sub: "From scalable web apps to store-ready iOS and Android apps, I take products from idea to launch: database, API, interface and release.",
  primaryCta: { label: "Start a project", href: "#contact" },
  secondaryCta: { label: "Explore my work", href: "#projects" },
  proof: "Apps live on the App Store & Google Play",
};

export const navItems = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Work", href: "#projects" },
  { name: "Process", href: "#process" },
  { name: "Experience", href: "#experience" },
  { name: "Stack", href: "#skills" },
  { name: "Contact", href: "#contact" },
];

export const navCta = { label: "Start a project", href: "#contact" };

/** The framed line in the scene between hero and About. */
export const portal = {
  headline: "Turning ideas into digital reality",
};

export const about = {
  statement: "I'm Luqman, a full-stack engineer shipping production web and mobile apps since 2023.",
  paragraphs: [
    "I work across the whole product: MongoDB, Express and Node.js on the server, React and Next.js on the web, and React Native for iOS and Android. Most of what I've built is real-time — live chat, instant updates, notifications and maps — inside small teams where shipping mattered.",
    "Today I'm at Contrive Solutions, where I work across the MERN stack and own the Saleem Mosque Finder app end to end, from feature planning to App Store and Google Play releases.",
  ],
  facts: [
    { value: "2023", label: "Shipping since" },
    { value: "8", label: "Products in this portfolio" },
    { value: "iOS · Android · Web", label: "Platforms shipped" },
  ],
};

export type Service = {
  title: string;
  line: string;
  deliver: string[];
  solves: string;
  expect: string;
};

export const servicesIntro = {
  heading: "What I can build for you",
  sub: "Four ways to work together, from a single feature to a whole product.",
  cta: { prompt: "Not sure which fits?", label: "Tell me about your project", href: "#contact" },
};

export const services: Service[] = [
  {
    title: "Web Application Development",
    line: "Fast, responsive web apps that hold up as you grow.",
    deliver: ["Customer-facing web apps, portals and dashboards", "Booking flows, admin panels and role-based access", "React and Next.js front ends on a clean, maintainable codebase"],
    solves: "You've outgrown spreadsheets, a slow legacy site, or an off-the-shelf tool that doesn't fit how you work.",
    expect: "Works on every screen size, deployed to production, and a codebase another developer can pick up.",
  },
  {
    title: "Mobile Application Development",
    line: "One React Native codebase for iOS and Android.",
    deliver: ["Cross-platform apps with React Native and Expo", "Real-time chat, push notifications, maps and location", "Social and magic-link sign-in"],
    solves: "You need to reach customers on their phones without funding two separate native teams.",
    expect: "I handle builds, store listings and submissions to the App Store and Google Play.",
  },
  {
    title: "Full-Stack Product Development",
    line: "Frontend, backend and everything between.",
    deliver: ["REST and GraphQL APIs with Node.js and Express", "MongoDB and SQL data models, authentication and roles", "Real-time features with Socket.io, Pusher or Firebase, plus deployment"],
    solves: "You want one accountable engineer instead of coordinating separate frontend and backend freelancers.",
    expect: "A clear architecture, documented APIs and a product that's live, not just a repo.",
  },
  {
    title: "MVP & Startup Development",
    line: "From idea to something real users can try.",
    deliver: ["Scoping the smallest version worth launching", "Core user flows built first, polish where it counts", "Web, mobile, or both, from one stack"],
    solves: "You need to validate an idea with real users before spending on everything.",
    expect: "Tight scope, regular demos, and a codebase that can grow past version one.",
  },
];

export type ProcessStep = { number: string; title: string; text: string };

export const processIntro = { heading: "How a project runs" };

export const process: ProcessStep[] = [
  { number: "01", title: "Discovery", text: "Understand your goals, users and constraints before writing code." },
  { number: "02", title: "Planning", text: "Agree scope, architecture and a roadmap with clear milestones." },
  { number: "03", title: "Development", text: "Build in short cycles, with working demos and regular progress updates." },
  { number: "04", title: "Launch", text: "Test, deploy to production, and submit to the app stores." },
  { number: "05", title: "Support", text: "Fix, maintain and improve the product after launch." },
];

// `layer` names the part of an app each group builds; the skills section stacks them from UI / UX down to Deployment.
export const skills = [
  {
    category: "Frontend",
    layer: "What the screens are built with",
    items: ["React.js", "React Native", "Next.js", "TypeScript", "Tailwind CSS", "Ant Design", "Material UI", "Bootstrap", "Aceternity UI", "Formik & Yup"],
  },
  {
    category: "State Management",
    layer: "How the app remembers",
    items: ["Context API", "Redux", "Redux Toolkit", "Redux Thunk", "Redux Saga", "React Query", "Zustand"],
  },
  {
    category: "Real-time & APIs",
    layer: "How it talks, live",
    items: ["Socket.io", "Pusher", "Firebase", "Supabase", "REST APIs", "WebSockets", "GraphQL"],
  },
  {
    category: "Backend",
    layer: "The servers and data behind the screens",
    items: ["Node.js", "Express.js", "MongoDB", "Ruby on Rails", "KeystoneJS", "Laravel"],
  },
  {
    category: "Deployment",
    layer: "Where it ships",
    items: ["Vercel", "Netlify", "GoDaddy", "Hostinger", "Google Play Store", "Apple App Store"],
  },
  {
    category: "UI / UX",
    layer: "The part people touch",
    items: ["Responsive Design", "Animations & Transitions", "Modern UI Libraries", "Component Design", "MVC / MVVM Structure"],
  },
];

export const experienceIntro = "Four teams since 2023, from agency client work to owning a product.";

export const experience = [
  {
    year: "2026",
    period: "2026 – Present",
    role: "MERN Stack & React Native Developer",
    company: "Contrive Solutions",
    summary: "Joined as a React.js developer; now work across the MERN stack and own the company's mobile app.",
    points: [
      "Build and maintain full stack web features with MongoDB, Express.js, React.js and Node.js.",
      "Own the Saleem Mosque Finder mobile app solo, a React Native Expo project shipped to Android and iOS.",
      "Handle the mobile release cycle end to end, from feature planning and API integration to Google Play and App Store submissions.",
    ],
  },
  {
    year: "2025",
    period: "2025 – 2026",
    role: "Frontend Developer",
    company: "Adroid IT Solutions",
    summary: "Led front-end work on web and mobile products with React.js and React Native.",
    points: [
      "Built the front end of several web and mobile products.",
      "Integrated an AI chatbot and real-time notifications into client products.",
      "Worked with backend teams on Node.js, KeystoneJS and Laravel integrations.",
    ],
  },
  {
    year: "2024",
    period: "2024 – 2025",
    role: "Frontend Developer",
    company: "AppCrates",
    summary: "Built and maintained production React and React Native apps.",
    points: [
      "Built responsive UI components for web and mobile.",
      "Simplified state management and component structure to speed up feature work.",
      "Shipped features alongside design and backend teammates.",
    ],
  },
  {
    year: "2023",
    period: "2023 – 2024",
    role: "Frontend Developer",
    company: "Al-Salam Tech House",
    summary: "Built CRM web applications and a ride-booking mobile app.",
    points: [
      "Developed CRM web applications with React.",
      "Built a ride-booking mobile app with React Native.",
      "Worked on performance, UI polish and state management.",
    ],
  },
];

export type Project = {
  title: string;
  type: string;
  platform: "mobile" | "web" | "all";
  description: string;
  tech: string[];
  cover: string;
  logo: string;
  coverAlt: string;
  company?: string;
  demo?: string;
  appStore?: string;
  context: string;
  contribution: string;
  features: string[];
  featured?: { problem: string; solution: string; outcome: string };
  status: "live" | "private";
  note?: string;
};

// Links that failed a live check on 2026-10-31 are left out so a client never hits a dead page:
// Chirpbyte demo (Play Store 404), Skip2Beat company site and Ace Live demo (domain does not resolve).
// Chirpbyte now links its App Store listing instead. Kroolo Play Store listing verified 2026-11-14.
export const projectsIntro = {
  title: "Selected work",
  sub: "Eight products. Seven are live on the App Store, Google Play or the web.",
};

export const projects: Project[] = [
  {
    title: "Saleem Mosque Finder",
    type: "Mosque & Prayer Location Finder App",
    platform: "mobile",
    description: "A prayer location finder for Muslims: find nearby mosques and prayer areas, request new locations or edits, and join or start congregations for the next prayer.",
    tech: ["Expo React Native", "Ruby on Rails", "Redux", "Firebase", "TypeScript"],
    cover: "/Projects/covers/saleem.webp",
    logo: "/Projects/icons/saleem.webp",
    coverAlt: "Three Saleem app screens: a mosque map, active congregation prayers and a form to propose a prayer location",
    demo: "https://play.google.com/store/apps/details?id=com.akhie.saleem&hl=en",
    appStore: "https://apps.apple.com/us/app/saleem-mosque-finder/id6760958351",
    context: "Contrive Solutions · sole mobile engineer",
    contribution: "Sole mobile engineer: built the Expo React Native app, integrated it with the Ruby on Rails API, and handled releases to Google Play and the App Store.",
    features: ["Map of nearby mosques and prayer areas", "Propose new locations or edits to existing ones", "Start or join a congregation for the next prayer"],
    featured: {
      problem: "Muslims who are travelling or new to an area need to find a place to pray, and to know whether others are about to pray there.",
      solution: "A location-first app: find nearby mosques and prayer areas, suggest missing ones, and gather a congregation for the next prayer.",
      outcome: "Live on Google Play and the App Store.",
    },
    status: "live",
  },
  {
    title: "Chirpbyte",
    type: "Customer Support & Engagement App",
    platform: "mobile",
    description: "A mobile app for chatting with website/social visitors, handling their issues, and scheduling meetings.",
    tech: ["React Native", "Notifee", "Socket.io", "Pusher"],
    cover: "/Projects/covers/chirpbyte.webp",
    logo: "/Projects/icons/chirpbyte.webp",
    coverAlt: "Three Chirpbyte app screens: a visitor dashboard, live conversations and a customer chat",
    company: "https://chirpbyte.com/",
    appStore: "https://apps.apple.com/us/app/chirpbyte/id6670273736",
    context: "Team project",
    contribution: "React Native development of the mobile app: live conversations, real-time updates with Socket.io and Pusher, and push notifications with Notifee.",
    features: ["Live chat with website and social-media visitors", "Real-time conversation updates and push notifications", "Visitor dashboard and meeting scheduling"],
    featured: {
      problem: "Businesses chatting with visitors across their website and social channels need to answer from anywhere, not just from a desk.",
      solution: "A mobile inbox for live visitor conversations, issue handling and meeting scheduling.",
      outcome: "Live on the App Store.",
    },
    status: "live",
  },
  {
    title: "Skip2Beat",
    type: "Social Fitness & Workout Tracking App",
    platform: "mobile",
    description: "A fitness app that combines guided 7-minute workouts with music, real-time chat, and geolocation to connect, compete, and stay motivated with friends.",
    tech: ["React Native", "Socket.io", "Google Maps"],
    cover: "/Projects/covers/skip2beat.webp",
    logo: "/Projects/icons/skip2beat.webp",
    coverAlt: "Three Skip2Beat app screens: workouts, a live session and a map of nearby members",
    demo: "https://play.google.com/store/apps/details?id=com.skip2beat.app&hl=en",
    context: "Team project",
    contribution: "React Native development: guided workout flows, real-time chat with Socket.io, and location features with Google Maps.",
    features: ["Guided 7-minute workouts set to music", "Real-time chat between members", "Nearby members on a map, to connect and compete"],
    featured: {
      problem: "Workouts are easier to stick to with friends, but most fitness apps are solitary.",
      solution: "Short guided workouts with music, plus chat and location so members can find, challenge and motivate each other.",
      outcome: "Live on Google Play.",
    },
    status: "live",
  },
  {
    title: "Kroolo",
    type: "Management & Team Collaboration App",
    platform: "mobile",
    description: "A project management platform that lets teams organize tasks, manage roles, and collaborate through real-time chat and group communication.",
    tech: ["React Native", "Socket.io", "Firebase", "Google / Apple / Facebook Login"],
    cover: "/Projects/covers/kroolo.webp",
    logo: "/Projects/icons/kroolo.webp",
    coverAlt: "Three Kroolo app screens showing task lists and a calendar",
    company: "https://kroolo.com/",
    demo: "https://play.google.com/store/apps/details?id=com.kroolo.app&hl=en",
    context: "Team project",
    contribution: "React Native development: task and role management, real-time chat, and Google, Apple and Facebook sign-in.",
    features: ["Tasks, roles and team spaces", "Real-time group and direct chat", "Google, Apple and Facebook sign-in"],
    status: "live",
  },
  {
    title: "Health In Mobile",
    type: "Health & Fitness Motivation App",
    platform: "mobile",
    description: "A mobile app designed to encourage healthy habits through motivation and guided lifestyle changes to prevent and manage chronic diseases.",
    tech: ["Expo React Native", "KeystoneJS", "Google Magic Link"],
    cover: "/Projects/covers/health.webp",
    logo: "/Projects/icons/health.webp",
    coverAlt: "Three Health In Mobile app screens with health tips and reminders",
    demo: "https://play.google.com/store/apps/details?id=org.hksr.healthinmobile&hl=en",
    context: "Team project",
    contribution: "Expo React Native development with a KeystoneJS backend and Google magic-link sign-in.",
    features: ["Motivation and guided lifestyle content", "Habit reminders", "Passwordless magic-link sign-in"],
    status: "live",
  },
  {
    title: "AlSalaam Tourism",
    type: "Tour & Event Booking Web Application",
    platform: "all",
    description: "A tour and event booking platform that lets users discover, compare, and book curated travel experiences.",
    tech: ["Next.js", "Tailwind CSS", "Ant Design"],
    cover: "/Projects/covers/alsalaam.webp",
    logo: "/Projects/icons/alsalaam.webp",
    coverAlt: "AlSalaam Tourism homepage with a travel booking search bar",
    demo: "https://alsalaamtourism.com/",
    context: "Team project",
    contribution: "Front-end development in Next.js with Tailwind CSS and Ant Design.",
    features: ["Browse and compare curated tours and events", "Booking search", "Responsive on web and mobile"],
    status: "live",
  },
  {
    title: "Primax Portal",
    type: "Role-Based Data Management Web Application",
    platform: "web",
    description: "A web platform that allows admins, brokers, telemarketers, account managers, and data managers to manage, track, and organize business data efficiently.",
    tech: ["Laravel", "Vite", "Bootstrap", "MySQL"],
    cover: "/Projects/covers/primax.webp",
    logo: "/Projects/icons/primax.webp",
    coverAlt: "Primax Portal sign-in screen",
    demo: "https://primaxportal.com/login",
    context: "Client portal · login-gated",
    contribution: "Front-end work on a Laravel and Bootstrap portal with role-based views.",
    features: ["Separate views for admins, brokers, telemarketers, account and data managers", "Track and organize business records", "Role-based access"],
    status: "live",
    note: "Login-gated client system; screens available on request.",
  },
  {
    title: "Ace Live",
    type: "Live Streaming & Interactive Chat Web Application",
    platform: "all",
    description: "A platform where users can watch live streams, chat in real time, and interact with streamers who can manage or promote participants.",
    tech: ["React.js", "KeystoneJS", "TypeScript", "OBS", "Supabase", "GraphQL", "Prisma", "MySQL"],
    cover: "/Projects/covers/acelive.webp",
    logo: "/Projects/icons/acelive.webp",
    coverAlt: "Ace Live title artwork with a live badge and audio bars",
    context: "Private client build",
    contribution: "Front-end development in React and TypeScript, working against a KeystoneJS/GraphQL backend with Supabase.",
    features: ["Watch live streams with real-time chat", "Streamers can manage and promote participants"],
    status: "private",
    note: "Private build, not publicly launched.",
  },
];

/** A project's public links, the store or live site first. */
export const projectLinks = (project: Pick<Project, "demo" | "company" | "appStore">) => [
  ...(project.demo ? [{ href: project.demo, label: project.demo.includes("play.google.com") ? "Open on Google Play" : "Visit live site" }] : []),
  ...(project.appStore ? [{ href: project.appStore, label: "Open on App Store" }] : []),
  ...(project.company ? [{ href: project.company, label: "Company site" }] : []),
];

export const platformLabel: Record<Project["platform"], string> = {
  mobile: "Mobile",
  web: "Web",
  all: "Web + Mobile",
};

/** What a detail sheet shows: a project, or anything shaped like one. */
export type CaseSheet = Omit<Project, "cover" | "logo" | "coverAlt" | "context" | "contribution" | "features" | "featured" | "status" | "note"> &
  Partial<Pick<Project, "context" | "contribution" | "features" | "featured" | "status" | "note">> & {
  cover?: string;
  coverAlt?: string;
  techLabel?: string;
  links?: { href: string; label: string }[];
};

export type TableCard = {
  label: string;
  title: string;
  sub: string;
  accent?: string;
  note?: string;
  sheet: CaseSheet;
};

const projectNamed = (title: string) => projects.find((p) => p.title === title) as Project;

// The projects table holds the eight projects.
export const tableCards: TableCard[] = [
  { label: "Prayer Finder", title: "Saleem", sub: "Mobile App", sheet: projectNamed("Saleem Mosque Finder") },
  { label: "Customer Support", title: "Chirpbyte", sub: "Mobile App", sheet: projectNamed("Chirpbyte") },
  { label: "Social Fitness", title: "Skip2Beat", sub: "Mobile App", note: "React Native, Socket.io, Google Maps", sheet: projectNamed("Skip2Beat") },
  { label: "Team Collaboration", title: "Kroolo", sub: "Mobile App", accent: "Live Chat", note: "React Native, Socket.io, Firebase", sheet: projectNamed("Kroolo") },
  { label: "Health & Fitness", title: "Health In Mobile", sub: "Mobile App", sheet: projectNamed("Health In Mobile") },
  { label: "Travel Booking", title: "AlSalaam Tourism", sub: "Web + Mobile", sheet: projectNamed("AlSalaam Tourism") },
  { label: "Data Management", title: "Primax Portal", sub: "Web App", sheet: projectNamed("Primax Portal") },
  { label: "Live Streaming", title: "Ace Live", sub: "Web + Mobile", sheet: projectNamed("Ace Live") },
];

// A store is proof when the project's demo link is its listing there.
const STORE_HOSTS: Record<string, string> = { "Google Play Store": "play.google.com", "Apple App Store": "apps.apple.com" };

/** The project cards whose tech list names this skill. Stat cards don't count: only a shipped project is proof. */
export const cardsUsing = (skill: string): TableCard[] =>
  tableCards.filter((card) => {
    if (!projects.includes(card.sheet as Project)) return false;
    const host = STORE_HOSTS[skill];
    if (host) return [(card.sheet as Project).demo, (card.sheet as Project).appStore].some((link) => link?.includes(host));
    return card.sheet.tech.some((tech) => tech.includes(skill));
  });

export const contact = {
  heading: "Have something worth building?",
  intro: "Tell me about your idea, and let's explore how to bring it to life.",
  helper: "A few lines on what you're building, who it's for and when you'd like to launch is plenty.",
  projectTypes: ["Web application", "Mobile app", "Full-stack product", "MVP", "Not sure yet"],
  submit: "Let's talk",
  // Kept for the current contact layout until the contact section is redesigned.
  connect: "Let's connect!",
  connectBody: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
  subject: "Portfolio enquiry",
};
