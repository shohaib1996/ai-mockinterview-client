"use client";
import {  motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Users,
  RefreshCw,
  Headphones,
  Mic,
  PenTool,
  BookOpen,
  HelpCircle,
  MessageSquare,
} from "lucide-react";
import Lottie from "lottie-react";
import videoExplainer from "../../../public/video-explainer.json";
import Link from "next/link";

const HeroSection = () => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Orbital animation variants
  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 20,
        repeat: Infinity,
        ease: [0, 0, 1, 1] as [number, number, number, number],
      },
    },
  };

  const reverseOrbitVariants = {
    animate: {
      rotate: -360,
      transition: {
        duration: 25,
        repeat: Infinity,
        ease: [0, 0, 1, 1] as [number, number, number, number],
      },
    },
  };
  return (
    <div className="relative">
      <section className="relative py-20 px-4 overflow-hidden bg-gray-900 min-h-[75vh]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-white/30 to-black/40 dark:from-[#1D2B64] dark:via-black dark:to-[#06D6A0]"></div>

        <div className="container mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left relative"
            >
              {/* Top-left 3D illustration (partial view) */}
              <motion.div
                className="absolute -top-64 -left-72 sm:-top-64 sm:-left-80 md:-top-[350px] md:-left-[300px] "
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <div className="relative w-80 h-80">
                  {/* 3D Isometric Platform */}
                  <div className="relative transform rotate-[-25deg] perspective-1000">
                    <div className="w-80 h-80 relative">
                      {/* Bottom layer */}
                      <div className="absolute animate-pulse inset-0 bg-gradient-to-br from-white/50 to-black/50 dark:from-[#1D2B64] dark:to-[#06D6A0] rounded-2xl transform translate-y-4 translate-x-4 opacity-60" />
                      {/* Middle layer */}
                      <div className="absolute animate-pulse inset-2 bg-gradient-to-br from-white/50 to-black/50 dark:from-[#1D2B64] dark:to-[#06D6A0] rounded-xl transform translate-y-2 translate-x-2 opacity-80" />
                      {/* Top layer */}
                      <div className="absolute animate-pulse inset-4 bg-gradient-to-br from-white/30 to-black/30 dark:from-[#1D2B64] dark:to-[#06D6A0] rounded-lg" />
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.h1
                className="text-5xl md:text-6xl font-bold mb-6 text-white text-balance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                AI-Powered <span className="text-[#06D6A0]">IELTS</span>{" "}
                Preparation
              </motion.h1>
              <motion.p
                className="text-lg text-gray-300 mb-8 max-w-xl text-pretty"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                Personalized mock exams, AI-powered instant feedback, and smart
                performance tracking designed to help you improve faster and
                achieve your dream IELTS score with confidence
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Link href="/login">
                  <Button
                    size="lg"
                    className="bg-[#06D6A0] text-black hover:bg-green-300 text-lg px-8 py-3 font-semibold"
                  >
                    Test Now
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
            <div className="flex items-center justify-center min-h-[500px]">
              {/* Right side - Lottie Animation with Orbits */}
              <motion.div
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                className="relative w-full max-w-lg flex items-center justify-center"
              >
                {/* Central Lottie Animation Area */}
                <div className="relative z-10 w-[280px] h-[280px]">
                  <Lottie loop={true} animationData={videoExplainer} />
                </div>

                {/* Outer Orbit - Larger radius */}
                <motion.div
                  className="absolute w-[400px] h-[400px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 "
                  variants={orbitVariants}
                  animate="animate"
                >
                  {/* Listening Icon */}
                  <motion.div
                    className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-full"
                    animate="animate"
                  >
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <Headphones className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>

                  {/* Speaking Icon */}
                  <motion.div
                    className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2"
                    animate="animate"
                  >
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Mic className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>

                  {/* Writing Icon */}
                  <motion.div
                    className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full"
                    animate="animate"
                  >
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <PenTool className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>

                  {/* Reading Icon */}
                  <motion.div
                    className="absolute left-0 top-1/2 transform -translate-x-full -translate-y-1/2"
                    animate="animate"
                  >
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Inner Orbit - Smaller radius, reverse direction */}
                <motion.div
                  className="absolute w-[320px] h-[320px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  variants={reverseOrbitVariants}
                  animate="animate"
                >
                  {/* Quiz Icon */}
                  <motion.div
                    className="absolute left-1/2 top-2 transform -translate-x-1/2 -translate-y-full"
                    animate="animate"
                  >
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <HelpCircle className="w-5 h-5 text-black" />
                    </div>
                  </motion.div>

                  {/* Interview Icon */}
                  <motion.div
                    className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full"
                    animate="animate"
                  >
                    <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                      <MessageSquare className="w-5 h-5 text-black" />
                    </div>
                  </motion.div>
                </motion.div>

                {/* Orbit rings for visual effect */}
                <div className="absolute w-[450px] h-[450px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-white/50 rounded-full"></div>
                <div className="absolute w-[350px] h-[350px] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-white/50 rounded-full"></div>
              </motion.div>
            </div>
          </div>
          {/* Statistics Section */}
          <motion.div
            className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            {[
              {
                icon: Users,
                label: "Total Learners",
                value: "25,000+",
                color: "text-blue-400",
              },
              {
                icon: BookOpen,
                label: "Mock Tests Completed",
                value: "120,000+",
                color: "text-purple-400",
              },
              {
                icon: PenTool,
                label: "Practice Questions",
                value: "2M+",
                color: "text-green-400",
              },
              {
                icon: RefreshCw,
                label: "Avg. Score Improvement",
                value: "35%",
                color: "text-yellow-400",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.4 + index * 0.1 }}
              >
                <div className="w-12 h-12 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-400 dark:text-gray-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HeroSection;
