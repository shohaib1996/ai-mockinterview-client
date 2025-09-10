"use client";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

export const AiPerformanceShowcase: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [animatedStats, setAnimatedStats] = useState({
    accuracy: 0,
    improvement: 0,
    timesSaved: 0,
    studentsHelped: 0,
  });
  console.log(animatedStats)

  const finalStats = {
    accuracy: 96,
    improvement: 45,
    timesSaved: 120,
    studentsHelped: 10000,
  };

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedStats(finalStats);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isInView, finalStats]);

  // const statsData = [
  //   {
  //     icon: TrendingUp,
  //     label: "Average Accuracy",
  //     value: animatedStats.accuracy,
  //     suffix: "%",
  //   },
  //   {
  //     icon: Award,
  //     label: "Score Improvement",
  //     value: animatedStats.improvement,
  //     suffix: "%",
  //   },
  //   {
  //     icon: Clock,
  //     label: "Hours Saved",
  //     value: animatedStats.timesSaved,
  //     suffix: "h",
  //   },
  //   {
  //     icon: Users,
  //     label: "Students Helped",
  //     value: animatedStats.studentsHelped,
  //     suffix: "+",
  //   },
  // ];

  return (
    <section className="py-20 bg-blue-900 dark:bg-blue-950" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            AI Performance Showcase
          </h2>
          <p className="text-lg md:text-xl text-blue-200 max-w-3xl mx-auto">
            See how our AI technology is revolutionizing IELTS preparation with
            measurable results
          </p>
        </motion.div>

        {/* Dashboard Image with Scattered Gradient Shadow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative max-w-[90vw] sm:max-w-2xl md:max-w-3xl mx-auto mb-12"
        >
          {/* Scattered Gradient Shadow Effect */}
          <motion.div
            className="absolute inset-0 -m-6"
            style={{
              background: "linear-gradient(45deg, #06D6A0, #06D6A0)",
              boxShadow: "0 0 30px 15px rgba(6, 214, 160, 0.4)",
              filter: "blur(12px)",
              borderRadius: "1.5rem",
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
              boxShadow: [
                "rgba(17, 17, 26, 0.1) 0px 8px 24px",
                "rgba(17, 17, 26, 0.1) 0px 16px 56px",
                "rgba(17, 17, 26, 0.1) 0px 24px 80px",
              ],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Dashboard Image */}
          <motion.div
            className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src="https://i.imgur.com/GJCu8xx.png"
              alt="AI Performance Dashboard"
              className="w-full h-auto object-cover"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />

            {/* Vanishing overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent pointer-events-none"></div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};