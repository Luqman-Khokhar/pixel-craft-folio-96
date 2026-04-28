import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Zap } from "lucide-react";

export const FooterCyber = () => {
  const year = new Date().getFullYear();
  const socials = [
    { icon: Github, href: "https://github.com/Luqman-Khokhar", label: "GitHub", color: "290 90% 65%" },
    { icon: Linkedin, href: "https://www.linkedin.com/in/mluqmangn/", label: "LinkedIn", color: "190 95% 60%" },
    { icon: Mail, href: "mailto:mluqmangn@gmail.com", label: "Email", color: "330 90% 65%" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-[hsl(190_95%_55%/0.2)] bg-[hsl(240_30%_3%)]">
      {/* Glow ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/4 h-80 w-80 rounded-full bg-[hsl(290_90%_60%/0.18)] blur-[120px]" />
        <div className="absolute -top-32 right-1/4 h-72 w-72 rounded-full bg-[hsl(190_95%_55%/0.18)] blur-[120px]" />
      </div>

      {/* Animated top border */}
      <motion.div
        animate={{ backgroundPosition: ["0% 50%", "100% 50%"] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 top-0 h-px bg-[length:200%_100%]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent, hsl(190 95% 60%), hsl(290 90% 65%), hsl(330 90% 65%), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-[hsl(290_90%_55%)] to-[hsl(190_95%_55%)] shadow-[0_0_24px_-4px_hsl(290_90%_60%)]">
              <Zap className="h-4 w-4 text-white" />
            </span>
            <span className="bg-gradient-to-r from-[hsl(190_95%_75%)] to-[hsl(290_90%_75%)] bg-clip-text text-lg font-bold tracking-[0.2em] text-transparent">
              LK.dev
            </span>
          </motion.div>

          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <motion.a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-white/80 backdrop-blur-xl transition-all hover:text-white"
                style={{ boxShadow: `0 0 0 0 hsl(${s.color}/0)` }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 0 24px -4px hsl(${s.color}/0.7)`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 0 0 hsl(${s.color}/0)`)}
              >
                <s.icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>

          <div className="text-center text-xs uppercase tracking-[0.3em] text-white/40">
            <p>Built with Vite · React.js</p>
            <p className="mt-2">© {year} Muhammad Luqman Khokhar · All rights reserved</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterCyber;
