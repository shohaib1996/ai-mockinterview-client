"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import logo from "../../../public/logo.png"
import { Facebook, InstagramIcon, Linkedin } from "lucide-react";
import { Meteors } from "../ui/meteors";

export default function Footer() {
  const footerLinks = ["Home", "About", "Contact"];

  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center space-x-2 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Image src={logo} alt="logo" width={50} height={50} />
              <span className="text-white font-bold text-xl">LinguaAI</span>
            </motion.div>

            <motion.p
              className="text-gray-400 mb-6 max-w-md"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Personalized mock exams, AI-powered instant feedback, and smart performance tracking designed to help you improve faster and achieve your dream IELTS score with confidence
            </motion.p>
          </div>

          {/* Links Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Pages</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-green-400 transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Social Media Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-400 hover:text-black transition-colors cursor-pointer">
                <span className="text-sm font-bold"><Facebook/></span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-400 hover:text-black transition-colors cursor-pointer">
                <span className="text-sm font-bold"><Linkedin/></span>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-400 hover:text-black transition-colors cursor-pointer">
                <span className="text-sm font-bold"><InstagramIcon/></span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          className="border-t border-gray-800 mt-8 pt-8 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm">
            Copyright © {new Date().getFullYear()} LinguaAI. All rights reserved.
          </p>
        </motion.div>
        <Meteors number={20} />
      </div>
    </footer>
  );
}

