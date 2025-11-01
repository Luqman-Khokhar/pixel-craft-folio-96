import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

export const HeroSection2 = () => {
  return (
    <section className="relative min-h-screen bg-background overflow-hidden bg-rainbow">
      {/* Dark background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-background" />

      {/* Hero Image */}
      <div className="absolute inset-0 flex items-start justify-center ">
        <motion.img
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          src="/about-removebg.png"
          alt="Muhammad Luqman Khokhar"
          className="h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] xl:h-[700px] w-auto max-w-[85%] sm:max-w-[65%] md:max-w-[50%] lg:max-w-[45%] object-contain object-center sm:object-left ml-0 lg:ml-12"
        />

        {/* Blurry cloudy bottom effect */}
        <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-background via-background/60 to-transparent blur-2xl" />
      </div>

      {/* Main Title Overlay */}
      <div className="relative z-10 flex items-end justify-center min-h-[70vh] pt-44">
        <div className="relative z-10 flex flex-col items-center justify-end text-center px-6 mt-14 md:pt-32">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl text-white tracking-tight font-bold"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Luqman
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-gray-400 text-lg md:text-xl mt-4 max-w-2xl"
          >
            Frontend Developer — Building modern, interactive, and beautiful web & mobile experiences.
          </motion.p>
        </div>
      </div>

      {/* Bottom Info Sections */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-16 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Copyright Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-white relative"
          >
            <ChevronUp
              className="text-orange-500 -rotate-45 mr-8 absolute top-[-20px] left-[-10px]"
              width={"40"}
              height={"40"}
            />
            <h3 className="text-2xl font-bold mb-3 ml-4">©2025</h3>
            <p className="text-sm text-gray-500 leading-relaxed ml-4">
              Designing digital experiences that captivate, connect, and convert.
            </p>
          </motion.div>

          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-white relative"
          >
            <ChevronUp
              className="text-orange-500 -rotate-45 mr-8 absolute top-[-20px] left-[-10px]"
              width={"40"}
              height={"40"}
            />
            <h3 className="text-2xl font-bold mb-3 ml-4">Development</h3>
            <p className="text-sm text-gray-500 leading-relaxed ml-4">
              Crafting robust, scalable applications that deliver exceptional performance and reliability.
            </p>
          </motion.div>

          {/* UI/UX Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-white relative"
          >
            <ChevronUp
              className="text-orange-500 -rotate-45 mr-8 absolute top-[-20px] left-[-10px]"
              width={"40"}
              height={"40"}
            />
            <h3 className="text-2xl font-bold mb-3 ml-4">UI/UX</h3>
            <p className="text-sm text-gray-500 leading-relaxed ml-4">
              Intuitive, user-focused interfaces that elevate engagement and drive seamless interactions.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
