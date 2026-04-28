import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ExternalLink, Building2, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const projects = [
  {
    title: "Chirpbyte",
    type: "Customer Support & Engagement App",
    description:
      "A mobile app for chatting with website/social visitors, handling their issues, and scheduling meetings.",
    image: "/Projects/Chirpbyte.png",
    tech: ["React Native", "Notifee", "Socket.io", "Pusher"],
    platform: "mobile",
    companyLink: "https://chirpbyte.com/",
    demo: "https://play.google.com/store/apps/details?id=com.chirpbyte&hl=en",
  },
  {
    title: "Skip2Beat",
    type: "Social Fitness & Workout Tracking App",
    description:
      "A fitness app that combines guided 7-minute workouts with music, real-time chat, and geolocation to connect, compete, and stay motivated with friends.",
    image: "/Projects/Skip2beat.png",
    tech: ["React Native", "Socket.io", "Google Map"],
    platform: "mobile",
    companyLink: "https://skip2beat.com.au/",
    demo: "https://play.google.com/store/apps/details?id=com.skip2beat.app&hl=en",
  },
  {
    title: "Kroolo",
    type: "Management & Team Collaboration App",
    description:
      "A project management platform that lets teams organize tasks, manage roles, and collaborate through real-time chat and group communication.",
    image: "/Projects/Kroolo.svg",
    tech: ["React Native", "Socket.io", "Firebase", "Google / Apple / Facebook Login"],
    companyLink: "https://kroolo.com/",
    platform: "mobile",
    demo: "https://play.google.com/store/search?q=kroolo&c=apps&hl=en",
  },
  {
    title: "Health In Mobile",
    type: "Health & Fitness Motivation App",
    description:
      "A mobile app designed to encourage healthy habits through motivation and guided lifestyle changes to prevent and manage chronic diseases.",
    image: "/Projects/Acelive.png",
    tech: ["Expo React Native", "Keystone js", "Google Magic Link"],
    platform: "mobile",
    demo: "https://play.google.com/store/apps/details?id=org.hksr.healthinmobile&hl=en",
  },
  {
    title: "AlSalaam Tourism",
    type: "Tour & Event Booking Web Application",
    description:
      "A tour and event booking platform that lets users discover, compare, and book curated travel experiences.",
    image: "/Projects/Alsalaam.png",
    platform: "all",
    tech: ["Next JS", "Tailwind Css", "Ant Design"],
    demo: "https://alsalaamtourism.com/",
  },
  {
    title: "Primax Portal",
    type: "Role-Based Data Management Web Application",
    description:
      "A web platform that allows admins, brokers, telemarketers, account managers, and data managers to manage, track, and organize business data efficiently.",
    image: "/Projects/Primax.png",
    platform: "web",
    tech: ["Laravel", "Vite", "Boostrap", "MySQL"],
    demo: "https://primaxportal.com/login",
  },
  {
    title: "Ace Live",
    type: "Live Streaming & Interactive Chat Web Application",
    description:
      "A platform where users can watch live streams, chat in real time, and interact with streamers who can manage or promote participants.",
    image: "/Projects/Acelive.png",
    platform: "all",
    tech: ["React JS", "Keystone JS", "TypeScript", "OBS software", "Supabase", "Graphql", "Prisma", "MySQL"],
    demo: "https://acelive.cc/",
  },
];

const accentForIndex = (i: number) =>
  ["190 95% 60%", "290 90% 65%", "330 90% 65%", "217 91% 65%", "262 83% 65%", "160 85% 55%"][i % 6];

const TiltCard = ({ project, index }: { project: typeof projects[number]; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });
  const color = accentForIndex(index);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    setT({ rx: (0.5 - py) * 8, ry: (px - 0.5) * 10 });
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08 }}
      style={{ perspective: 1200 }}
      className="group"
    >
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={() => setT({ rx: 0, ry: 0 })}
        className="relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl transition-all duration-300 group-hover:border-white/25"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transformStyle: "preserve-3d",
          boxShadow: `0 20px 60px -20px hsl(${color}/0.3)`,
        }}
      >
        {/* Cursor light */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
          style={{
            background: `radial-gradient(400px circle at var(--mx,50%) var(--my,50%), hsl(${color}/0.18), transparent 40%)`,
          }}
        />

        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[hsl(240_30%_8%)]">
          <div className="absolute inset-0 bg-gradient-to-br opacity-30" style={{ background: `linear-gradient(135deg, hsl(${color}/0.4), transparent 60%)` }} />
          <img
            src={project.image}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="pointer-events-none absolute inset-0 [background:repeating-linear-gradient(0deg,transparent_0px,transparent_3px,hsl(190_95%_70%/0.06)_4px,transparent_5px)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(240_30%_4%)] via-transparent to-transparent" />

          {/* Platform tag */}
          <span
            className="absolute left-3 top-3 rounded-md border bg-black/40 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest backdrop-blur-md"
            style={{ borderColor: `hsl(${color}/0.5)`, color: `hsl(${color})` }}
          >
            {project.platform}
          </span>
        </div>

        {/* Body */}
        <div className="relative space-y-4 p-6">
          <div>
            <h3 className="text-xl font-bold text-white">{project.title}</h3>
            <p className="mt-1 text-xs uppercase tracking-widest" style={{ color: `hsl(${color})` }}>
              {project.type}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-white/65 line-clamp-3">{project.description}</p>

          <div className="flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[10px] text-white/70"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-widest text-white transition-all hover:-translate-y-0.5"
              style={{
                borderColor: `hsl(${color}/0.5)`,
                background: `linear-gradient(90deg, hsl(${color}/0.15), transparent)`,
                boxShadow: `0 0 24px -8px hsl(${color}/0.6)`,
              }}
            >
              <ExternalLink className="h-3.5 w-3.5" /> Demo
            </a>
            {project.companyLink && (
              <a
                href={project.companyLink}
                target="_blank"
                rel="noreferrer"
                className="grid h-9 w-9 place-items-center rounded-md border border-white/15 bg-white/5 text-white/80 transition-all hover:text-white hover:bg-white/10"
                aria-label="Company"
              >
                <Building2 className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>

        {/* HUD corners */}
        <span className="pointer-events-none absolute left-2 top-2 h-4 w-4 border-l-2 border-t-2" style={{ borderColor: `hsl(${color})` }} />
        <span className="pointer-events-none absolute right-2 bottom-2 h-4 w-4 border-r-2 border-b-2" style={{ borderColor: `hsl(${color})` }} />
      </div>
    </motion.div>
  );
};

export const ProjectsCyber = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleCount, setVisibleCount] = useState(3);

  return (
    <section id="projects" ref={ref} className="relative w-full overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Archive · 03"
          title="Featured"
          accent="Projects"
          description="A curated transmission of recent missions and live deployments."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, visibleCount).map((p, i) => (
            <TiltCard key={p.title} project={p} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex justify-center gap-3"
        >
          {visibleCount < projects.length && (
            <button
              onClick={() => setVisibleCount((p) => p + 3)}
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-md px-7 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_30px_-8px_hsl(290_90%_60%/0.7)]"
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[hsl(290_90%_55%)] via-[hsl(330_90%_60%)] to-[hsl(190_95%_55%)] bg-[length:200%_100%] animate-[gradient_4s_linear_infinite]" />
              <span className="relative">Load More</span>
              <ArrowUpRight className="relative h-3.5 w-3.5" />
            </button>
          )}
          {visibleCount > 3 && (
            <button
              onClick={() => setVisibleCount(3)}
              className="rounded-md border border-[hsl(190_95%_55%/0.5)] bg-white/5 px-7 py-3 text-xs font-bold uppercase tracking-widest text-[hsl(190_95%_75%)] backdrop-blur-xl transition-all hover:bg-[hsl(190_95%_55%/0.1)]"
              style={{ clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
            >
              Show Less
            </button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ProjectsCyber;
