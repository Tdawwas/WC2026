import { useRef } from 'react'
import { motion, useScroll, useSpring, useTransform, useMotionTemplate } from 'framer-motion'

const CINEMATIC_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_092455_089c54f8-3b03-4966-9df1-e9746063d0ef.mp4'

export default function CinematicSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 15, damping: 32, mass: 1.8 })
  const yValue = useTransform(smoothProgress, [0, 1], [60, -120])
  const opacityValue = useTransform(smoothProgress, [0.3, 0.5], [0, 1])
  const transformValue = useMotionTemplate`rotateX(24deg) translateY(${yValue}px) translateZ(15px)`

  return (
    <section ref={sectionRef} className="relative h-screen h-[100dvh] overflow-hidden flex items-center justify-center">
      <video
        src={CINEMATIC_VIDEO}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
      />

      {/* Warm overlay */}
      <div className="absolute inset-0 bg-brown-900/50" />

      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 right-0 z-10 pointer-events-none"
        style={{ height: 180, background: 'linear-gradient(to bottom, rgba(74,55,40,0.8), transparent)' }}
      />

      {/* 3D text */}
      <div className="relative z-20 max-w-5xl w-full" style={{ perspective: '400px' }}>
        <motion.p
          className="font-normal text-[22px] sm:text-[30px] md:text-[36px] lg:text-[42px] leading-[1.35] tracking-[-0.02em] select-none px-6 sm:px-12 text-center"
          style={{ transform: transformValue, opacity: opacityValue, color: '#FAF6F0' }}
        >
          The old process relied on manual follow-up, templates, and repeated questions to the
          budget team. Every transfer request needed back-and-forth clarification. Every budget
          question meant a delay. Directors had no live visibility into their budgets. The team's
          time was consumed by repetitive requests instead of value-added review and control.
        </motion.p>
      </div>
    </section>
  )
}
