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
  const [portalHovered, setPortalHovered] = useState(false)
  const [aboutHovered, setAboutHovered] = useState(false)
  const [impactHovered, setImpactHovered] = useState(false)

  const pillBg = 'rgba(240, 232, 220, 0.88)'
  const pillBgHover = 'rgba(229, 218, 203, 0.95)'

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center px-4 sm:px-6"
      animate={{ opacity: entranceComplete ? 1 : 0 }}
      transition={{ duration: 0.8 }}
      initial={{ opacity: 0 }}
    >
      {/* ── DESKTOP ── */}
      <div className="hidden sm:flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {/* Logo pill */}
          <motion.div
            className="flex items-center gap-2 h-12 px-5 cursor-pointer select-none"
            style={{ background: pillBg, backdropFilter: 'blur(12px)', borderRadius: 14 }}
            whileHover={{ background: pillBgHover, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <SynapseXLogo size={18} className="text-maroon" />
            <span className="text-brown-900 text-[15px] font-medium tracking-tight">Budget AI</span>
          </motion.div>

          {/* Expanding menu pill */}
          <motion.div
            className="relative h-12 overflow-hidden flex items-center"
            style={{ background: pillBg, backdropFilter: 'blur(12px)', borderRadius: 14 }}
            animate={{ width: menuOpen ? 270 : 48 }}
            transition={menuSpring}
          >
            <motion.button
              className="flex-shrink-0 flex items-center justify-center cursor-pointer"
              style={{ background: menuOpen ? 'rgba(74,55,40,0.08)' : 'transparent' }}
              animate={{
                width: menuOpen ? 36 : 48,
                height: menuOpen ? 36 : 48,
                borderRadius: menuOpen ? 11 : 14,
                marginLeft: menuOpen ? 6 : 0,
              }}
              transition={menuSpring}
              onClick={() => setMenuOpen(!menuOpen)}
              whileHover={{ background: 'rgba(74,55,40,0.12)' }}
            >
              <SquashHamburger isOpen={menuOpen} color="#4A3728" />
            </motion.button>

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
                    className="text-[15px] font-normal text-brown-700 hover:text-brown-900 transition-colors"
                    onMouseEnter={() => setAboutHovered(true)}
                    onMouseLeave={() => setAboutHovered(false)}
                    onClick={() => { scrollTo(window.innerHeight); setMenuOpen(false) }}
                  >
                    <ScrambleText text="About" isHovered={aboutHovered} />
                  </button>
                  <button
                    className="text-[15px] font-normal text-brown-700 hover:text-brown-900 transition-colors"
                    onMouseEnter={() => setImpactHovered(true)}
                    onMouseLeave={() => setImpactHovered(false)}
                    onClick={() => { scrollTo(window.innerHeight * 2.5); setMenuOpen(false) }}
                  >
                    <ScrambleText text="Impact" isHovered={impactHovered} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* CTA button */}
        <motion.button
          className="flex items-center gap-2 h-12 px-6 rounded-full text-cream text-[14px] font-medium cursor-pointer select-none"
          style={{ background: '#8B0000' }}
          whileHover={{ scale: 1.03, background: '#6B0000' }}
          whileTap={{ scale: 0.97 }}
          onMouseEnter={() => setPortalHovered(true)}
          onMouseLeave={() => setPortalHovered(false)}
        >
          <i className="bi bi-grid text-[16px]" />
          <ScrambleText text="Open Portal" isHovered={portalHovered} />
        </motion.button>
      </div>

      {/* ── MOBILE ── */}
      <div className="flex sm:hidden items-center justify-between w-full">
        <motion.div
          className="flex items-center gap-2 h-9 px-3.5 overflow-hidden cursor-pointer"
          style={{ background: pillBg, backdropFilter: 'blur(12px)', borderRadius: 10 }}
          animate={{ width: menuOpen ? 0 : 'auto', opacity: menuOpen ? 0 : 1 }}
          transition={menuSpring}
        >
          <SynapseXLogo size={14} className="text-maroon flex-shrink-0" />
          <span className="text-brown-900 text-[13px] font-medium tracking-tight whitespace-nowrap">Budget AI</span>
        </motion.div>

        <motion.div
          className="relative h-9 overflow-hidden flex items-center"
          style={{ background: pillBg, backdropFilter: 'blur(12px)', borderRadius: 10 }}
          animate={{ width: menuOpen ? '100%' : 36 }}
          transition={menuSpring}
        >
          <motion.button
            className="flex-shrink-0 flex items-center justify-center"
            style={{ background: menuOpen ? 'rgba(74,55,40,0.08)' : 'transparent' }}
            animate={{ width: menuOpen ? 30 : 36, height: menuOpen ? 30 : 36, borderRadius: menuOpen ? 8 : 10, marginLeft: menuOpen ? 4 : 0 }}
            transition={menuSpring}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <SquashHamburger isOpen={menuOpen} isMobile color="#4A3728" />
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
                <button className="text-[13px] text-brown-700" onClick={() => { scrollTo(window.innerHeight); setMenuOpen(false) }}>About</button>
                <button className="text-[13px] text-brown-700" onClick={() => { scrollTo(window.innerHeight * 2.5); setMenuOpen(false) }}>Impact</button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.button
          className="flex items-center gap-1.5 h-9 px-3.5 rounded-full text-cream text-[12px] font-medium"
          style={{ background: '#8B0000' }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <i className="bi bi-grid text-[13px]" />
          <span>Portal</span>
        </motion.button>
      </div>
    </motion.nav>
  )
}
