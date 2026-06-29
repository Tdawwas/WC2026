import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SynapseXLogo from './SynapseXLogo'
import ScrambleText from './ScrambleText'
import SquashHamburger from './SquashHamburger'

interface NavbarProps {
  entranceComplete: boolean
}

const menuSpring = { type: 'spring' as const, stiffness: 350, damping: 28 }

function scrollTo(px: number) {
  window.scrollTo({ top: px, behavior: 'smooth' })
}

export default function Navbar({ entranceComplete }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dlHovered, setDlHovered] = useState(false)
  const [aboutHovered, setAboutHovered] = useState(false)
  const [metricsHovered, setMetricsHovered] = useState(false)

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-4 sm:px-6"
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      initial={{ opacity: 0 }}
    >
      {/* ── DESKTOP NAV ── */}
      <div className="hidden sm:flex items-center justify-between w-full">
        {/* Left group */}
        <div className="flex items-center gap-2">
          {/* Logo pill */}
          <motion.div
            className="flex items-center gap-2 h-12 px-5 cursor-pointer select-none"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 14 }}
            whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.22)' }}
            whileTap={{ scale: 0.98 }}
          >
            <SynapseXLogo size={18} className="text-white" />
            <span className="text-white text-[16px] font-medium tracking-tight">SynapseX</span>
          </motion.div>

          {/* Expanding menu pill */}
          <motion.div
            className="relative h-12 overflow-hidden flex items-center"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 14 }}
            animate={{ width: menuOpen ? 290 : 48 }}
            transition={menuSpring}
          >
            {/* Hamburger button */}
            <motion.button
              className="flex-shrink-0 flex items-center justify-center cursor-pointer"
              style={{ background: menuOpen ? 'rgba(255,255,255,0.1)' : 'transparent' }}
              animate={{
                width: menuOpen ? 36 : 48,
                height: menuOpen ? 36 : 48,
                borderRadius: menuOpen ? 11 : 14,
                marginLeft: menuOpen ? 6 : 0,
              }}
              transition={menuSpring}
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ background: menuOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' }}
            >
              <SquashHamburger isOpen={menuOpen} />
            </motion.button>

            {/* Nav links */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  className="flex items-center gap-5 ml-4 whitespace-nowrap"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    className="text-[16px] font-normal text-white/85 hover:text-white transition-colors"
                    onMouseEnter={() => setAboutHovered(true)}
                    onMouseLeave={() => setAboutHovered(false)}
                    onClick={() => { scrollTo(window.innerHeight); setMenuOpen(false) }}
                  >
                    <ScrambleText text="About" isHovered={aboutHovered} />
                  </button>
                  <button
                    className="text-[16px] font-normal text-white/85 hover:text-white transition-colors"
                    onMouseEnter={() => setMetricsHovered(true)}
                    onMouseLeave={() => setMetricsHovered(false)}
                    onClick={() => { scrollTo(window.innerHeight * 2); setMenuOpen(false) }}
                  >
                    <ScrambleText text="Metrics" isHovered={metricsHovered} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Download button */}
        <motion.button
          className="flex items-center gap-2 h-12 px-6 bg-white rounded-full text-black text-[15px] font-medium cursor-pointer select-none"
          whileHover={{ scale: 1.03, background: '#e2e2e6' }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setDlHovered(true)}
          onMouseLeave={() => setDlHovered(false)}
        >
          <i className="bi bi-apple text-[18px]" />
          <ScrambleText text="Download" isHovered={dlHovered} />
        </motion.button>
      </div>

      {/* ── MOBILE NAV ── */}
      <div className="flex sm:hidden items-center justify-between w-full">
        {/* Logo pill (hides when menu open) */}
        <motion.div
          className="flex items-center gap-2 h-9 px-3.5 overflow-hidden cursor-pointer"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 10 }}
          animate={{ width: menuOpen ? 0 : 'auto', opacity: menuOpen ? 0 : 1, paddingLeft: menuOpen ? 0 : undefined, paddingRight: menuOpen ? 0 : undefined }}
          transition={menuSpring}
        >
          <SynapseXLogo size={14} className="text-white flex-shrink-0" />
          <span className="text-white text-[13px] font-medium tracking-tight whitespace-nowrap">SynapseX</span>
        </motion.div>

        {/* Menu capsule */}
        <motion.div
          className="relative h-9 overflow-hidden flex items-center"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', borderRadius: 10 }}
          animate={{ width: menuOpen ? '100%' : 36 }}
          transition={menuSpring}
        >
          <motion.button
            className="flex-shrink-0 flex items-center justify-center"
            style={{ background: menuOpen ? 'rgba(255,255,255,0.1)' : 'transparent' }}
            animate={{
              width: menuOpen ? 30 : 36,
              height: menuOpen ? 30 : 36,
              borderRadius: menuOpen ? 8 : 10,
              marginLeft: menuOpen ? 4 : 0,
            }}
            transition={menuSpring}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <SquashHamburger isOpen={menuOpen} isMobile />
          </motion.button>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="flex items-center gap-4 ml-3 whitespace-nowrap"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.18 }}
              >
                <button
                  className="text-[13px] font-normal text-white/85"
                  onClick={() => { scrollTo(window.innerHeight); setMenuOpen(false) }}
                >
                  About
                </button>
                <button
                  className="text-[13px] font-normal text-white/85"
                  onClick={() => { scrollTo(window.innerHeight * 2); setMenuOpen(false) }}
                >
                  Metrics
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Download button */}
        <motion.button
          className="flex items-center gap-1.5 h-9 px-3.5 bg-white rounded-full text-black text-[13px] font-medium cursor-pointer select-none"
          whileHover={{ scale: 1.03, background: '#e2e2e6' }}
          whileTap={{ scale: 0.97 }}
        >
          <i className="bi bi-apple text-[15px]" />
          <span>Download</span>
        </motion.button>
      </div>
    </motion.nav>
  )
}
