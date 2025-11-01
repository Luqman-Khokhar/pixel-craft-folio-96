import { useState, useEffect } from "react";
import { Moon, Sun, Menu, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";
import { useNavigate } from "react-router-dom";

const navItems = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {

  const navigate = useNavigate();
  const { isDark, toggleDarkMode } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const yOffset = -80; // adjust for your navbar height
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };


  // top-0
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
        ? "bg-background/80 backdrop-blur-lg border-b border-border"
        : "bg-transparent"
        }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between h-16 ${isScrolled
          ? "pt-5" : ''}`}>
          <motion.a
            href="#home"
            className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent items-center"
            whileHover={{ scale: 1.05 }}
            onClick={(e) => {
              e.preventDefault();
              scrollToSection("#home");
            }}
          >
            Portfolio
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Button
              variant="ghost"
              onClick={() => navigate("/Theme2")}
              className="text-foreground hover:text-white transition-colors"
            >
              Theme 2
            </Button>

            {navItems.map((item) => (
              <Button
                key={item.name}
                variant="ghost"
                onClick={() => scrollToSection(item.href)}
                className="text-foreground hover:text-white transition-colors"
              >
                {item.name}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="ml-1"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="default"
              size="sm"
              className="ghost rainbow"
            >
              <a
                href="/CV/Muhammad_Luqman_CV_(30Oct2025).pdf.pdf"
                download="Muhammad_Luqman_CV.pdf"
                className="flex items-center gap-2"
              >
                Resume
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden mt-1">
            <Button
              variant="default"
              size="sm"
              className="ghost rainbow"
            >
              <a
                href="/CV/Muhammad_Luqman_CV_(30Oct2025).pdf.pdf"
                download="Muhammad_Luqman_CV.pdf"
                className="flex items-center gap-2"
              >
                Resume
              </a>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="mr-2"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.name}
                  variant="ghost"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href);
                  }}
                  className="w-full justify-start text-foreground hover:text-primary"
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav >
  );
};
