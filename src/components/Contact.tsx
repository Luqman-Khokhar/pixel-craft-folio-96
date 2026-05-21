import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Mail, Phone, MapPin, Send, Github, Linkedin } from "lucide-react";

const contactInfo = [
  { icon: Mail,   label: "Email",    value: "mluqmangn@gmail.com",  href: "mailto:mluqmangn@gmail.com" },
  { icon: Phone,  label: "Phone",    value: "+92 314 755 1262",      href: "tel:+923147551262" },
  { icon: MapPin, label: "Location", value: "Daska City, Pakistan",  href: null },
];

const socials = [
  { icon: Github,   href: "https://github.com/Luqman-Khokhar",      label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/mluqmangn/", label: "LinkedIn" },
  { icon: Mail,     href: "mailto:mluqmangn@gmail.com",              label: "Email" },
];

function FloatInput({
  id, label, type = "text", name, required = false,
}: { id: string; label: string; type?: string; name: string; required?: boolean }) {
  return (
    <div className="relative group">
      <input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder=" "
        className="peer w-full bg-transparent border-b border-border px-0 pt-6 pb-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors placeholder-transparent"
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-2 text-[10px] font-mono-alt text-muted-foreground/60 transition-all duration-200
          peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground
          peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary"
      >
        {label}
      </label>
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
    </div>
  );
}

export const Contact = () => {
  const ref     = useRef(null);
  const inView  = useInView(ref, { once: true, margin: "-80px" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.append("access_key", "89baae63-25f7-4869-9d4e-a17cb3a200fb");
      const res  = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
      const data = await res.json().catch(() => ({}));
      if ((data as any).success) {
        alert("✅ Message sent!");
        e.currentTarget.reset();
      } else {
        alert("❌ Failed to send. Try again.");
      }
    } catch {
      alert("❌ Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
  });

  return (
    <section id="contact" className="py-28 relative overflow-hidden" ref={ref}>
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-500/6 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-5 sm:px-8 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start max-w-6xl mx-auto">

          {/* ── Left: Copy + contacts ── */}
          <div>
            <motion.p {...fade(0)} className="section-label mb-3">05 — Contact</motion.p>
            <motion.h2
              {...fade(0.08)}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4"
            >
              Let's build<br />
              <span className="gradient-text">something.</span>
            </motion.h2>
            <motion.div {...fade(0.12)} className="forge-line" />
            <motion.p {...fade(0.15)} className="text-muted-foreground leading-relaxed mb-8 max-w-sm text-base">
              Have a project in mind, a role to fill, or just want to say hi?
              My inbox is always open.
            </motion.p>

            {/* Contact info */}
            <motion.div {...fade(0.2)} className="flex flex-col gap-4 mb-10">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono-alt text-muted-foreground/60 mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} className="text-sm font-medium hover:text-primary transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm font-medium">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Socials */}
            <motion.div {...fade(0.25)} className="flex items-center gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-200"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="forge-card rounded-2xl p-8"
          >
            <form onSubmit={handleSubmit} className="flex flex-col gap-8">
              <FloatInput id="name"    name="name"    label="Your Name"          required />
              <FloatInput id="email"   name="email"   label="Email Address" type="email" required />
              <FloatInput id="subject" name="subject" label="Subject"            required />

              {/* Textarea with floating label */}
              <div className="relative group">
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  required
                  placeholder=" "
                  className="peer w-full bg-transparent border-b border-border px-0 pt-6 pb-2 text-sm text-foreground focus:outline-none focus:border-primary transition-colors resize-none placeholder-transparent"
                />
                <label
                  htmlFor="message"
                  className="absolute left-0 top-2 text-[10px] font-mono-alt text-muted-foreground/60 transition-all duration-200
                    peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-placeholder-shown:text-muted-foreground
                    peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-primary"
                >
                  Message
                </label>
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-primary scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 origin-left" />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="gradient-fill text-white px-6 py-3 rounded-md font-semibold text-sm shadow-lg hover:opacity-90 hover:shadow-orange-500/25 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
