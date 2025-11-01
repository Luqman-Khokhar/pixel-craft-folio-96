import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ProjectCardModal } from "./ui/ProjectCardModel";

const projects = [
  {
    title: "Chirpbyte",
    type: "Customer Support & Engagement App",
    description: "A mobile app for chatting with website/social visitors, handling their issues, and scheduling meetings.",
    image: "/Projects/Chirpbyte.png",
    tech: ["React Native", "Notifee", "Socket.io", "Pusher"],
    // github: "https://github.com/yourusername/project",
    platform:"mobile",
    companyLink: "https://chirpbyte.com/",
    demo: "https://play.google.com/store/apps/details?id=com.chirpbyte&hl=en",
  },
  {
    title: "Skip2Beat",
    type: "Social Fitness & Workout Tracking App",
    description: "A fitness app that combines guided 7-minute workouts with music, real-time chat, and geolocation to connect, compete, and stay motivated with friends.",
    image: "/Projects/Skip2beat.png",
    tech: ["React Native", "Socket.io", "Google Map"],
    // github: "https://github.com/yourusername/project",
    platform:"mobile",
    companyLink: "https://skip2beat.com.au/",
    demo: "https://play.google.com/store/apps/details?id=com.skip2beat.app&hl=en",
  },
  {
    title: "Kroolo",
    type: "Management & Team Collaboration App",
    description: "A project management platform that lets teams organize tasks, manage roles, and collaborate through real-time chat and group communication.",
    image: "/Projects/Kroolo.svg",
    tech: ["React Native", "Socket.io", "Firebase", "Google / Apple / Facebook Login",],
    companyLink: "https://kroolo.com/",
    platform:"mobile",
    demo: "https://play.google.com/store/search?q=kroolo&c=apps&hl=en",
  },
  {
    title: "Health In Mobile",
    type: "Health & Fitness Motivation App",
    description: "A mobile app designed to encourage healthy habits through motivation and guided lifestyle changes to prevent and manage chronic diseases.",
    image: "/Projects/Acelive.png",
    tech: ["Expo React Native", "Keystone js", "Google Magic Link",],
    platform:"mobile",
    demo: "https://play.google.com/store/apps/details?id=org.hksr.healthinmobile&hl=en",
  },
  {
    title: "AlSalaam Tourism",
    type: "Tour & Event Booking Web Application",
    description: "A tour and event booking platform that lets users discover, compare, and book curated travel experiences.",
    image: "/Projects/Alsalaam.png",
    platform:"all",
    tech: ["Next JS", "Tailwind Css", "Ant Design",],
    demo: "https://alsalaamtourism.com/",
  },
  {
    title: "Primax Portal",
    type: "Role-Based Data Management Web Application",
    description: "A web platform that allows admins, brokers, telemarketers, account managers, and data managers to manage, track, and organize business data efficiently.",
    image: "/Projects/Primax.png",
    platform:"web",
    tech: ["Laravel", "Vite", "Boostrap", "MySQL"],
    demo: "https://primaxportal.com/login",
  },
  {
    title: "Ace Live",
    type: "Live Streaming & Interactive Chat Web Application",
    description: "A platform where users can watch live streams, chat in real time, and interact with streamers who can manage or promote participants.",
    image: "/Projects/Acelive.png",
    platform:"all",
    tech: ["React JS", "Keystone JS", "TypeScript", "OBS software", "Supabase", "Graphql", "Prisma", "MySQL"],
    demo: "https://acelive.cc/",
  },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [visibleCount, setVisibleCount] = useState(3);

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 3);
  };
  const handleShowLess = () => {
    setVisibleCount(3);
  };
  return (
    <section id="projects"  className="py-20 bg-muted/30 relative w-full overflow-x-hidden" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Featured <span className="rainbow bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-rainbow mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto overflow-hidden">
          {projects.slice(0, visibleCount).map((project, index) => (
            <ProjectCardModal project={project} index={index} key={project.title} />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="group"
        >
          <div className="flex justify-center items-center gap-4 mt-8">
            {visibleCount < projects.length && (
              <Button onClick={handleViewMore} className="bg-rainbow">
                View More
              </Button>
            )}
            {visibleCount > 3 && (
              <Button onClick={handleShowLess} className="bg-rainbow">
                Show Less
              </Button>
            )}
          </div>
        </motion.div>
      </div >
    </section >
  );
};
