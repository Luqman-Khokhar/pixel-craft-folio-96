import { useState } from "react";
import { motion } from "framer-motion";
import { HeroSection4 } from "@/components/HeroSection4";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import AnimatedCharacter from "@/components/AnimatedCharacter";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { FloatingActionMenu } from "@/components/ui/FloatingActionMenu";
import { DynamicIslandNav } from "@/components/ui/DynamicIslandNav";

const sectionWrap =
  "relative isolate before:pointer-events-none before:absolute before:inset-0 before:-z-10 " +
  "before:bg-[radial-gradient(ellipse_at_top,hsl(290_90%_60%/0.08),transparent_60%)]";

const Theme4 = () => {
  const [showBee, setShowBee] = useState(false);
  const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);

  return (
    <div
      style={{ cursor: 'url("/cursor.png") 16 16, auto' }}
      className="relative min-h-screen bg-[hsl(240_30%_4%)] text-white"
    >
      {/* Global cyber ambient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_10%,hsl(290_90%_60%/0.10),transparent_50%),radial-gradient(circle_at_85%_30%,hsl(190_95%_55%/0.10),transparent_55%),radial-gradient(circle_at_50%_95%,hsl(330_90%_60%/0.08),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(190 95% 70%) 1px, transparent 1px), linear-gradient(90deg, hsl(290 90% 70%) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
      </div>

      <DynamicIslandNav />

      <main>
        <HeroSection4 />

        {[
          { id: "skills", node: <Skills /> },
          { id: "projects", node: <Projects /> },
          { id: "experience", node: <Experience /> },
          { id: "contact", node: <Contact /> },
        ].map((s, i) => (
          <motion.section
            key={s.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className={sectionWrap}
          >
            {s.node}
          </motion.section>
        ))}
      </main>

      <Footer />

      <FloatingActionMenu
        isThemeCustomizerOpen={isThemeCustomizerOpen}
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

export default Theme4;
