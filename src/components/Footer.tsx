import { Github, Linkedin, Mail } from "lucide-react";

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background py-8">
      <div className="container mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-md gradient-fill flex items-center justify-center text-white font-display font-bold text-xs shadow-md">
              L
            </span>
            <span className="font-display font-bold text-sm tracking-wide">
              LK<span className="text-primary">.</span>dev
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs font-mono-alt text-muted-foreground/60">
            © {year} Muhammad Luqman Khokhar — Built with React + Three.js
          </p>

          {/* Socials */}
          <div className="flex items-center gap-2.5">
            {[
              { icon: Github,   href: "https://github.com/Luqman-Khokhar",      label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/mluqmangn/", label: "LinkedIn" },
              { icon: Mail,     href: "mailto:mluqmangn@gmail.com",              label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
