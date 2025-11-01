"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ExternalLink,
  Github,
  Link as LinkIcon,
  Monitor,
  MonitorSmartphone,
  Smartphone,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProjectCardModal = ({ project, index }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Project Card */}
      <motion.div
        key={project.title}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group cursor-pointer"
        onClick={() => setOpen(true)}
        role="button"
        aria-label={`Open ${project.title} details`}
      >
        <div className="relative bg-card border border-border rounded-2xl overflow-hidden h-full hover:border-primary/50 transition-all duration-300">
          <div className="relative overflow-hidden h-48 p-4 flex items-center justify-center bg-muted/40">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pointer-events-none">
              <p className="text-white text-sm mb-4 tracking-wide font-medium animate-slide-up">
                Click to View Details
              </p>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold">{project.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{project.type}</p>
          </div>
        </div>
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 px-4 sm:px-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg sm:max-h-[85vh] overflow-y-auto p-6 relative scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
                onClick={() => setOpen(false)}
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Modal Content */}
              <div className="flex flex-col gap-4 mt-2">
                <div className="flex justify-center">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full max-w-[260px] h-auto object-contain rounded-lg"
                  />
                </div>

                <div className="text-center sm:text-left">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <h2 className="text-2xl font-bold">{project.title}</h2>
                    <div className="flex justify-center sm:justify-end">
                      {project?.platform === "mobile" ? (
                        <Smartphone className="h-6 w-6" />
                      ) : project?.platform === "web" ? (
                        <Monitor className="h-6 w-6" />
                      ) : project?.platform === "all" ? (
                        <MonitorSmartphone className="h-6 w-6" />
                      ) : null}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{project.type}</p>
                </div>

                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base text-justify">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.tech?.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full border border-border"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-4">
                  {project?.github && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" /> Code
                      </a>
                    </Button>
                  )}
                  {project?.companyLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.companyLink} target="_blank" rel="noopener noreferrer">
                        <LinkIcon className="h-4 w-4 mr-2" /> Company
                      </a>
                    </Button>
                  )}
                  {project?.demo && (
                    <Button size="sm" className="bg-rainbow" asChild>
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" /> Demo
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
