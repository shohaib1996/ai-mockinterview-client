"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  ArrowRight,
  Headphones,
  PenTool,
  MessageSquare,
} from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "../ui/button"

const MockTest = () => {
  return (
    <div>
       <section className="py-20 px-4 bg-background dark:bg-gray-800">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Interactive Mock Tests</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Experience realistic IELTS practice tests with instant AI feedback and detailed performance analysis.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  { icon: Headphones, text: "Listening practice with authentic accents" },
                  { icon: BookOpen, text: "Reading comprehension with time management" },
                  { icon: PenTool, text: "Writing tasks with AI scoring" },
                  { icon: MessageSquare, text: "Speaking practice with AI conversation" },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="w-8 h-8 bg-[#1C398E] rounded-full flex items-center justify-center">
                      <feature.icon className="w-4 h-4 text-secondary dark:text-white" />
                    </div>
                    <span>{feature.text}</span>
                  </motion.div>
                ))}
              </div>
              <Button size="lg" className="bg-[#1C398E] text-primary-foreground dark:text-white hover:bg-primary/90">
                Try Free Mock Test
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <Card className="overflow-hidden py-0">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-6">
                    <div className="bg-background rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold">IELTS Reading Test</span>
                        <Badge variant="outline">Section 1 of 3</Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-2 bg-primary rounded-full w-1/3"></div>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Progress: 33%</span>
                          <span>Time: 15:30</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-background rounded-lg p-4">
                      <h3 className="font-semibold mb-2">Question 1-5</h3>
                      <p className="text-sm text-muted-foreground mb-3">Choose the correct answer A, B, C, or D.</p>
                      <div className="space-y-2">
                        <div className="p-2 border rounded hover:bg-muted/50 cursor-pointer">
                          A) The development of renewable energy
                        </div>
                        <div className="p-2 border rounded bg-green-100 dark:text-black border-green-300">
                          B) Climate change and its effects
                        </div>
                        <div className="p-2 border rounded hover:bg-muted/50 cursor-pointer">
                          C) Economic growth strategies
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default MockTest
