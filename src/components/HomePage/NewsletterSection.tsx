"use client"
import React from 'react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import {motion} from "framer-motion"

const NewsletterSection = () => {
  return (
    <div>
      <section className="py-20 px-4 bg-gradient-to-br from-[#1C398E] via-[#1C398E]/90 to-[#06D6A0]">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Ready to Achieve Your Target IELTS Score?</h2>
            <p className="text-xl text-white/90 mb-8">
              Join thousands of successful students who improved their IELTS scores with our AI-powered platform
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
              <Input
                placeholder="Enter your email address"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70"
              />
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 whitespace-nowrap">
                Start Free Trial
              </Button>
            </div>

            <p className="text-white/70 text-sm">No credit card required • 7-day free trial • Cancel anytime</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default NewsletterSection
