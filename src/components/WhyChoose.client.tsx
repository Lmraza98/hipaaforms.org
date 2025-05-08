'use client'

import { ShieldCheckIcon, Squares2X2Icon, ArrowDownTrayIcon } from "@heroicons/react/24/solid";
import { motion } from 'framer-motion';
import { fadeUp } from './animations';

export default function WhyChoose() {
  return (
    <section id="why" className="bg-gray-50 dark:bg-[#0A0D14] py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Why Choose HIPAAForms.org?</h2>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ show: { transition: { staggerChildren: 0.15 }}}}
          className="grid gap-8 lg:gap-12 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto px-6"
        >
          <motion.article variants={fadeUp} className="flex flex-col items-start gap-6 h-full rounded-2xl bg-white/60 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700 p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] backdrop-blur transition hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/15">
              <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">HIPAA Secure</h3>
              <p className="flex-1 text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                All forms and data handling follow HIPAA security and privacy guidelines to protect sensitive health information.
              </p>
            </div>
          </motion.article>
          
          <motion.article variants={fadeUp} className="flex flex-col items-start gap-6 h-full rounded-2xl bg-white/60 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700 p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] backdrop-blur transition hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/15">
              <Squares2X2Icon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customizable</h3>
              <p className="flex-1 text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                Easily customize forms to fit your practice&apos;s specific needs while maintaining compliance requirements.
              </p>
            </div>
          </motion.article>
          
          <motion.article variants={fadeUp} className="flex flex-col items-start gap-6 h-full rounded-2xl bg-white/60 dark:bg-gray-800/80 border border-gray-200/60 dark:border-gray-700 p-8 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.05)] backdrop-blur transition hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center justify-center w-14 h-14 rounded-full bg-blue-500/15">
              <ArrowDownTrayIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Instant Download</h3>
              <p className="flex-1 text-sm md:text-base leading-relaxed text-gray-600 dark:text-gray-300">
                Get immediate access to all forms after purchase. No waiting, start using right away.
              </p>
            </div>
          </motion.article>
        </motion.div>
      </div>
    </section>
  );
} 