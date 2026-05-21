import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Phone, MapPin, Send, Github, Linkedin } from "lucide-react";

export const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("access_key", "89baae63-25f7-4869-9d4e-a17cb3a200fb");
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => ({}));
      if ((data as any).success) {
        alert("✅ Message sent successfully!");
        e.currentTarget.reset();
      } else {
        alert("❌ Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: "Email", value: "mluqmangn@gmail.com", href: "mailto:mluqmangn@gmail.com" },
    { icon: Phone, label: "Phone", value: "+92 314 755 1262", href: "tel:+923147551262" },
    { icon: MapPin, label: "Location", value: "Daska City, Pakistan", href: null },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-secondary/20" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-sm font-mono text-primary mb-2">// let's talk</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Get In <span className="gradient-text">Touch</span>
          </h2>
          <div className="section-line" />
          <p className="text-muted-foreground mt-4 max-w-lg">
            Have a project in mind or want to discuss opportunities? I'd love to hear from you!
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
          {/* Left — info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="space-y-6"
          >
            {contactInfo.map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl gradient-fill flex items-center justify-center flex-shrink-0 shadow-md">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-sm font-semibold hover:text-primary transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-sm font-semibold">{value}</p>
                  )}
                </div>
              </div>
            ))}

            {/* Social card */}
            <div className="glass border border-border/60 rounded-2xl p-6 mt-4">
              <h4 className="font-semibold mb-2 text-sm">Let's connect</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Open to new projects, creative ideas, and collaboration opportunities.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/Luqman-Khokhar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold border border-border px-4 py-2 rounded-lg hover:bg-secondary hover:border-primary/30 transition-all"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/mluqmangn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs font-semibold border border-border px-4 py-2 rounded-lg hover:bg-secondary hover:border-primary/30 transition-all"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right — form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-3xl blur-2xl opacity-30" />
              <form
                onSubmit={handleSubmit}
                className="relative glass border border-border/60 rounded-2xl p-6 space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Name</label>
                    <input
                      name="name"
                      required
                      placeholder="Your Name"
                      className="w-full bg-background/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Email</label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      className="w-full bg-background/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all placeholder:text-muted-foreground/50"
                    />
                  </div>
                </div>

                <input name="subject" value="Portfolio Contact" className="hidden" readOnly />

                <div>
                  <label className="block text-xs font-medium mb-1.5 text-muted-foreground">Message</label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="w-full bg-background/60 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all resize-none placeholder:text-muted-foreground/50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full gradient-fill text-white py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="animate-pulse">Sending…</span>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
