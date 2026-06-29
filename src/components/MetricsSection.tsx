import { motion } from 'framer-motion'

const METRICS_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_095810_ecea3dd2-fc5e-4e41-8696-4219290b6589.mp4'

const METRICS = [
  { value: '2.4ms', label: 'Synaptic Latency' },
  { value: '99.7%', label: 'Signal Accuracy' },
  { value: '140B', label: 'Neural Parameters' },
]

export default function MetricsSection() {
  return (
    <section className="relative min-h-screen overflow-hidden flex items-center justify-center">
      {/* Video background */}
      <video
        src={METRICS_VIDEO}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto pt-32 pb-32 px-6">
        {/* Subtitle */}
        <motion.p
          className="text-white/40 text-[13px] sm:text-[14px] tracking-[0.2em] uppercase mb-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.2 }}
        >
          Performance Metrics
        </motion.p>

        {/* Metrics grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
            >
              <div
                className="text-white font-light tracking-[-0.04em] leading-none"
                style={{ fontSize: 'clamp(48px, 10vw, 96px)' }}
              >
                {metric.value}
              </div>
              <div className="text-white/40 text-[13px] sm:text-[15px] mt-4 tracking-wide">
                {metric.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
