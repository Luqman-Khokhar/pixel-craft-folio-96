import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ExternalLink, Smartphone, Globe, Monitor, ChevronRight } from "lucide-react";

const projects = [
  {
    title: "Chirpbyte",
    type: "Customer Support App",
    description: "Mobile app for chatting with website/social visitors, handling issues, and scheduling meetings in real time.",
    image: "/Projects/Chirpbyte.png",
    tech: ["React Native","Notifee","Socket.io","Pusher"],
    platform: "mobile",
    companyLink: "https://chirpbyte.com/",
    demo: "https://play.google.com/store/apps/details?id=com.chirpbyte&hl=en",
    featured: true,
  },
  {
    title: "Skip2Beat",
    type: "Social Fitness App",
    description: "Fitness app combining guided workouts with music, real-time chat, and geolocation to connect and compete.",
    image: "/Projects/Skip2beat.png",
    tech: ["React Native","Socket.io","Google Maps"],
    platform: "mobile",
    companyLink: "https://skip2beat.com.au/",
    demo: "https://play.google.com/store/apps/details?id=com.skip2beat.app&hl=en",
  },
  {
    title: "Kroolo",
    type: "Team Collaboration",
    description: "Project management platform with task organization, role management, and real-time group communication.",
    image: "/Projects/Kroolo.svg",
    tech: ["React Native","Socket.io","Firebase"],
    platform: "mobile",
    companyLink: "https://kroolo.com/",
    demo: "https://play.google.com/store/search?q=kroolo&c=apps&hl=en",
  },
  {
    title: "Health In Mobile",
    type: "Health & Fitness",
    description: "Mobile app encouraging healthy habits through motivation and guided lifestyle changes.",
    image: "/Projects/Acelive.png",
    tech: ["Expo","KeystoneJS","Google Magic Link"],
    platform: "mobile",
    demo: "https://play.google.com/store/apps/details?id=org.hksr.healthinmobile&hl=en",
  },
  {
    title: "AlSalaam Tourism",
    type: "Tour & Event Booking",
    description: "Tour and event booking platform for discovering, comparing, and booking curated travel experiences.",
    image: "/Projects/Alsalaam.png",
    tech: ["Next.js","Tailwind CSS","Ant Design"],
    platform: "web",
    demo: "https://alsalaamtourism.com/",
  },
  {
    title: "Primax Portal",
    type: "Data Management",
    description: "Role-based web platform for admins, brokers and managers to track and organize business data.",
    image: "/Projects/Primax.png",
    tech: ["Laravel","Vite","Bootstrap","MySQL"],
    platform: "web",
    demo: "https://primaxportal.com/login",
  },
  {
    title: "Ace Live",
    type: "Live Streaming Platform",
    description: "Platform where users watch live streams, chat in real time, and interact with streamers.",
    image: "/Projects/Acelive.png",
    tech: ["React.js","KeystoneJS","TypeScript","Supabase","GraphQL"],
    platform: "all",
    demo: "https://acelive.cc/",
  },
];

const platformMeta: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  mobile: { icon: Smartphone, label: "Mobile",       color: "text-orange-400 border-orange-500/40 bg-orange-500/10" },
  web:    { icon: Globe,      label: "Web",           color: "text-blue-400  border-blue-500/40  bg-blue-500/10" },
  all:    { icon: Monitor,    label: "Web + Mobile",  color: "text-orange-300 border-orange-400/40 bg-orange-400/10" },
};

function ProjectCard({ project, large = false, idx = 0 }: { project: typeof projects[0]; large?: boolean; idx?: number }) {
  const [hovered, setHovered] = useState(false);
  const pm = platformMeta[project.platform];

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: idx * 0.07, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`group relative forge-card rounded-2xl overflow-hidden ${large ? "lg:col-span-2 lg:row-span-1" : ""}`}
    >
      {/* Platform border accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${project.platform === "web" ? "bg-blue-500" : "bg-orange-500"}`} />

      {/* Image */}
      <div className={`relative overflow-hidden ${large ? "h-52 sm:h-64" : "h-40"}`}>
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

        {/* Platform badge */}
        <span className={`absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-mono-alt ${pm.color}`}>
          <pm.icon className="h-2.5 w-2.5" />
          {pm.label}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 pl-7">
        <p className="text-[10px] font-mono-alt text-muted-foreground mb-1">{project.type}</p>
        <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">{project.description}</p>

        {/* Tech tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tech.map((t) => <span key={t} className="tech-tag">{t}</span>)}
        </div>

        {/* Links */}
        <div className="flex items-center gap-3">
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline underline-offset-4"
          >
            Live Demo <ExternalLink className="h-3 w-3" />
          </a>
          {project.companyLink && (
            <a
              href={project.companyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Website <ChevronRight className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export const Projects = () => {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-28 relative overflow-hidden" ref={ref}>
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-orange-500/6 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <p className="section-label mb-3">03 — Work</p>
          <h2 className="font-display text-4xl sm:text-5xl font-extrabold mb-3">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <div className="forge-line" />
          <p className="text-muted-foreground text-sm max-w-lg">
            7 products shipped across mobile &amp; web — real-time, social, enterprise, and streaming.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">
          {/* Featured first project spans 2 cols */}
          <ProjectCard project={projects[0]} large idx={0} />
          {projects.slice(1).map((p, i) => (
            <ProjectCard key={p.title} project={p} idx={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
};
