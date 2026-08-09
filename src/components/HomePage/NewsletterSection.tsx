"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { motion } from "framer-motion"
import { toast } from "sonner"

const NewsletterSection = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !email.includes("@")) {
      toast.error("Enter a valid email to get started.")
      return
    }
    router.push(`/login?email=${encodeURIComponent(email.trim())}`)
  }

  return (
    <div>
      <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-[#1C398E] via-[#1C398E]/90 to-[#06D6A0]">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?fm=jpg&q=70&w=1600&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover opacity-15 mix-blend-overlay"
          />
        </div>
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to see your target band up close?</h2>
            <p className="text-xl text-white/90 mb-8">
              Get your first AI-scored practice test free — no strings, just a real read on where you stand.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8"
            >
              <Input
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
                <Button
                  type="submit"
                  className="bg-white text-[#1C398E] hover:bg-white/90 whitespace-nowrap font-semibold w-full sm:w-auto"
                >
                  Get Started Free
                </Button>
              </motion.div>
            </form>

            <p className="text-white/70 text-sm">No credit card required · Results in minutes</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default NewsletterSection
