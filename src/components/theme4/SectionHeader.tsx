import { motion } from "framer-motion";

export const SectionHeader = ({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description?: string;
}) => (
  <div className="mb-14 text-center">
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-4 inline-flex items-center gap-2 rounded-full border border-[hsl(190_95%_55%/0.4)] bg-white/[0.03] px-4 py-1.5 text-[10px] uppercase tracking-[0.35em] text-[hsl(190_95%_75%)] backdrop-blur-xl shadow-[0_0_24px_-8px_hsl(190_95%_55%/0.6)]"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[hsl(190_95%_60%)] shadow-[0_0_10px_hsl(190_95%_60%)]" />
      {eyebrow}
    </motion.div>
    <motion.h2
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.05 }}
      className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white"
    >
      {title}{" "}
      <span className="bg-gradient-to-r from-[hsl(190_95%_65%)] via-[hsl(290_90%_70%)] to-[hsl(330_90%_70%)] bg-clip-text text-transparent drop-shadow-[0_0_30px_hsl(290_90%_60%/0.4)]">
        {accent}
      </span>
    </motion.h2>
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="mx-auto mt-5 h-[2px] w-24 origin-left bg-gradient-to-r from-[hsl(190_95%_55%)] via-[hsl(290_90%_60%)] to-[hsl(330_90%_60%)] shadow-[0_0_18px_hsl(290_90%_60%)]"
    />
    {description && (
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mx-auto mt-5 max-w-2xl text-base text-white/60"
      >
        {description}
      </motion.p>
    )}
  </div>
);

export default SectionHeader;
