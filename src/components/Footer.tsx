import SynapseXLogo from './SynapseXLogo'

const FOOTER_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260622_080203_fd7f4f85-3a86-4837-8192-85e7bfe68e75.mp4'

const SUMMARY_POINTS = [
  'Monthly reporting is easier to review and less dependent on manual follow-up.',
  'Transfer requests are more informed before they reach the budget team.',
  'Directors gain fast access to budget information through the portal and AI agent.',
  'The next phase is workflow automation and a full budget history from 2021 onward.',
]

export default function Footer() {
  return (
    <footer className="overflow-hidden" style={{ background: '#4A3728' }}>
      <div className="flex flex-col md:flex-row min-h-[420px]">
        {/* Left: video */}
        <div className="relative md:flex-1 h-[280px] md:h-auto overflow-hidden">
          <video
            src={FOOTER_VIDEO}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay muted loop playsInline
          />
          <div className="absolute inset-0" style={{ background: 'rgba(74,55,40,0.35)' }} />
        </div>

        {/* Right: content */}
        <div className="md:flex-1 flex flex-col justify-between p-10 sm:p-14">
          {/* Top */}
          <div>
            <div className="flex items-center gap-2 mb-8">
              <SynapseXLogo size={18} className="text-bronze" />
              <span className="text-[15px] font-medium tracking-tight" style={{ color: '#B5956A' }}>Budget AI</span>
            </div>

            <p className="text-[11px] tracking-[0.2em] uppercase mb-6" style={{ color: 'rgba(181,149,106,0.7)' }}>
              Summary
            </p>
            <h3
              className="font-light leading-[1.2] tracking-[-0.02em] mb-8"
              style={{ fontSize: 'clamp(18px, 3vw, 28px)', color: '#FAF6F0' }}
            >
              From follow-up and forms to visibility,
              <br />
              self-service, and automation.
            </h3>

            <ul className="space-y-3">
              {SUMMARY_POINTS.map((point, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-1 flex-shrink-0 text-[10px]" style={{ color: '#B5956A' }}>0{i + 1}</span>
                  <span className="text-[13px] leading-relaxed" style={{ color: 'rgba(240,232,220,0.65)' }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgba(181,149,106,0.2)' }}>
            <p className="text-[24px] font-light mb-2" style={{ color: '#FAF6F0' }}>Thank you</p>
            <p className="text-[12px]" style={{ color: 'rgba(181,149,106,0.6)' }}>
              Prepared by Budget Section • Financial Affairs Department
            </p>
            <p className="text-[11px] mt-4" style={{ color: 'rgba(181,149,106,0.35)' }}>
              © 2026 Financial Affairs Department. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
