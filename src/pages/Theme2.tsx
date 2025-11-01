import { useState } from "react";
import { HeroSection2 } from "@/components/HeroSection2";
import { Skills } from "@/components/Skills";
import { Footer } from "@/components/Footer";
import AnimatedCharacter from "@/components/AnimatedCharacter";
import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { FloatingActionMenu } from "@/components/ui/FloatingActionMenu";
import { DynamicIslandNav } from "@/components/ui/DynamicIslandNav";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import NoticeBar from "@/components/NoticeBar";

const Theme2 = () => {
    const [showBee, setShowBee] = useState(false);
    const [isThemeCustomizerOpen, setIsThemeCustomizerOpen] = useState(false);
    return (

        <div
            style={{
                cursor: 'url("/cursor.png") 16 16, auto', // 16 16 = hotspot position
            }}
            className="min-h-screen relative"
        >
            {/* <NoticeBar notice="🚧 Theme2 is under Developement." /> */}
            <DynamicIslandNav />
            <main>
                <HeroSection2 />
                <Skills />
                <Projects />
                <Experience />
                <Contact />
            </main>
            <Footer />
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

export default Theme2;
