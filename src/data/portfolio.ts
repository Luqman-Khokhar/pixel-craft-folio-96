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
};

export const hero = {
  heading: "Hi, I'm Muhammad Luqman Khokhar",
  roles: [
    "Software Engineer",
    "Full Stack Developer",
    "MERN Stack Developer",
    "React Native Developer",
    "Mobile App Developer",
  ],
  tagline:
    "Building complete web and mobile products end to end, from database and API to the screens people use. Specialized in the MERN stack and React Native.",
};

export const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export const about = {
  headline: "Turning ideas into digital reality",
  paragraphs: [
    "I'm a Full Stack Software Engineer with 4+ years of experience building and shipping complete web and mobile products with the MERN stack and React Native.",
    "I own projects end to end, from database design and APIs to polished interfaces and App Store and Play Store releases. I care about real-time features, clean architecture that scales, and smooth experiences people enjoy using.",
  ],
  stats: [
    { value: "4+", label: "Years" },
    { value: "20+", label: "Projects" },
    { value: "MERN", label: "Full Stack" },
  ],
};

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

export const experience = [
  {
    year: "2026",
    period: "2026 – Present",
    role: "MERN Stack & React Native Developer",
    company: "Contrive Solutions",
    summary: "Joined as a React.js Developer, now working across the full MERN stack and leading the company's React Native mobile app.",
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
    summary: "Leading the development of web and mobile interfaces with React.js and React Native.",
    points: [
      "Spearheaded frontend development of multiple mobile and web products, achieving improved responsiveness and user retention.",
      "Integrated AI chatbot & real-time notification systems, boosting user engagement and reducing manual support.",
      "Collaborated with backend teams on Node.js, KeystoneJS and Laravel integrations, enhancing system reliability and data flow.",
    ],
  },
  {
    year: "2024",
    period: "2024 – 2025",
    role: "Frontend Developer",
    company: "AppCrates",
    summary: "Built and maintained production-level React and React Native apps with modern UI libraries.",
    points: [
      "Built responsive web and mobile UI components with React.js and React Native, improving customer satisfaction metrics.",
      "Streamlined state management and component architecture to reduce code complexity and accelerate feature delivery.",
      "Partnered with cross-discipline teams to implement new features and ensure scalable & maintainable solutions.",
    ],
  },
  {
    year: "2023",
    period: "2023 – 2024",
    role: "Frontend Developer",
    company: "Al-Salam Tech House",
    summary: "Developed dynamic user interfaces and implemented responsive layouts for web applications.",
    points: [
      "Developed CRM web applications and a ride-booking mobile app using React Native.",
      "Focused on performance optimization, UI/UX enhancements, and efficient state management.",
      "Collaborated with teams to implement new features and ensure scalable solutions.",
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
};

// Links that failed a live check on 2026-10-31 are left out so a client never hits a dead page:
// Chirpbyte demo (Play Store 404), Skip2Beat company site and Ace Live demo (domain does not resolve).
// Chirpbyte now links its App Store listing instead.
export const projects: Project[] = [
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
    demo: "https://play.google.com/store/search?q=kroolo&c=apps&hl=en",
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
  },
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
export type CaseSheet = Omit<Project, "cover" | "logo" | "coverAlt"> & {
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

// The projects table holds ten cards: the eight projects, then two stats from the About content.
export const tableCards: TableCard[] = [
  { label: "Customer Support", title: "Chirpbyte", sub: "Mobile App", sheet: projectNamed("Chirpbyte") },
  { label: "Social Fitness", title: "Skip2Beat", sub: "Mobile App", note: "React Native, Socket.io, Google Maps", sheet: projectNamed("Skip2Beat") },
  { label: "Team Collaboration", title: "Kroolo", sub: "Mobile App", accent: "Live Chat", note: "React Native, Socket.io, Firebase", sheet: projectNamed("Kroolo") },
  { label: "Health & Fitness", title: "Health In Mobile", sub: "Mobile App", sheet: projectNamed("Health In Mobile") },
  { label: "Travel Booking", title: "AlSalaam Tourism", sub: "Web + Mobile", sheet: projectNamed("AlSalaam Tourism") },
  { label: "Data Management", title: "Primax Portal", sub: "Web App", sheet: projectNamed("Primax Portal") },
  { label: "Live Streaming", title: "Ace Live", sub: "Web + Mobile", sheet: projectNamed("Ace Live") },
  { label: "Prayer Finder", title: "Saleem", sub: "Mobile App", sheet: projectNamed("Saleem Mosque Finder") },
  {
    label: "Projects Built",
    title: "20+",
    sub: "Projects",
    sheet: {
      title: "20+ Projects",
      type: "Web and Mobile Applications",
      platform: "all",
      description: about.paragraphs[0],
      tech: ["React.js", "React Native", "Node.js", "Express.js", "MongoDB", "Next.js", "TypeScript", "Redux Toolkit", "Socket.io", "Firebase"],
      links: [
        { href: identity.github, label: "GitHub" },
        { href: identity.linkedin, label: "LinkedIn" },
      ],
    },
  },
  {
    label: "Experience",
    title: "4+",
    sub: "Years",
    sheet: {
      title: "4+ Years",
      type: identity.role,
      platform: "all",
      description: about.paragraphs[1],
      techLabel: "Worked at",
      tech: experience.map((job) => `${job.company}, ${job.period}`),
      links: [
        { href: identity.cv, label: "Resume" },
        { href: identity.linkedin, label: "LinkedIn" },
      ],
    },
  },
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
  heading: "Get In Touch",
  intro: "Have a project in mind or want to discuss opportunities? I'd love to hear from you!",
  connect: "Let's connect!",
  connectBody: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
  subject: "Portfolio Contact",
};
