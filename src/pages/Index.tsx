import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import AnimatedCharacter from "@/components/AnimatedCharacter";
import NoticeBar from "@/components/NoticeBar";

const Index = () => {
  const [showBee, setShowBee] = useState(false);
  return (

    <div className="min-h-screen relative">
       <NoticeBar />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />

      {/* 🐝 Bee Animation */}
      {showBee && <AnimatedCharacter />}

      {/* 🟡 Floating Toggle Button */}
      <button
        onClick={() => setShowBee((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full shadow-lg p-2 transition-all duration-300 flex items-center justify-center z-[9999]"
        aria-label="Toggle Bee"
      >
        🐝
      </button>

    </div>
  );
};

export default Index;
