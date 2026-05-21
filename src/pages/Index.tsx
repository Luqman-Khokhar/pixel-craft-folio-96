import { Navbar }         from "@/components/Navbar";
import { Hero }           from "@/components/Hero";
import { About }          from "@/components/About";
import { Skills }         from "@/components/Skills";
import { Projects }       from "@/components/Projects";
import { Experience }     from "@/components/Experience";
import { Contact }        from "@/components/Contact";
import { Footer }         from "@/components/Footer";
import { SectionWrapper } from "@/components/SectionWrapper";

const Index = () => (
  <div className="relative noise">
    <Navbar />

    <main>
      {/* z-index ladder: each card sits on top of the previous */}

      <SectionWrapper zIndex={1} isFirst>
        <Hero />
      </SectionWrapper>

      <SectionWrapper zIndex={2}>
        <About />
      </SectionWrapper>

      <SectionWrapper zIndex={3}>
        <Skills />
      </SectionWrapper>

      <SectionWrapper zIndex={4}>
        <Projects />
      </SectionWrapper>

      <SectionWrapper zIndex={5}>
        <Experience />
      </SectionWrapper>

      <SectionWrapper zIndex={6} isLast>
        <Contact />
      </SectionWrapper>
    </main>

    <Footer />
  </div>
);

export default Index;
