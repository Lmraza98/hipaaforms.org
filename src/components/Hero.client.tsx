'use client'

import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

// import AnimatedGradient from "./AnimatedGradient";
import CTAButtons from "./CTAButtons";
import BadgeStrip from "./BadgeStrip";
import FormCard from "./FormCard";
import { fadeUp } from "./animations";

export default function Hero() {
  return (
    // <AnimatedGradient className="">
      
    // </AnimatedGradient>
    <section className="min-h-screen md:h-screen md:flex md:flex-col md:justify-center -z-10">
      <div className="max-w-7xl mx-auto px-6 pt-16 md:pt-0">
        {/* Mobile layout */}
        <div className="md:hidden h-full flex flex-col justify-start">
          <motion.h1 
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="max-w-3xl text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white/90 leading-tight text-center mx-auto"
            style={{ fontWeight: 800 }}
          >
            HIPAA-Compliance<br/>Made Simple
          </motion.h1>
          
          <motion.p 
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.1 }}
            className="max-w-2xl mt-4 text-lg text-gray-300 mb-6 text-center mx-auto"
          >
            Create secure, fully editable healthcare forms in minutes.
          </motion.p>
          
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.2 }}
            className="mb-3 mx-auto"
          >
            <CTAButtons />
          </motion.div>
          
          <motion.span 
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.25 }}
            className="block text-sm text-gray-400 mt-1 mb-3 text-center"
          >
            Plans start at <strong>$0/mo</strong>
          </motion.span>
          
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            transition={{ delay: 0.3 }}
            className="mb-6 mx-auto"
          >
            <BadgeStrip />
          </motion.div>
          
          <div className="mt-2">
            <FormCard />
          </div>
        </div>
        
        {/* Desktop layout */}
        <div className="hidden md:grid md:grid-cols-2 gap-12 items-center">
          <div className="mb-12 md:mb-0">
            <motion.h1 
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="max-w-3xl text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white/90 leading-tight mb-4"
              style={{ fontWeight: 800 }}
            >
              HIPAA-Compliant Forms Made Simple
            </motion.h1>
            
            <motion.p 
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.1 }}
              className="max-w-2xl mt-4 text-lg text-gray-300 mb-6"
            >
              Create secure, fully editable healthcare forms in minutes.
            </motion.p>
            
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.2 }}
            >
              <CTAButtons />
            </motion.div>
            
            <motion.span 
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.25 }}
              className="block text-sm text-gray-400 mt-3"
            >
              Plans start at <strong>$0/mo</strong>
            </motion.span>
            
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: 0.3 }}
            >
              <BadgeStrip />
            </motion.div>
          </div>
          
          <div className="relative max-w-lg mx-auto md:mr-8 lg:mr-12">
            <FormCard />
          </div>
        </div>
      </div>
      
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        aria-label="Scroll to why section"
        onClick={() => document.getElementById('why')?.scrollIntoView({ behavior: 'smooth' })}
        className="absolute bottom-0 left-0 group mt-12 w-full flex justify-center items-center"
      >
        <ChevronDownIcon className="w-6 h-6 text-gray-400 group-hover:text-white animate-bounce" />
      </motion.button>
    </section>
  );
} 