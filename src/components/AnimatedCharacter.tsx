import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Character states with emojis and speech bubbles
// You can replace these with Lottie animation URLs when you have them
const characterStates = {
  home: {
    emoji: "👋",
    speech: "Hi there! 👋",
    animation: "wave"
  },
  about: {
    emoji: "🙋‍♂️",
    speech: "Let me tell you about myself",
    animation: "bounce"
  },
  skills: {
    emoji: "👨‍💻",
    speech: "Check out my tech stack! 💻",
    animation: "pulse"
  },
  projects: {
    emoji: "🛠️",
    speech: "Building awesome things! 🚀",
    animation: "rotate"
  },
  experience: {
    emoji: "💼",
    speech: "My journey so far 📈",
    animation: "float"
  },
  contact: {
    emoji: "📞",
    speech: "Let's connect! 📱",
    animation: "shake"
  }
};

type SectionType = keyof typeof characterStates;

// Animation variants for different character states
const emojiAnimations = {
  wave: {
    rotate: [0, 14, -8, 14, -4, 10, 0],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatDelay: 2
    }
  },
  bounce: {
    y: [0, -10, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatDelay: 1.5
    }
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatDelay: 1
    }
  },
  rotate: {
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 1
    }
  },
  float: {
    y: [0, -8, 0],
    x: [0, 3, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  shake: {
    x: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatDelay: 3
    }
  }
};

export const AnimatedCharacter = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("home");
  const [showSpeech, setShowSpeech] = useState(true);

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
          <div className="relative bg-card border-2 border-primary/30 rounded-full p-4 shadow-glow flex items-center justify-center">
            {/* Animated emoji character */}
            <motion.div
              className="text-6xl lg:text-7xl"
              animate={emojiAnimations[currentState.animation]}
            >
              {currentState.emoji}
            </motion.div>
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
        <div className="w-16 h-16 bg-card border-2 border-primary/30 rounded-full p-2 shadow-lg flex items-center justify-center">
          <motion.div 
            className="text-3xl"
            animate={emojiAnimations[currentState.animation]}
          >
            {currentState.emoji}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
