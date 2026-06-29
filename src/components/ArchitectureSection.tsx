import { motion } from 'framer-motion'

const ROWS = [
  {
    area: 'Monthly Reporting',
    before: 'Budget team sent a monthly email and waited for directors to return variance justifications.',
    after: 'Directors open the portal and review performance directly, then add justifications — far less email follow-up.',
  },
  {
    area: 'Budget Transfers',
    before: 'Requester filled a paper/template form and asked basic questions about balance or valid source lines.',
    after: 'Requester views budget, remaining balance, and available projects/accounts, then submits online.',
  },
  {
    area: 'Budget Questions',
    before: 'Directors and end users contacted the budget team or searched Excel files for answers.',
    after: 'The AI agent gives quick answers to budget questions for directors and approved users.',
  },
  {
    area: 'Team Effort',
    before: 'Time spent on manual follow-up and repeated clarifications.',
    after: 'More time available for review, control, and decision support.',
  },
]

export default function ProcessImpactSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center" style={{ background: '#FAF6F0' }}>
      <div className="w-full max-w-5xl mx-auto px-6 py-28">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0 }}
        >
          <p className="text-[12px] sm:text-[13px] tracking-[0.25em] uppercase mb-6" style={{ color: '#B5956A' }}>
            Process Impact
          </p>
          <h2
            className="font-light leading-[1.1] tracking-[-0.02em] mb-8"
            style={{ fontSize: 'clamp(28px, 5.5vw, 52px)', color: '#4A3728' }}
          >
            From manual handling to
            <br />
            guided self-service.
          </h2>
        </motion.div>

        {/* Table */}
        <motion.div
          className="overflow-hidden rounded-xl border"
          style={{ borderColor: '#D9CCBE' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.0, delay: 0.3 }}
        >
          {/* Header row */}
          <div className="grid grid-cols-3 text-[11px] tracking-[0.2em] uppercase" style={{ background: '#4A3728', color: '#C4B49E' }}>
            <div className="px-5 py-4">Area</div>
            <div className="px-5 py-4 border-l" style={{ borderColor: 'rgba(181,149,106,0.2)' }}>Before</div>
            <div className="px-5 py-4 border-l" style={{ borderColor: 'rgba(181,149,106,0.2)' }}>After</div>
          </div>

          {ROWS.map((row, i) => (
            <motion.div
              key={row.area}
              className="grid grid-cols-3 border-t"
              style={{ borderColor: '#D9CCBE', background: i % 2 === 0 ? '#FAF6F0' : '#F0E8DC' }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <div className="px-5 py-5 text-[12px] sm:text-[13px] font-normal" style={{ color: '#8B0000' }}>
                {row.area}
              </div>
              <div className="px-5 py-5 text-[12px] sm:text-[13px] leading-relaxed border-l" style={{ color: '#6B4F3A', borderColor: '#D9CCBE' }}>
                {row.before}
              </div>
              <div className="px-5 py-5 text-[12px] sm:text-[13px] leading-relaxed border-l" style={{ color: '#4A3728', borderColor: '#D9CCBE' }}>
                {row.after}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
