import { ExternalLink, Github, Link } from "lucide-react"
import { Button } from "./button"
import { motion } from "framer-motion";
  const ProjectCard = ({ project, index, isInView }) => {
    return (
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
                {project?.github && (
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      Code
                    </a>
                  </Button>
                )}
                {project?.companyLink && (
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a
                      href={project.companyLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Link className="h-4 w-4 mr-2" />
                      Company Link
                    </a>
                  </Button>
                )}
                <Button size="sm" className="flex-1 bg-gradient-primary" asChild>
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
    )
  }