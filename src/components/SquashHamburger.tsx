import { motion } from 'framer-motion'

interface SquashHamburgerProps {
  isOpen: boolean
  isMobile?: boolean
}

const spring = { type: 'spring' as const, stiffness: 300, damping: 20 }

export default function SquashHamburger({ isOpen, isMobile = false }: SquashHamburgerProps) {
  const w = isMobile ? 15 : 18
  const h = isMobile ? 10 : 12
  const barH = isMobile ? 1.2 : 1.5
  // center offset for top/bottom bar convergence
  const centerY = h / 2 - barH / 2

  return (
    <div className="relative flex-shrink-0" style={{ width: w, height: h }}>
      {/* Top bar */}
      <motion.span
        className="absolute left-0 bg-white block"
        style={{ width: '100%', height: barH, top: 0, originX: '50%', originY: '50%' }}
        animate={isOpen ? { rotate: 45, y: centerY } : { rotate: 0, y: 0 }}
        transition={spring}
      />
      {/* Middle bar */}
      <motion.span
        className="absolute left-0 bg-white block"
        style={{ width: '100%', height: barH, top: centerY }}
        animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
        transition={spring}
      />
      {/* Bottom bar */}
      <motion.span
        className="absolute left-0 bg-white block"
        style={{ width: '100%', height: barH, bottom: 0, originX: '50%', originY: '50%' }}
        animate={isOpen ? { rotate: -45, y: -centerY } : { rotate: 0, y: 0 }}
        transition={spring}
      />
    </div>
  )
}
