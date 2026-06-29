import { motion } from 'framer-motion'

const METRICS_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4'

const METRICS = [
  { value: '3', label: 'Solutions Built' },
  { value: '24/7', label: 'Self-Service Access' },
  { value: 'Instant', label: 'AI Answers' },
]

const WHAT_WE_BUILT = [
  { num: '01', title: 'Budget Portal', desc: 'SharePoint + desktop shortcut. Direct access to budget performance, accounts, projects, and remaining balance.' },
  { num: '02', title: 'Online Transfer Request', desc: 'See available budget, choose source & destination, submit digitally — no paperwork or back-and-forth.' },
  { num: '03', title: 'AI Agent', desc: 'Ask budget questions and get answers instantly — no waiting on the team, no searching Excel files.' },
]

export default function MetricsSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      <video
        src={METRICS_VIDEO}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
      />
      <div className="absolute inset-0 bg-brown-900/55" />

      <div className="relative z-10 w-full max-w-6xl mx-auto pt-32 pb-32 px-6">
        {/* Label */}
        <motion.p
          className="text-[13px] sm:text-[14px] tracking-[0.25em] uppercase mb-6 text-center"
          style={{ color: '#B5956A' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2 }}
        >
          What We Built
        </motion.p>

        {/* Key metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-24">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <div
                className="font-light tracking-[-0.04em] leading-none"
                style={{ fontSize: 'clamp(48px, 10vw, 96px)', color: '#FAF6F0' }}
              >
                {m.value}
              </div>
              <div className="text-[13px] sm:text-[15px] mt-4 tracking-wide" style={{ color: 'rgba(196,180,158,0.7)' }}>
                {m.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Solution cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHAT_WE_BUILT.map((item, i) => (
            <motion.div
              key={item.num}
              className="rounded-xl p-6 border"
              style={{ background: 'rgba(74,55,40,0.4)', borderColor: 'rgba(181,149,106,0.25)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
            >
              <div className="text-[28px] font-light mb-3" style={{ color: '#B5956A' }}>{item.num}</div>
              <div className="text-[15px] font-normal mb-2" style={{ color: '#FAF6F0' }}>{item.title}</div>
              <div className="text-[13px] leading-relaxed" style={{ color: 'rgba(240,232,220,0.55)' }}>{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
