"use client"

import { BookOpen, Brain, Target, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  return (
    <div>
      <section className="py-20 px-4 dark:bg-gray-800">
        <div className="container mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our AI-powered platform adapts to your learning style and provides
              personalized guidance
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Assessment",
                description:
                  "Advanced AI analyzes your performance and identifies areas for improvement",
              },
              {
                icon: Target,
                title: "Personalized Plan",
                description:
                  "Custom study plans tailored to your current level and target score",
              },
              {
                icon: BookOpen,
                title: "Mock Tests",
                description:
                  "Realistic practice tests that simulate the actual IELTS exam experience",
              },
              {
                icon: TrendingUp,
                title: "Progress Tracking",
                description:
                  "Real-time analytics to monitor your improvement and adjust strategies",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow bg-accent">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-[#1D2B64] dark:text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
