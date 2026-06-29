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

    if (isSeeking.current) {
      pendingSeekRef.current = newTime
      return
    }

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
      {/* Video background — mouse-scrubbed, NOT autoplay */}
      <video
        ref={videoRef}
        src={HERO_VIDEO}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      />

      {/* Dot grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.05,
        }}
      />

      {/* Background watermark text */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        style={{ marginTop: 50 }}
      >
        <span
          style={{
            fontFamily: '"Anton SC", sans-serif',
            fontSize: 'clamp(120px, 30vw, 521px)',
            textTransform: 'uppercase',
            letterSpacing: '-4px',
            opacity: 0.10,
            background: 'radial-gradient(circle, rgba(142,127,148,0) 0%, #8E7F94 70%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: 1,
          }}
        >
          TRANSCENDENCE
        </span>
      </div>

      {/* Hero content */}
      <motion.div
        className="relative z-10 flex flex-col flex-1 px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 pb-8 sm:pb-12"
        animate={{ opacity: entranceComplete ? 1 : 0 }}
        transition={{ duration: 1 }}
        initial={{ opacity: 0 }}
      >
        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom row */}
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Left column */}
          <div className="flex flex-col gap-4">
            <h1
              className="text-white font-light leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(40px, 10vw, 100px)' }}
            >
              <ScrambleIn text="Brain" delay={200} triggered={entranceComplete} />
              <br />
              <ScrambleIn text="And Body" delay={500} triggered={entranceComplete} />
            </h1>

            <motion.p
              className="max-w-sm text-[13px] sm:text-[15px] text-white/60 leading-relaxed"
              initial={{ opacity: 0, y: 25 }}
              animate={entranceComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 25 }}
              transition={{ duration: 0.9, ease: [0.215, 0.61, 0.355, 1.0], delay: 0.2 }}
            >
              Built at the intersection of neuroscience and artificial intelligence. SynapseX
              continuously maps neural pathways, cognitive load, and physiological states into a
              single adaptive intelligence layer.
            </motion.p>
          </div>

          {/* Right heading */}
          <h1
            className="text-white font-light leading-[0.95] tracking-[-0.03em] text-left md:text-right"
            style={{ fontSize: 'clamp(40px, 10vw, 100px)' }}
          >
            <ScrambleIn text="One" delay={700} triggered={entranceComplete} />
            <br />
            <ScrambleIn text="Network" delay={1000} triggered={entranceComplete} />
          </h1>
        </div>
      </motion.div>
    </section>
  )
}
