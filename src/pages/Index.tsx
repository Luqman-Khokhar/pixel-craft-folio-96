import { useState, useEffect, lazy, Suspense } from "react";
import { SiteNav } from "@/components/site/SiteNav";
import { Preloader } from "@/components/site/Preloader";
import { HeroStage } from "@/components/site/HeroStage";
import { AboutSection } from "@/components/site/AboutSection";
import { SkillsIndex } from "@/components/site/SkillsIndex";
import { ProjectsOrbit } from "@/components/site/ProjectsOrbit";
import { ExperienceYears } from "@/components/site/ExperienceYears";
import { ContactFinale } from "@/components/site/ContactFinale";
import { CursorRing } from "@/components/site/CursorRing";
import { initSmoothWheel } from "@/lib/smoothScroll";
const AnimatedCharacter = lazy(() => import("@/components/AnimatedCharacter"));
const Index = () => {
  const [showBee, setShowBee] = useState<boolean>(() => {
    try {
      return localStorage.getItem("bee-guide") !== "off";
    } catch {
      return true;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("bee-guide", showBee ? "on" : "off");
    } catch {
      /* storage unavailable: preference just won't persist */
    }
  }, [showBee]);
  const [ready, setReady] = useState(false);
  useEffect(() => initSmoothWheel(), []);
  return (

    <div className="min-h-screen relative [overflow-x:clip]">
      <Preloader onDone={() => setReady(true)} />
      <div aria-hidden="true" className="grain pointer-events-none fixed inset-0 z-40" />
      <CursorRing />
      <SiteNav beeOn={showBee} onToggleBee={() => setShowBee((prev) => !prev)} />
      <main>
        <HeroStage ready={ready} />
        <AboutSection />
        <SkillsIndex />
        <ProjectsOrbit />
        <ExperienceYears />
        <ContactFinale />
      </main>

      {/* <Button
        tooltip="CV Download"
        tooltipSide="left"
        tooltipClassName="bg-green-800 text-white px-3 py-1 rounded"
        size="icon"
        className="fixed bottom-36 right-6 bg-green-700 hover:bg-green-900 text-white rounded-full shadow-lg p-2 transition-all duration-300 flex items-center justify-center z-[9999]"
      >
        <a
          href="/CV/Muhammad_Luqman_CV_(31Oct2025).pdf.pdf"
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
      {ready && showBee && (
        <Suspense fallback={null}>
          <AnimatedCharacter />
        </Suspense>
      )}

    </div>
  );
};

export default Index;
