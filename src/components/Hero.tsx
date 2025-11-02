import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "@/assets/animations/sleepingCat.json";
import { InactivityAnimation } from "./ui/inActivityAnimation";


export const Hero = () => {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-16"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-subtle opacity-50" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,hsl(217,91%,60%,0.1),transparent)]" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className=" relative text-center max-w-4xl mx-auto">
          <div className="absolute top-[-135px] left-12">
            {/* <Lottie animationData={animationData} loop={true} style={{ width: 200, height: 200 }} /> */}
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              Hi, I'm{" "}
              <span className="rainbow bg-clip-text text-transparent">
                Muhammad Luqman Khokhar
              </span>
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl lg:text-4xl font-semibold mb-8 h-20"
          >
            <TypeAnimation
              sequence={[
                "React.js Developer",
                2000,
                "React Native Developer",
                2000,
                "Web Developer",
                2000,
                "Mobile App Developer",
                2000,
                "Full Stack Developer",
                2000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="text-muted-foreground"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          >
            Crafting beautiful, performant, and user-friendly applications with modern
            technologies. Specialized in React ecosystem and mobile development.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <Button
              size="lg"
              className="bg-rainbow hover:opacity-90 transition-opacity shadow-glow"
              onClick={() => scrollToSection("#contact")}
            >
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#projects")}
            >
              View My Work
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="flex items-center justify-center gap-6"
          >
            <a
              href="https://github.com/Luqman-Khokhar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Github className="h-6 w-6" />
            </a>
            <a
              href="https://www.linkedin.com/in/mluqmangn/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a
              href="mailto:mluqmangn@gmail.com"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <Mail className="h-6 w-6" />
            </a>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-2 left-1/2 transform -translate-x-1/2"
      >
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </motion.div>
    </section>
  );
};
