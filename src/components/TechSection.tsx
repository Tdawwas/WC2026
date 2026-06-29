import { motion } from 'framer-motion'

const TECH_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095750_32a52ce0-2005-45c9-9093-41f03fde9530.mp4'

const FEATURES = [
  { title: 'Budget Queries', desc: 'Ask about remaining balance, available accounts, and project budget in plain language.' },
  { title: 'Transfer Validation', desc: 'Check if funds are available before submitting a transfer request.' },
  { title: 'Policy Questions', desc: 'Get answers to budget policy and delegation of authority questions instantly.' },
  { title: '24/7 Access', desc: 'Self-service access for directors and approved users at any time.' },
]

export default function TechSection() {
  return (
    <section className="relative h-screen h-[100dvh] overflow-hidden flex flex-col px-8 sm:px-12 md:px-16 py-12 sm:py-16">
      <video
        src={TECH_VIDEO}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay muted loop playsInline
      />
      <div className="absolute inset-0 bg-brown-900/50" />

      <div className="relative z-10 flex flex-col h-full">
        {/* Top */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0 }}
          >
            <div className="text-[11px] tracking-[0.25em] uppercase mb-4" style={{ color: '#B5956A' }}>
              The AI Agent in Action
            </div>
            <h2
              className="font-light leading-[0.95] tracking-[-0.03em]"
              style={{ fontSize: 'clamp(34px, 7vw, 68px)', color: '#FAF6F0' }}
            >
              Ask in plain
              <br />
              language.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.0, delay: 0.2 }}
          >
            <p
              className="text-[13px] sm:text-[15px] leading-relaxed max-w-xs md:text-right md:pt-2"
              style={{ color: 'rgba(240,232,220,0.6)' }}
            >
              Directors and approved users query live budget data conversationally —
              availability, remaining balance, valid source lines — with no email,
              no spreadsheets, and no wait on the budget team.
            </p>
            <div className="flex md:justify-end gap-8 mt-6">
              <div>
                <div className="text-[28px] font-light" style={{ color: '#FAF6F0' }}>24/7</div>
                <div className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(181,149,106,0.8)' }}>Self-Service</div>
              </div>
              <div>
                <div className="text-[28px] font-light" style={{ color: '#FAF6F0' }}>Seconds</div>
                <div className="text-[11px] tracking-[0.15em] uppercase mt-1" style={{ color: 'rgba(181,149,106,0.8)' }}>To Answer</div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="flex-1" />

        {/* Feature grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.3 }}
        >
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.1 }}
            >
              <div className="text-[14px] sm:text-[15px] font-normal mb-2" style={{ color: '#FAF6F0' }}>{f.title}</div>
              <div className="text-[12px] sm:text-[13px] leading-relaxed" style={{ color: 'rgba(240,232,220,0.5)' }}>{f.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
