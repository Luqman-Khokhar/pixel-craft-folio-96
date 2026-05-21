import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Smartphone, Globe, Monitor } from "lucide-react";

const projects = [
  {
    title: "Chirpbyte",
    type: "Customer Support App",
    description: "A mobile app for chatting with website/social visitors, handling their issues, and scheduling meetings.",
    image: "/Projects/Chirpbyte.png",
    tech: ["React Native", "Notifee", "Socket.io", "Pusher"],
    platform: "mobile",
    companyLink: "https://chirpbyte.com/",
    demo: "https://play.google.com/store/apps/details?id=com.chirpbyte&hl=en",
  },
  {
    title: "Skip2Beat",
    type: "Social Fitness App",
    description: "A fitness app combining guided workouts with music, real-time chat, and geolocation to connect and compete with friends.",
    image: "/Projects/Skip2beat.png",
    tech: ["React Native", "Socket.io", "Google Maps"],
    platform: "mobile",
    companyLink: "https://skip2beat.com.au/",
    demo: "https://play.google.com/store/apps/details?id=com.skip2beat.app&hl=en",
  },
  {
    title: "Kroolo",
    type: "Team Collaboration App",
    description: "A project management platform with task organization, role management, and real-time group communication.",
    image: "/Projects/Kroolo.svg",
    tech: ["React Native", "Socket.io", "Firebase"],
    platform: "mobile",
    companyLink: "https://kroolo.com/",
    demo: "https://play.google.com/store/search?q=kroolo&c=apps&hl=en",
  },
  {
    title: "Health In Mobile",
    type: "Health & Fitness App",
    description: "A mobile app designed to encourage healthy habits through motivation and guided lifestyle changes.",
    image: "/Projects/Acelive.png",
    tech: ["Expo React Native", "KeystoneJS", "Google Magic Link"],
    platform: "mobile",
    demo: "https://play.google.com/store/apps/details?id=org.hksr.healthinmobile&hl=en",
  },
  {
    title: "AlSalaam Tourism",
    type: "Tour & Event Booking",
    description: "A tour and event booking platform that lets users discover, compare, and book curated travel experiences.",
    image: "/Projects/Alsalaam.png",
    tech: ["Next.js", "Tailwind CSS", "Ant Design"],
    platform: "web",
    demo: "https://alsalaamtourism.com/",
  },
  {
    title: "Primax Portal",
    type: "Data Management App",
    description: "A role-based web platform for admins, brokers, and managers to track and organize business data efficiently.",
    image: "/Projects/Primax.png",
    tech: ["Laravel", "Vite", "Bootstrap", "MySQL"],
    platform: "web",
    demo: "https://primaxportal.com/login",
  },
  {
    title: "Ace Live",
    type: "Live Streaming Platform",
    description: "A platform where users can watch live streams, chat in real time, and interact with streamers.",
    image: "/Projects/Acelive.png",
    tech: ["React.js", "KeystoneJS", "TypeScript", "Supabase", "GraphQL"],
    platform: "all",
    demo: "https://acelive.cc/",
  },
];

const platformIcon: Record<string, React.ReactNode> = {
  mobile: <Smartphone className="h-3 w-3" />,
  web: <Globe className="h-3 w-3" />,
  all: <Monitor className="h-3 w-3" />,
};
const platformLabel: Record<string, string> = {
  mobile: "Mobile",
  web: "Web",
  all: "Web + Mobile",
};

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visible, setVisible] = useState(6);

  return (
    <section id="projects" className="py-24 relative overflow-hidden" ref={ref}>
      {/* bg muted band */}
      <div className="absolute inset-0 bg-secondary/20" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary mb-2">// work showcase</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="section-line" />
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {projects.slice(0, visible).map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative flex flex-col"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300 pointer-events-none" />

              <div className="relative glass border border-border/60 rounded-2xl overflow-hidden flex flex-col h-full hover:border-primary/30 transition-all duration-300">
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden bg-secondary/50">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Platform badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full glass border border-border/60 text-xs font-medium">
                    {platformIcon[project.platform]}
                    {platformLabel[project.platform]}
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div>
                    <p className="text-xs text-primary font-mono mb-1">{project.type}</p>
                    <h3 className="text-lg font-bold">{project.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {project.description}
                  </p>

                  {/* Tech */}
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="tech-tag">{t}</span>
                    ))}
                  </div>

                  {/* Links */}
                  <div className="flex items-center gap-2 pt-1">
                    {project.demo && (
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Live Demo
                      </a>
                    )}
                    {project.companyLink && (
                      <a
                        href={project.companyLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
                      >
                        <Globe className="h-3.5 w-3.5" />
                        Website
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show more / less */}
        <div className="flex justify-center gap-3 mt-10">
          {visible < projects.length && (
            <button
              onClick={() => setVisible((v) => v + 3)}
              className="gradient-fill text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              View More
            </button>
          )}
          {visible > 6 && (
            <button
              onClick={() => setVisible(6)}
              className="border border-border px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
            >
              Show Less
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
