'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const LampContainer = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-[#080808] w-full z-0 ${className}`}
    >
      {/* Light beam area */}
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0">
        {/* Left cone */}
        <motion.div
          initial={{ opacity: 0.5, width: '10rem' }}
          whileInView={{ opacity: 1, width: '22rem' }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[22rem] bg-gradient-conic from-cyan-500 via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          <div className="absolute w-full left-0 bg-[#080808] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-full left-0 bg-[#080808] bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* Right cone */}
        <motion.div
          initial={{ opacity: 0.5, width: '10rem' }}
          whileInView={{ opacity: 1, width: '22rem' }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
          style={{
            backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
          }}
          className="absolute inset-auto left-1/2 h-56 w-[22rem] bg-gradient-conic from-transparent via-transparent to-cyan-500 text-white [--conic-position:from_290deg_at_center_top]"
        >
          <div className="absolute w-40 h-full right-0 bg-[#080808] bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-full right-0 bg-[#080808] h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* Blur covers */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-[#080808] blur-2xl" />
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md" />

        {/* Central glow blob */}
        <div className="absolute inset-auto z-50 h-28 w-[22rem] -translate-y-1/2 rounded-full bg-cyan-500 opacity-40 blur-3xl" />

        {/* Inner bright glow */}
        <motion.div
          initial={{ width: '6rem' }}
          whileInView={{ width: '12rem' }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-30 h-28 w-48 -translate-y-[6rem] rounded-full bg-cyan-400 blur-2xl"
        />

        {/* The bar — the bright horizontal line */}
        <motion.div
          initial={{ width: '10rem' }}
          whileInView={{ width: '22rem' }}
          transition={{ delay: 0.2, duration: 0.8, ease: 'easeInOut' }}
          className="absolute inset-auto z-50 h-0.5 w-[22rem] -translate-y-[7rem] bg-cyan-400"
        />

        {/* Bottom cover to clip overflow */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-[#080808]" />
      </div>

      {/* Content — positioned below the lamp bar */}
      <div className="relative z-50 flex -translate-y-24 flex-col items-center px-5 w-full">
        {children}
      </div>
    </div>
  )
}
