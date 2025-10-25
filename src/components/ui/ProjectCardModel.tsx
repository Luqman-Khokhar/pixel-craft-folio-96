"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Link as LinkIcon, Monitor, MonitorSmartphone, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProjectCardModal = ({ project, index }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setOpen(true)}
            >
                <div className="relative bg-card border border-border rounded-2xl overflow-hidden h-full hover:border-primary/50 transition-all duration-300">
                    <div className="relative overflow-hidden h-48 p-4 flex items-center justify-center bg-muted/40">
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{project.type}</p>
                    </div>
                </div>
            </motion.div>

            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50"
                    onClick={() => setOpen(null)}
                >
                    <motion.div
                        initial={{ y: 50, opacity: 0, scale: 0.95, filter: "blur(6px)" }}
                        animate={{
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                        }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="bg-card border border-border rounded-2xl max-w-lg w-full p-6 relative shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
                            onClick={() => setOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex flex-col gap-4">
                            <div className="flex justify-center">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-56 h-48 object-contain"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between">
                                    <h2 className="text-2xl font-bold">{project.title}</h2>
                                    {project?.platform === 'mobile' ? <Smartphone color="white" /> :
                                        project?.platform === 'web' ? <Monitor /> :
                                            project?.platform === 'all' ? <MonitorSmartphone /> :
                                                ""
                                    }
                                </div>
                                <p className="text-sm text-muted-foreground">{project.type}</p>
                            </div>

                            <p className="text-muted-foreground leading-relaxed">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full border border-border"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3 mt-4">
                                {project?.github && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a href={project.github} target="_blank" rel="noopener noreferrer">
                                            <Github className="h-4 w-4 mr-2" /> Code
                                        </a>
                                    </Button>
                                )}
                                {project?.companyLink && (
                                    <Button variant="outline" size="sm" asChild>
                                        <a
                                            href={project.companyLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <LinkIcon className="h-4 w-4 mr-2" /> Company Link
                                        </a>
                                    </Button>
                                )}
                                <Button size="sm" className="bg-gradient-primary" asChild>
                                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink className="h-4 w-4 mr-2" /> Demo
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};
