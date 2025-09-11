"use client"

import React, { useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

import { Card } from '@/components/ui/card';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Medical Student',
    score: '8.5',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The AI feedback was incredibly detailed and helped me identify my weak points. I improved my score from 6.5 to 8.5 in just 3 months!',
  },
  {
    name: 'Ahmed Hassan',
    role: 'Software Engineer',
    score: '9.0',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The personalized study plan and mock tests were exactly what I needed. The speaking practice with AI was particularly helpful.',
  },
  {
    name: 'Maria Garcia',
    role: 'Business Analyst',
    score: '8.0',
    image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Outstanding platform! The instant feedback and progress tracking kept me motivated throughout my preparation journey.',
  },
  {
    name: 'David Chen',
    role: 'Graduate Student',
    score: '8.5',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'The AI-powered analysis was spot-on. It identified patterns in my writing that I never noticed and helped me improve significantly.',
  },
];

export const TestimonialsSection: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials?.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials?.length) % testimonials?.length);
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-800" ref={ref}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900 dark:text-white mb-6">
            Success Stories
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of students who achieved their target IELTS scores with our AI-powered platform
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Main testimonial display */}
          <div className="relative h-96 mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Card className="h-full flex flex-col justify-center text-center relative">
                  {/* Score badge */}
                  <motion.div
                    className="absolute top-4 right-4 bg-cyan-500 text-white px-3 py-1 rounded-full text-sm font-bold"
                    whileHover={{ scale: 1.1 }}
                  >
                    IELTS {testimonials[currentIndex].score}
                  </motion.div>

                  {/* Profile image */}
                  <motion.img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex]?.name}
                    className="w-20 h-20 rounded-full mx-auto mb-6 object-cover"
                    whileHover={{ scale: 1.1 }}
                  />

                  {/* Stars */}
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 italic px-4">
                    &quot;{testimonials[currentIndex].content}&quot;
                  </blockquote>

                  {/* Author */}
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-lg">
                      {testimonials[currentIndex]?.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {testimonials[currentIndex].role}
                    </p>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white dark:bg-gray-700 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 text-gray-600 dark:text-gray-300 hover:text-cyan-600 dark:hover:text-cyan-400"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex
                    ? 'bg-cyan-500 scale-125'
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};