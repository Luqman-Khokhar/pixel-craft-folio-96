// Content mirrors info.md (single source of truth). Update info.md first.

export const identity = {
  fullName: "Muhammad Luqman Khokhar",
  firstName: "Muhammad",
  displayLines: ["LUQMAN", "KHOKHAR"],
  role: "Frontend Developer (React.js, React Native)",
  location: "Daska City, Pakistan",
  timeZone: "Asia/Karachi",
  timeZoneLabel: "PKT",
  email: "mluqmangn@gmail.com",
  phone: "+92 3147551262",
  phoneHref: "tel:+923147551262",
  github: "https://github.com/Luqman-Khokhar",
  linkedin: "https://www.linkedin.com/in/mluqmangn/",
  cv: "/CV/Muhammad_Luqman_CV_(31Oct2025).pdf.pdf",
  portrait: "/about-removebg.png",
};

export const hero = {
  heading: "Hi, I'm Muhammad Luqman Khokhar",
  roles: [
    "React.js Developer",
    "React Native Developer",
    "Web Developer",
    "Mobile App Developer",
    "Full Stack Developer",
  ],
  tagline:
    "Crafting beautiful, performant, and user-friendly applications with modern technologies. Specialized in React ecosystem and mobile development.",
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
    "I'm a Frontend Developer with 2+ years of experience building intuitive, high-performance web and mobile applications using React.js and React Native.",
    "I focus on detail-oriented interfaces, real-time features, and efficient architectures that scale gracefully. My passion lies in blending creativity and logic to deliver smooth, visually stunning user experiences.",
  ],
  stats: [
    { value: "2+", label: "Years" },
    { value: "20+", label: "Projects" },
    { value: "React / RN", label: "Tech Focus" },
  ],
};

export const skills = [
  {
    category: "Frontend",
    items: ["React.js", "React Native", "Next.js", "TypeScript", "Tailwind CSS", "Ant Design", "Material UI", "Bootstrap", "Aceternity UI", "Formik & Yup"],
  },
  {
    category: "State Management",
    items: ["Context API", "Redux", "Redux Toolkit", "Redux Thunk", "Redux Saga", "React Query", "Zustand"],
  },
  {
    category: "Real-time & APIs",
    items: ["Socket.io", "Pusher", "Firebase", "Supabase", "REST APIs", "WebSockets", "GraphQL"],
  },
  {
    category: "Backend Familiarity",
    items: ["Node.js", "KeystoneJS", "Laravel", "Express.js"],
  },
  {
    category: "Deployment",
    items: ["Vercel", "Netlify", "GoDaddy", "Hostinger", "Google Play Store", "Apple App Store"],
  },
  {
    category: "UI / UX",
    items: ["Responsive Design", "Animations & Transitions", "Modern UI Libraries", "Component Design", "MVC / MVVM Structure"],
  },
];

export const experience = [
  {
    year: "2025",
    period: "2025 – Present",
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
};

// Links that failed a live check on 2026-10-31 are left out so a client never hits a dead page:
// Chirpbyte demo (Play Store 404), Skip2Beat company site and Ace Live demo (domain does not resolve).
export const projects: Project[] = [
  {
    title: "Chirpbyte",
    type: "Customer Support & Engagement App",
    platform: "mobile",
    description: "A mobile app for chatting with website/social visitors, handling their issues, and scheduling meetings.",
    tech: ["React Native", "Notifee", "Socket.io", "Pusher"],
    cover: "/Projects/covers/chirpbyte.webp",
    logo: "/Projects/icons/chirpbyte.webp",
    coverAlt: "Chirpbyte website showing its live chat product",
    company: "https://chirpbyte.com/",
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
    logo: "/Projects/icons/health.webp",
    coverAlt: "Ace Live title artwork with a live badge and audio bars",
  },
];

export const platformLabel: Record<Project["platform"], string> = {
  mobile: "Mobile",
  web: "Web",
  all: "Web + Mobile",
};

export const contact = {
  heading: "Get In Touch",
  intro: "Have a project in mind or want to discuss opportunities? I'd love to hear from you!",
  connect: "Let's connect!",
  connectBody: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
  subject: "Portfolio Contact",
};
