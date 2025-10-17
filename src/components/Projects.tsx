import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "E-Commerce Mobile App",
    description: "Full-featured mobile e-commerce application with shopping cart, payment integration, and order tracking.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
    tech: ["React Native", "TypeScript", "Firebase", "Stripe"],
    github: "https://github.com/yourusername/project",
    demo: "https://demo.example.com",
  },
  {
    title: "Task Management Dashboard",
    description: "Modern task management application with real-time collaboration, drag-and-drop, and team features.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop",
    tech: ["React.js", "Next.js", "Tailwind CSS", "PostgreSQL"],
    github: "https://github.com/yourusername/project",
    demo: "https://demo.example.com",
  },
  {
    title: "Social Media Platform",
    description: "Feature-rich social networking platform with posts, comments, likes, and real-time messaging.",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
    tech: ["React.js", "Node.js", "MongoDB", "Socket.io"],
    github: "https://github.com/yourusername/project",
    demo: "https://demo.example.com",
  },
  {
    title: "Weather Forecast App",
    description: "Beautiful weather application with location-based forecasts, interactive maps, and detailed metrics.",
    image: "https://images.unsplash.com/photo-1592210454359-9043f067919b?w=600&h=400&fit=crop",
    tech: ["React Native", "Redux", "Weather API", "Maps"],
    github: "https://github.com/yourusername/project",
    demo: "https://demo.example.com",
  },
  {
    title: "Portfolio CMS",
    description: "Content management system for portfolios with drag-and-drop builder and customizable themes.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    tech: ["React.js", "Express", "PostgreSQL", "AWS"],
    github: "https://github.com/yourusername/project",
    demo: "https://demo.example.com",
  },
  {
    title: "Fitness Tracking App",
    description: "Mobile fitness application with workout plans, progress tracking, and health analytics.",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop",
    tech: ["React Native", "TypeScript", "Health APIs", "Charts"],
    github: "https://github.com/yourusername/project",
    demo: "https://demo.example.com",
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
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
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
                      <Button
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
                      </Button>
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
