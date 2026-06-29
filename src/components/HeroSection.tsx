import { useRef, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import ScrambleIn from './ScrambleIn'

const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_083515_290e5a10-0b95-41af-a5e2-32b6389baa4d.mp4'

interface HeroSectionProps {
  entranceComplete: boolean
}

export default function HeroSection({ entranceComplete }: HeroSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const isSeeking = useRef(false)
  const pendingSeekRef = useRef<number | null>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const video = videoRef.current
    if (!video || !video.duration) return
    const timeDelta = (e.movementX / window.innerWidth) * video.duration * 0.8
    const newTime = Math.max(0, Math.min(video.duration, video.currentTime + timeDelta))
    if (isSeeking.current) { pendingSeekRef.current = newTime; return }
    isSeeking.current = true
    video.currentTime = newTime
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const handleSeeked = () => {
      isSeeking.current = false
      if (pendingSeekRef.current !== null) {
        const time = pendingSeekRef.current
        pendingSeekRef.current = null
        isSeeking.current = true
        const v = videoRef.current
        if (v) v.currentTime = time
      }
    }
    video.addEventListener('seeked', handleSeeked)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      video.removeEventListener('seeked', handleSeeked)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <section className="relative h-screen h-[100dvh] overflow-hidden flex flex-col">
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        className="absolute inset-0 w-full h-full object-cover"
        muted playsInline preload="auto"
      />

      {/* Warm brown overlay */}
      <div className="absolute inset-0 bg-brown-900/40" />

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(250,246,240,0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.4,
        }}
      />

      {/* Background watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ marginTop: 40 }}>
        <span
          style={{
            fontFamily: '"Anton SC", sans-serif',
            fontSize: 'clamp(80px, 22vw, 400px)',
            textTransform: 'uppercase',
            letterSpacing: '-4px',
            opacity: 0.07,
            background: 'radial-gradient(circle, rgba(181,149,106,0) 0%, #B5956A 70%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}
        >
          TRANSFORMATION
        </span>
      </div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 flex flex-col flex-1 px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12"
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
        initial={{ opacity: 0 }}
      >
        {/* Department tag */}
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={entranceComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <span
            className="inline-block text-[11px] sm:text-[12px] tracking-[0.25em] uppercase px-3 py-1.5 rounded"
            style={{ background: 'rgba(181,149,106,0.25)', color: '#C4B49E', border: '1px solid rgba(181,149,106,0.3)' }}
          >
            Financial Affairs Department • Budget Section • June 2026
          </span>
        </motion.div>

        <div className="flex-1" />

        {/* Bottom row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <h1
              className="font-light leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(38px, 9vw, 92px)', color: '#FAF6F0' }}
            >
              <ScrambleIn text="AI-Enabled" delay={200} triggered={entranceComplete} />
              <br />
              <ScrambleIn text="Transformation" delay={500} triggered={entranceComplete} />
            </h1>

            <motion.p
              className="max-w-sm text-[13px] sm:text-[15px] leading-relaxed"
              style={{ color: 'rgba(240,232,220,0.7)' }}
              initial={{ opacity: 0, y: 25 }}
              animate={entranceComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1.0], delay: 0.2 }}
            >
              How the budget team improved monthly reporting, transfer requests, and
              self-service budget support for directors.
            </motion.p>
          </div>

          {/* Right */}
          <h1
            className="font-light leading-[0.95] tracking-[-0.03em] text-left md:text-right"
            style={{ fontSize: 'clamp(38px, 9vw, 92px)', color: '#FAF6F0' }}
          >
            <ScrambleIn text="Budget" delay={700} triggered={entranceComplete} />
            <br />
            <ScrambleIn text="Section" delay={1000} triggered={entranceComplete} />
          </h1>
        </div>
      </motion.div>
    </section>
  )
}
