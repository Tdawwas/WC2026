import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import CinematicSection from './components/CinematicSection'
import MetricsSection from './components/MetricsSection'
import TechSection from './components/TechSection'
import ArchitectureSection from './components/ArchitectureSection'
import Footer from './components/Footer'

export default function App() {
  const [entranceComplete, setEntranceComplete] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setEntranceComplete(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div style={{ fontFamily: '"Space Mono", monospace' }}>
      <Navbar entranceComplete={entranceComplete} />
      <HeroSection entranceComplete={entranceComplete} />
      <CinematicSection />
      <MetricsSection />
      <TechSection />
      <ArchitectureSection />
      <Footer />
    </div>
  )
}
