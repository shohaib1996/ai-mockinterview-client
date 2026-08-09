"use client"

import { Headphones, Mic, PenTool, BookOpenCheck } from "lucide-react";
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
            <h2 className="text-4xl font-bold mb-4">Every module, scored like the real exam</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Full-length practice across all four IELTS skills, each graded against the real
              band-score rubric.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Headphones,
                title: "Listening",
                description:
                  "Four timed sections with authentic accents, scored the moment you finish.",
              },
              {
                icon: BookOpenCheck,
                title: "Reading",
                description:
                  "Three passages with real question types and strict time management.",
              },
              {
                icon: PenTool,
                title: "Writing",
                description:
                  "Task 1 and Task 2, scored against all four official band criteria.",
              },
              {
                icon: Mic,
                title: "Speaking",
                description:
                  "A live AI conversation partner with pronunciation and fluency feedback.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg hover:shadow-[#06D6A0]/10 hover:-translate-y-1 transition-all duration-300 bg-accent">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-[#06D6A0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-[#1D2B64] dark:text-[#06D6A0]" />
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
