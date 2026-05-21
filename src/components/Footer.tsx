import { Github, Linkedin, Mail, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-8 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg gradient-fill flex items-center justify-center text-white font-bold text-xs shadow-md">
              L
            </span>
            <span className="text-sm font-semibold">
              Luqman<span className="gradient-text">.</span>
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> by Muhammad Luqman Khokhar
          </p>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {[
              { icon: Github, href: "https://github.com/Luqman-Khokhar", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/mluqmangn/", label: "LinkedIn" },
              { icon: Mail, href: "mailto:mluqmangn@gmail.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
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
