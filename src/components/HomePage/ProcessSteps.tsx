"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const steps = [
  {
    n: "01",
    title: "Take a diagnostic",
    desc: "A short assessment maps your current band across all four modules.",
  },
  {
    n: "02",
    title: "Get your plan",
    desc: "The AI builds a study schedule around your target score and test date.",
  },
  {
    n: "03",
    title: "Practice with mocks",
    desc: "Full-length, timed mock tests that mirror the real exam conditions.",
  },
  {
    n: "04",
    title: "Improve with feedback",
    desc: "Instant, examiner-style feedback after every task you submit.",
  },
];

const ProcessSteps = () => {
  return (
    <section id="how" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">How the AI gets you ready</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Every step is calibrated to your target band score and the deadline on your application.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="https://images.unsplash.com/photo-1753613648242-6b6c5b88e4d1?fm=jpg&q=80&w=1200&auto=format&fit=crop"
              alt="A focused student studying in the library"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1D2B64]/70 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3">
              <div className="w-9 h-9 rounded-full bg-[#06D6A0] flex items-center justify-center text-black font-bold text-sm shrink-0">
                AI
              </div>
              <p className="text-white text-sm font-medium">
                &quot;Your Task 2 coherence improved 0.5 bands since last week.&quot;
              </p>
            </div>
          </motion.div>

          <div className="space-y-2">
            {steps.map((s, index) => (
              <motion.div
                key={s.n}
                className="flex gap-5 py-5 border-b border-border last:border-0"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                viewport={{ once: true }}
              >
                <div className="text-2xl font-bold text-[#06D6A0] font-mono shrink-0 w-14">
                  {s.n}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;
