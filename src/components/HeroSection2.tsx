import { motion } from "framer-motion";

export const HeroSection2 = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Dark background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-background" />
      
      {/* Hero Image */}
      <div className="absolute inset-0 flex items-center justify-start">
        <motion.img
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          src="/about-removebg.png"
          alt="Muhammad Luqman Khokhar"
          className="h-full w-auto max-w-[60%] object-contain object-left ml-0 lg:ml-12"
        />
      </div>

      {/* Main Title Overlay */}
      <div className="relative z-10 flex items-center justify-center min-h-[70vh] pt-20">
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold text-white tracking-tight text-center px-4"
        >
          Muhammad
          <br />
          Luqman
          <span className="text-primary">®</span>
        </motion.h1>
      </div>

      {/* Bottom Info Sections */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-16 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Copyright Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white"
          >
            <h3 className="text-2xl font-bold mb-3">©2025</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Designing digital experiences that captivate, connect, and convert.
            </p>
          </motion.div>

          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-white"
          >
            <h3 className="text-2xl font-bold mb-3">Development</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Crafting robust, scalable applications that deliver exceptional performance and reliability.
            </p>
          </motion.div>

          {/* UI/UX Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-white"
          >
            <h3 className="text-2xl font-bold mb-3">UI/UX</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Intuitive, user-focused interfaces that elevate engagement and drive seamless interactions.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
