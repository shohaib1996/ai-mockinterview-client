"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const moduleScores = [
  { name: "Listening", score: 7.0, pct: 78 },
  { name: "Reading", score: 6.5, pct: 65 },
  { name: "Writing", score: 6.0, pct: 60 },
  { name: "Speaking", score: 6.5, pct: 65 },
];

const students = [
  { name: "Sarah Malik", target: "7.5", latest: "7.0", status: "On track" },
  { name: "Daniyar K.", target: "7.0", latest: "6.0", status: "At risk" },
  { name: "Wei Chen", target: "6.5", latest: "6.5", status: "On track" },
  { name: "Amara O.", target: "7.5", latest: "6.5", status: "At risk" },
  { name: "Lucas F.", target: "6.0", latest: "—", status: "Not started" },
];

const statusStyles: Record<string, string> = {
  "On track": "bg-[#06D6A0]/15 text-[#06D6A0] border-[#06D6A0]/30",
  "At risk": "bg-amber-500/15 text-amber-500 border-amber-500/30",
  "Not started": "bg-muted text-muted-foreground border-border",
};

const DashboardPreview = () => {
  const [tab, setTab] = useState("student");

  return (
    <section id="dashboards" className="py-20 px-4 bg-background">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">One platform, two dashboards</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Students get a personalized study cockpit. Institutions and tutors get a full command
            center to track every learner.
          </p>
        </motion.div>

        <motion.div
          className="flex justify-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="student">Student view</TabsTrigger>
              <TabsTrigger value="admin">Admin view</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div
          className="max-w-4xl mx-auto rounded-2xl border border-border shadow-xl overflow-hidden bg-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <AnimatePresence mode="wait">
            {tab === "student" ? (
              <motion.div
                key="student"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-[220px_1fr]"
              >
                <div className="border-b md:border-b-0 md:border-r border-border p-5 flex flex-row md:flex-col gap-4 md:gap-5 overflow-x-auto">
                  <div className="font-semibold text-sm whitespace-nowrap">Sarah&apos;s Dashboard</div>
                  <div className="text-sm text-[#06D6A0] font-medium whitespace-nowrap">● Overview</div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">Mock Tests</div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">Speaking Practice</div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">Study Plan</div>
                </div>
                <div className="p-6 grid sm:grid-cols-3 gap-6">
                  <div className="sm:border-r border-border sm:pr-6">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                      Target Band
                    </div>
                    <div className="text-4xl font-bold">7.5</div>
                    <div className="text-xs text-[#06D6A0] mt-1.5">Current: 6.5 → 7.5</div>
                  </div>
                  <div className="sm:border-r border-border sm:px-6">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                      Band by Module
                    </div>
                    <div className="space-y-2.5">
                      {moduleScores.map((m) => (
                        <div key={m.name} className="flex items-center gap-2">
                          <span className="text-xs w-16 text-muted-foreground shrink-0">{m.name}</span>
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className="h-full rounded-full bg-[#06D6A0]"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${m.pct}%` }}
                              transition={{ duration: 0.8 }}
                              viewport={{ once: true }}
                            />
                          </div>
                          <span className="text-xs font-semibold w-6">{m.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="sm:pl-0">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground mb-3">
                      Next Up
                    </div>
                    <div className="text-sm font-semibold mb-1">Academic Writing Task 2</div>
                    <div className="text-xs text-muted-foreground mb-4">
                      AI feedback ready in ~2 min
                    </div>
                    <div className="inline-flex text-xs font-bold text-black bg-[#06D6A0] px-3 py-2 rounded-md">
                      Resume session
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="admin"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-[220px_1fr]"
              >
                <div className="border-b md:border-b-0 md:border-r border-border p-5 flex flex-row md:flex-col gap-4 md:gap-5 overflow-x-auto">
                  <div className="font-semibold text-sm whitespace-nowrap">Admin Console</div>
                  <div className="text-sm text-[#06D6A0] font-medium whitespace-nowrap">
                    ● Cohort Overview
                  </div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">Students</div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">Content Library</div>
                  <div className="text-sm text-muted-foreground whitespace-nowrap">AI Model Logs</div>
                </div>
                <div className="p-6 overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border">
                        <th className="pb-2.5 font-medium">Student</th>
                        <th className="pb-2.5 font-medium">Target</th>
                        <th className="pb-2.5 font-medium">Latest Mock</th>
                        <th className="pb-2.5 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s) => (
                        <tr key={s.name} className="border-b border-border last:border-0">
                          <td className="py-2.5">{s.name}</td>
                          <td className="py-2.5">{s.target}</td>
                          <td className="py-2.5">{s.latest}</td>
                          <td className="py-2.5">
                            <Badge variant="outline" className={statusStyles[s.status]}>
                              {s.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default DashboardPreview;
