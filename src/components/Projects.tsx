import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Chirpbyte",
    type: "Customer Support & Engagement App",
    description: "A mobile app for chatting with website/social visitors, handling their issues, and scheduling meetings.",
    image: "/Projects/Chirpbyte.png",
    tech: ["React Native", "Notifee", "Socket.io", "Pusher"],
    // github: "https://github.com/yourusername/project",
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
    companyLink: "https://skip2beat.com.au/",
    demo: "https://play.google.com/store/apps/details?id=com.skip2beat.app&hl=en",
  },
  {
    title: "Kroolo",
    type: "Management & Team Collaboration App",
    description: "A project management platform that lets teams organize tasks, manage roles, and collaborate through real-time chat and group communication.",
    image: "/Projects/Kroolo.png",
    tech: ["React Native", "Socket.io", "Firebase", "Google / Apple / Facebook Login",],
    companyLink: "https://kroolo.com/",
    demo: "https://play.google.com/store/search?q=kroolo&c=apps&hl=en",
  },
  {
    title: "AlSalaam Tourism",
    type: "Tour & Event Booking Web Application",
    description: "A tour and event booking platform that lets users discover, compare, and book curated travel experiences.",
    image: "/Projects/Alsalaam.png",
    tech: ["Next JS", "Tailwind Css", "Ant Design",],
    demo: "https://alsalaamtourism.com/",
  },
  {
    title: "Primax Portal",
    type: "Role-Based Data Management Web Application",
    description: "A web platform that allows admins, brokers, telemarketers, account managers, and data managers to manage, track, and organize business data efficiently.",
    image: "/Projects/Primax.png",
    tech: ["Laravel", "Vite", "Boostrap", "MySQL"],
    demo: "https://primaxportal.com/login",
  },
  {
    title: "Ace Live",
    type: "Live Streaming & Interactive Chat Web Application",
    description: "A platform where users can watch live streams, chat in real time, and interact with streamers who can manage or promote participants.",
    image: "/Projects/Acelive.png",
    tech: ["React JS", "Keystone JS", "TypeScript", "OBS software", "Supabase", "Graphql", "Prisma", "MySQL"],
    demo: "https://acelive.cc/",
  },
];

export const Projects = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="py-20 bg-muted/30 relative" ref={ref}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Featured <span className="bg-gradient-primary bg-clip-text text-transparent">Projects</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-primary mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-primary rounded-2xl blur-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                <div className="relative bg-card border border-border rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/50 transition-all duration-300">
                  <div className="relative overflow-hidden h-48 p-4">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <h3 className="text-md font-bold mb-2">{project.type}</h3>
                    <p className="text-muted-foreground mb-4 flex-1">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full border border-border"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      {project?.github && <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4 mr-2" />
                          Code
                        </a>
                      </Button>}
                      {project?.companyLink && <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        asChild
                      >
                        <a
                          href={project.companyLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Link  className="h-4 w-4 mr-2" />
                          Company Link
                        </a>
                      </Button>}
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-primary"
                        asChild
                      >
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
