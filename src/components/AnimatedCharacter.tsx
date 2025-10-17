import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";

// Character states with Lottie animations and speech bubbles
const characterStates = {
  home: {
    lottieUrl: "https://lottie.host/b7e4b2e6-8e3f-4d6b-9c5e-1d8f7a4c2b3e/K9x8y7w6v5.json",
    speech: "Hi there! Welcome to my portfolio 👋",
    fallbackEmoji: "👋"
  },
  about: {
    lottieUrl: "https://lottie.host/c8f5c3f7-9f4f-5e7c-0d6f-2e9g8b5d3c4f/L0y9z8x7w6.json",
    speech: "Let me tell you about myself 😊",
    fallbackEmoji: "🙋‍♂️"
  },
  skills: {
    lottieUrl: "https://lottie.host/d9g6d4g8-0g5g-6f8d-1e7g-3f0h9c6e4d5g/M1z0a9y8x7.json",
    speech: "Check out my tech stack! 💻",
    fallbackEmoji: "👨‍💻"
  },
  projects: {
    lottieUrl: "https://lottie.host/e0h7e5h9-1h6h-7g9e-2f8h-4g1i0d7f5e6h/N2a1b0z9y8.json",
    speech: "Building awesome things! 🚀",
    fallbackEmoji: "🛠️"
  },
  experience: {
    lottieUrl: "https://lottie.host/f1i8f6i0-2i7i-8h0f-3g9i-5h2j1e8g6f7i/O3b2c1a0z9.json",
    speech: "My journey so far 📈",
    fallbackEmoji: "💼"
  },
  contact: {
    lottieUrl: "https://lottie.host/g2j9g7j1-3j8j-9i1g-4h0j-6i3k2f9h7g8j/P4c3d2b1a0.json",
    speech: "Let's connect! 📱",
    fallbackEmoji: "📞"
  }
};

type SectionType = keyof typeof characterStates;

// Fallback emoji animations for when Lottie fails to load
const fallbackAnimations = {
  wave: {
    rotate: [0, 14, -8, 14, -4, 10, 0],
    transition: { duration: 1.5, repeat: Infinity, repeatDelay: 2 }
  },
  bounce: {
    y: [0, -10, 0],
    transition: { duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }
  },
  pulse: {
    scale: [1, 1.1, 1],
    transition: { duration: 1, repeat: Infinity, repeatDelay: 1 }
  }
};

export const AnimatedCharacter = () => {
  const [activeSection, setActiveSection] = useState<SectionType>("home");
  const [showSpeech, setShowSpeech] = useState(true);
  const [lottieData, setLottieData] = useState<any>(null);
  const [useFallback, setUseFallback] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load Lottie animation when section changes
  useEffect(() => {
    const loadLottieAnimation = async () => {
      setIsLoading(true);
      const currentState = characterStates[activeSection];
      
      try {
        const response = await fetch(currentState.lottieUrl);
        if (!response.ok) throw new Error("Failed to load animation");
        const data = await response.json();
        setLottieData(data);
        setUseFallback(false);
      } catch (error) {
        console.warn("Failed to load Lottie animation, using fallback:", error);
        setUseFallback(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadLottieAnimation();
  }, [activeSection]);

  // Intersection Observer to detect active section
  useEffect(() => {
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
            setTimeout(() => setShowSpeech(false), 3000);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    const sections = ["home", "about", "skills", "projects", "experience", "contact"];
    sections.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) observer.observe(element);
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

      {/* Character Container - Desktop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
          transition={{ 
            duration: 0.5, 
            type: "spring", 
            stiffness: 200,
            damping: 20
          }}
          className="relative"
        >
          <div className="relative w-32 h-32 lg:w-40 lg:h-40">
            {/* Glow effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-primary rounded-full blur-2xl opacity-30"
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Character background */}
            <div className="relative bg-card/90 backdrop-blur-sm border-2 border-primary/30 rounded-full p-4 shadow-glow flex items-center justify-center overflow-hidden">
              {!isLoading && !useFallback && lottieData ? (
                <Lottie
                  animationData={lottieData}
                  loop={true}
                  className="w-full h-full"
                />
              ) : (
                <motion.div
                  className="text-6xl lg:text-7xl"
                  animate={fallbackAnimations.pulse}
                >
                  {currentState.fallbackEmoji}
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Mobile version - smaller and in bottom right */}
      <motion.div
        className="md:hidden fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-16 h-16 bg-card/90 backdrop-blur-sm border-2 border-primary/30 rounded-full p-2 shadow-lg flex items-center justify-center overflow-hidden"
          >
            {!isLoading && !useFallback && lottieData ? (
              <Lottie
                animationData={lottieData}
                loop={true}
                className="w-full h-full"
              />
            ) : (
              <motion.div 
                className="text-3xl"
                animate={fallbackAnimations.bounce}
              >
                {currentState.fallbackEmoji}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};
