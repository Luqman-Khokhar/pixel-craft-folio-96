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
import { Button } from "@/components/ui/button";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { FloatingActionMenu } from "@/components/ui/FloatingActionMenu";


const Index = () => {
  const [showBee, setShowBee] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
  return (

    <div
      style={{
        cursor: 'url("/cursor.png") 16 16, auto', // 16 16 = hotspot position
      }}
      className="min-h-screen relative"
    >
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

      {/* <Button
        tooltip="CV Download"
        tooltipSide="left"
        tooltipClassName="bg-green-800 text-white px-3 py-1 rounded"
        size="icon"
        className="fixed bottom-36 right-6 bg-green-700 hover:bg-green-900 text-white rounded-full shadow-lg p-2 transition-all duration-300 flex items-center justify-center z-[9999]"
      >
        <a
          href="/CV/Muhammad_Luqman_CV_(30Oct2025).pdf.pdf"
          download="Muhammad_Luqman_CV.pdf"
        >
          <FileDown  className="h-5 w-5" />
        </a>
      </Button>
      <Button
        tooltip="Customize Theme Colors"
        tooltipSide="left"
        tooltipClassName="bg-blue-800 text-white px-3 py-1 rounded"
        size="icon"
        onClick={() => setIsThemeCustomizerOpen(true)}
        className="fixed bottom-20 right-6 bg-blue-700 hover:bg-blue-900 text-white rounded-full shadow-lg p-2 transition-all duration-300 flex items-center justify-center z-[9999]"
      // title="Customize Theme"
      >
        <Palette className="h-5 w-5" />
      </Button>
      <Button
        tooltip="3D Bee Model"
        tooltipSide="left"
        tooltipClassName="bg-yellow-800 text-white px-3 py-1 rounded"
        size="icon"
        onClick={() => setShowBee((prev) => !prev)}
        className="fixed bottom-6 right-6 bg-yellow-400 hover:bg-yellow-600 text-black rounded-full shadow-lg p-2 transition-all duration-300 flex items-center justify-center z-[9999]"
      >
        🐝
      </Button> */}
      <FloatingActionMenu
        setIsThemeCustomizerOpen={setIsThemeCustomizerOpen}
        setShowBee={setShowBee}
      />
      <ThemeCustomizer
        open={isThemeCustomizerOpen}
        onOpenChange={setIsThemeCustomizerOpen}
      />
      {showBee && <AnimatedCharacter followCursor={true} />}

    </div>
  );
};

export default Index;
