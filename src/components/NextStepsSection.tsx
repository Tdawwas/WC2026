import { motion } from 'framer-motion'

const STEPS = [
  {
    phase: 'NOW',
    title: 'Portal Live',
    desc: 'Budget portal available in SharePoint and prepared for desktop shortcut access for all directors.',
    active: true,
  },
  {
    phase: 'NEXT',
    title: 'Power Automate',
    desc: 'Awaiting IT to provide Power Automate licenses to begin workflow automation.',
    active: false,
  },
  {
    phase: 'THEN',
    title: 'Full Automation',
    desc: 'Automate the complete transfer request process end to end — from submission to approval.',
    active: false,
  },
  {
    phase: 'FUTURE',
    title: 'Budget History',
    desc: 'Build a consolidated budget history from 2021 to date — enabling trend analysis by department, account, and project.',
    active: false,
  },
]

export default function NextStepsSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center" style={{ background: '#F0E8DC' }}>
      <div className="w-full max-w-5xl mx-auto px-6 py-28">
        {/* Heading */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0 }}
        >
          <p className="text-[12px] sm:text-[13px] tracking-[0.25em] uppercase mb-6" style={{ color: '#B5956A' }}>
            Next Steps
          </p>
          <h2
            className="font-light leading-[1.1] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(28px, 5.5vw, 52px)', color: '#4A3728' }}
          >
            What comes next.
          </h2>
          <p className="mt-4 text-[14px] sm:text-[15px] leading-relaxed max-w-xl" style={{ color: '#8A745F' }}>
            The current work already improves the experience. The next phase deepens automation
            and expands the data behind it.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
          {/* Connecting line */}
          <div
            className="absolute top-6 left-0 right-0 hidden md:block"
            style={{ height: 1, background: '#D9CCBE', zIndex: 0 }}
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.phase}
              className="relative flex flex-col"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
            >
              {/* Phase dot + connector */}
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-[10px] tracking-[0.15em] uppercase flex-shrink-0"
                  style={{
                    background: step.active ? '#8B0000' : '#E4DACB',
                    color: step.active ? '#FAF6F0' : '#9D8A76',
                    border: step.active ? 'none' : '1px solid #C4B49E',
                  }}
                >
                  {step.phase}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="flex-1 hidden md:block" />
                )}
              </div>

              {/* Content */}
              <div className="md:pr-8">
                <div className="text-[14px] sm:text-[15px] font-normal mb-2" style={{ color: step.active ? '#8B0000' : '#4A3728' }}>
                  {step.title}
                </div>
                <div className="text-[12px] sm:text-[13px] leading-relaxed" style={{ color: '#8A745F' }}>
                  {step.desc}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Automation target note */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.0, delay: 0.4 }}
        >
          {[
            {
              label: 'Automation Target',
              text: 'Once Power Automate licenses are available, the transfer request moves from online submission to full workflow automation.',
            },
            {
              label: 'Data Foundation Target',
              text: 'A consolidated budget history from 2021 onward enables trend analysis by department, account, and project.',
            },
          ].map((note) => (
            <div
              key={note.label}
              className="rounded-xl p-6 border"
              style={{ background: '#FAF6F0', borderColor: '#D9CCBE' }}
            >
              <div className="text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: '#B5956A' }}>{note.label}</div>
              <div className="text-[13px] leading-relaxed" style={{ color: '#6B4F3A' }}>{note.text}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
