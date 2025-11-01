"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export const DynamicIslandNav = () => {
  const [expanded, setExpanded] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(!isDark);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

return (
  <motion.div
    initial={{ y: -40, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    onMouseEnter={() => setExpanded(true)}
    onMouseLeave={() => setExpanded(false)}
    className="fixed top-6 right-6 z-50 flex justify-end"
  >
    <motion.div
      layout
      animate={{
        width: expanded ? (window.innerWidth < 640 ? 220 : 720) : 90,
        height: expanded
          ? window.innerWidth < 640
            ? 380
            : 56
          : 40,
    transition: {
      type: "spring",
      stiffness: 300,   // ⬆️ faster spring
      damping: 18,      // ⬇️ less bounce resistance
      mass: 0.5,
      duration: 0.25,   // ⬆️ shortens total time
    },
      }}
      className="relative flex flex-col sm:flex-row items-center justify-center bg-background/90 backdrop-blur-2xl border border-border shadow-lg shadow-orange-500/10 rounded-2xl sm:rounded-full overflow-hidden p-2 sm:p-0"
    >
      <AnimatePresence mode="wait">
        {expanded ? (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 18,
               duration: 0.25,
            }}
            className="flex flex-col sm:flex-row items-center justify-center sm:space-x-4 space-y-2 sm:space-y-0 px-4 py-2"
          >
            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                size="sm"
                onClick={() => scrollToSection(item.href)}
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                {item.name}
              </Button>
            ))}

            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button
              variant="default"
              size="sm"
              className="ml-0 sm:ml-1 flex items-center gap-1"
            >
              <Download className="h-4 w-4" />
              <span>CV</span>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{
              type: "spring",
              stiffness: 170,
              damping: 20,
            }}
            className="flex items-center gap-2 px-4 py-2 cursor-pointer"
          >
            <Menu className="h-5 w-5 text-primary" />
            <span className="text-sm font-semibold">Menu</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  </motion.div>
);

};
