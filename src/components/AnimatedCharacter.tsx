import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// Character states with animation data and speech bubbles
const characterStates = {
  home: {
    animation: "https://lottie.host/4b6d6f8e-df9d-4c9e-8f3a-3e3d0b9c6f9e/1gXJ0J3Y7D.json",
    speech: "Hi there! 👋",
    fallback: "👋"
  },
  about: {
    animation: "https://lottie.host/8e8f8f8e-8f8f-4f8f-8f8f-8f8f8f8f8f8f/1gXJ0J3Y7D.json",
    speech: "Let me tell you about myself",
    fallback: "🙋‍♂️"
  },
  skills: {
    animation: "https://lottie.host/2c8f8f8e-8f8f-4f8f-8f8f-8f8f8f8f8f8f/1gXJ0J3Y7D.json",
    speech: "Check out my tech stack! 💻",
    fallback: "👨‍💻"
  },
  projects: {
    animation: "https://lottie.host/5d8f8f8e-8f8f-4f8f-8f8f-8f8f8f8f8f8f/1gXJ0J3Y7D.json",
    speech: "Building awesome things! 🚀",
    fallback: "🛠️"
  },
  experience: {
    animation: "https://lottie.host/6e8f8f8e-8f8f-4f8f-8f8f-8f8f8f8f8f8f/1gXJ0J3Y7D.json",
    speech: "My journey so far 📈",
    fallback: "💼"
  },
  contact: {
    animation: "https://lottie.host/7f8f8f8e-8f8f-4f8f-8f8f-8f8f8f8f8f8f/1gXJ0J3Y7D.json",
    speech: "Let's connect! 📱",
    fallback: "📞"
  }
};

type SectionType = keyof typeof characterStates;

export const AnimatedCharacter = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("home");
  const [showSpeech, setShowSpeech] = useState(true);
  const [animationError, setAnimationError] = useState(false);

  useEffect(() => {
    // Create Intersection Observer to detect active section
    const observerOptions = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id as SectionType;
          if (sectionId && characterStates[sectionId]) {
            setActiveSection(sectionId);
            setShowSpeech(true);
            // Hide speech bubble after 3 seconds
            setTimeout(() => setShowSpeech(false), 3000);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all sections
    const sections = ["home", "about", "skills", "projects", "experience", "contact"];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const currentState = characterStates[activeSection];

  return (
    <motion.div
      className="fixed bottom-8 right-8 z-50 hidden md:block"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
    >
      {/* Speech Bubble */}
      <AnimatePresence>
        {showSpeech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-full right-0 mb-4 mr-4"
          >
            <div className="relative bg-card border border-border rounded-2xl px-4 py-3 shadow-xl">
              <p className="text-sm font-medium whitespace-nowrap">
                {currentState.speech}
              </p>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-card border-r border-b border-border transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Character Container */}
      <motion.div
        key={activeSection}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
        className="relative"
      >
        <div className="relative w-32 h-32 lg:w-40 lg:h-40">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-30 animate-pulse" />
          
          {/* Character background */}
          <div className="relative bg-card border-2 border-primary/30 rounded-full p-4 shadow-glow">
            {!animationError ? (
              <Lottie
                animationData={currentState.animation}
                loop={true}
                className="w-full h-full"
                onError={() => setAnimationError(true)}
              />
            ) : (
              // Fallback emoji if Lottie fails to load
              <div className="w-full h-full flex items-center justify-center text-6xl">
                {currentState.fallback}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Mobile version - smaller and in bottom right */}
      <motion.div
        className="md:hidden fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-16 h-16 bg-card border-2 border-primary/30 rounded-full p-2 shadow-lg flex items-center justify-center text-3xl">
          {currentState.fallback}
        </div>
      </motion.div>
    </motion.div>
  );
};
