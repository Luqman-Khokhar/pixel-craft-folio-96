import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, MapPin, Phone, Send, Github, Linkedin } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

export const ContactCyber = () => {
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
      const text = await response.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        data = {};
      }
      if (data && data.success) {
        alert("✅ Message sent successfully!");
        e.currentTarget.reset();
      } else {
        alert("❌ Failed to send message. Try again later.");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactItems = [
    { icon: Mail, label: "Email", value: "mluqmangn@gmail.com", href: "mailto:mluqmangn@gmail.com", color: "190 95% 60%" },
    { icon: Phone, label: "Phone", value: "+92 3147551262", href: "tel:+923147551262", color: "290 90% 65%" },
    { icon: MapPin, label: "Location", value: "Daska City, Pakistan", href: "#", color: "330 90% 65%" },
  ];

  return (
    <section id="contact" ref={ref} className="relative w-full overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Transmission · 05"
          title="Get In"
          accent="Touch"
          description="Have a project in mind or want to discuss opportunities? I'd love to hear from you!"
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* LEFT */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="space-y-5"
          >
            {contactItems.map((c, i) => (
              <a
                key={i}
                href={c.href}
                className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/25"
                style={{ boxShadow: `0 0 0 0 hsl(${c.color}/0)` }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 20px 50px -15px hsl(${c.color}/0.5)`)}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 0 0 0 hsl(${c.color}/0)`)}
              >
                <div
                  className="grid h-12 w-12 place-items-center rounded-xl border"
                  style={{
                    backgroundColor: `hsl(${c.color}/0.12)`,
                    borderColor: `hsl(${c.color}/0.4)`,
                    boxShadow: `0 0 24px -6px hsl(${c.color}/0.6)`,
                  }}
                >
                  <c.icon className="h-5 w-5" style={{ color: `hsl(${c.color})` }} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-white/50">{c.label}</div>
                  <div className="font-semibold text-white">{c.value}</div>
                </div>
                <span
                  className="ml-auto h-4 w-4 border-r-2 border-t-2 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{ borderColor: `hsl(${c.color})` }}
                />
              </a>
            ))}

            <div className="relative overflow-hidden rounded-2xl border border-[hsl(290_90%_60%/0.3)] bg-white/[0.03] p-6 backdrop-blur-xl shadow-[0_0_40px_-10px_hsl(290_90%_60%/0.5)]">
              <h4 className="mb-2 text-lg font-bold text-white">Let's connect!</h4>
              <p className="mb-4 text-sm text-white/65">
                I'm always open to discussing new projects, creative ideas, or opportunities to be
                part of your vision.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/Luqman-Khokhar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white hover:bg-white/10"
                >
                  <Github className="h-3.5 w-3.5" /> GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/mluqmangn/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/80 transition-all hover:text-white hover:bg-white/10"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
              </div>
            </div>
          </motion.div>

          {/* RIGHT — form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            <form
              onSubmit={handleSubmit}
              className="relative overflow-hidden rounded-2xl border border-[hsl(190_95%_55%/0.3)] bg-white/[0.03] p-7 backdrop-blur-xl shadow-[0_0_50px_-12px_hsl(190_95%_55%/0.5)]"
            >
              {/* HUD corners */}
              {["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map(
                (p, i) => (
                  <span key={i} className={`pointer-events-none absolute h-5 w-5 ${p} border-[hsl(190_95%_70%)]`} />
                )
              )}

              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[hsl(190_95%_75%)]">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[hsl(190_95%_55%/0.6)] focus:bg-white/[0.06] focus:shadow-[0_0_24px_-6px_hsl(190_95%_55%/0.6)]"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[hsl(190_95%_75%)]">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[hsl(290_90%_60%/0.6)] focus:bg-white/[0.06] focus:shadow-[0_0_24px_-6px_hsl(290_90%_60%/0.6)]"
                  />
                </div>

                <input id="subject" name="subject" value="Portfolio Contact" readOnly className="hidden" />

                <div>
                  <label htmlFor="message" className="mb-2 block text-[10px] uppercase tracking-[0.3em] text-[hsl(190_95%_75%)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Write your message here"
                    rows={5}
                    required
                    className="w-full rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none transition-all focus:border-[hsl(330_90%_65%/0.6)] focus:bg-white/[0.06] focus:shadow-[0_0_24px_-6px_hsl(330_90%_65%/0.6)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-[0_0_40px_-8px_hsl(290_90%_60%/0.8)] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
                  style={{ clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-[hsl(290_90%_55%)] via-[hsl(330_90%_60%)] to-[hsl(190_95%_55%)] bg-[length:200%_100%] animate-[gradient_4s_linear_infinite]" />
                  <span className="relative flex items-center gap-2">
                    {isSubmitting ? (
                      "Transmitting..."
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" /> Send Message
                      </>
                    )}
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactCyber;
