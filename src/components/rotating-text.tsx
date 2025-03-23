"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface RotatingTextProps {
  texts: string[]
  interval?: number
  className?: string
}

export default function RotatingText({ texts, interval = 2000, className = "" }: RotatingTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % texts.length)
    }, interval)

    return () => clearInterval(timer)
  }, [texts, interval])

  return (
    <div className={`relative h-8 sm:h-10 md:h-12 w-full ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute left-0 right-0 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold"
        >
          {texts[currentIndex]}
        </motion.span>
      </AnimatePresence>
    </div>
  )
}

