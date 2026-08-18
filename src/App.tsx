import { useState, useEffect, useRef, useCallback } from 'react'

/* ─── icons ─────────────────────────────────────────────────────────────── */

const iconProps = { fill: 'none', stroke: 'currentColor', viewBox: '0 0 24 24' } as const

function IconPhone({ className = '' }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5c0-1.1.9-2 2-2h2.28a1 1 0 0 1 .97.76l1.1 4.42a1 1 0 0 1-.5 1.12l-1.9 1.07a12.1 12.1 0 0 0 5.66 5.66l1.07-1.9a1 1 0 0 1 1.12-.5l4.42 1.1a1 1 0 0 1 .76.97V19c0 1.1-.9 2-2 2h-1C9.16 21 3 14.84 3 7V6" />
    </svg>
  )
}

function IconChat({ className = '' }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 8.4 8.4 0 0 1-3.9-.95L3 21l1.95-5.6A8.5 8.5 0 1 1 21 11.5Z" />
    </svg>
  )
}

function IconMail({ className = '' }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6h18v12H3V6Zm0 0 9 7 9-7" />
    </svg>
  )
}

function IconPin({ className = '' }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21s7-6.3 7-11.4A7 7 0 0 0 5 9.6C5 14.7 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.4" strokeWidth={1.5} />
    </svg>
  )
}

function IconChevronLeft({ className = '' }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.41 7.41L10.83 12l4.58 4.59L14 18l-6-6 6-6z" />
    </svg>
  )
}

function IconChevronRight({ className = '' }: { className?: string }) {
  return (
    <svg className={className} {...iconProps}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z" />
    </svg>
  )
}

/* ─── hooks ─────────────────────────────────────────────────────────────── */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(ease * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return val
}

function useParallax() {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return offset
}

function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setProgress(h > 0 ? window.scrollY / h : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return progress
}

function useNavShrink() {
  const [shrunk, setShrunk] = useState(false)
  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return shrunk
}

/* ─── Fade-in wrapper ───────────────────────────────────────────────────── */
function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
  className?: string
}) {
  const { ref, visible } = useInView()
  const translate = { up: 'translateY(32px)', left: 'translateX(-32px)', right: 'translateX(32px)', none: 'none' }
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : translate[direction],
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

/* ─── data ──────────────────────────────────────────────────────────────── */

const NAV_LINKS = ['Services', 'À propos', 'Contact']

const SERVICES = [
  {
    num: '01',
    images: ['/IMAGE 9.jpg', '/IMAGE 6.jpg'],
    title: 'Décapage & Terrassement',
    desc: 'Nos bulldozers et engins de terrassement préparent et nettoient le terrain pour vos projets.',
  },
  {
    num: '02',
    images: ['/IMAGE 50.jpg', '/IMAGE 7.jpg', '/IMAGE 11.jpg', '/IMAGE 3.jpg', '/IMAGE 4.jpg'],
    title: 'Assainissement & VRD',
    desc: 'Pose des caniveaux et réseaux d\'eau pour un assainissement durable et efficace.',
  },
  {
    num: '03',
    images: ['/IMAGE 41.jpg', '/IMAGE 8.jpg', '/IMAGE 13.jpg', '/IMAGE 16.jpg', '/IMAGE 18.jpg'],
    title: 'Voirie & Compactage',
    desc: 'Nivelleuse, compacteur et piste finalisée : une voirie professionnelle et durable.',
  },
  {
    num: '04',
    images: ['/IMAGE 60.jpg', '/IMAGE 5.jpg', '/IMAGE 14.jpg', '/IMAGE 26.jpg'],
    title: 'Topographie',
    desc: 'Études topographiques et levés de terrain pour une planification précise de vos projets de construction et d\'aménagement.',
  },
  {
    num: '05',
    images: ['/IMAGE 21.jpg', '/IMAGE 22.jpg', '/IMAGE 23.jpg', '/IMAGE 24.jpg', '/IMAGE 25.jpg'],
    title: 'Bâtiment & Construction',
    desc: 'De la conception à la livraison : construction générale, rénovation et aménagement complets.',
  },
]

// PROJECTS and TAGS removed — images are now associated directly with `SERVICES`

const CONTACTS = [
  { label: 'Téléphone', val: '+225 07 06 00 55 17', href: 'tel:+2250706005517', Icon: IconPhone, pulse: false },
  { label: 'WhatsApp', val: '+225 05 04 36 22 86', href: 'https://wa.me/2250504362286', Icon: IconChat, pulse: true },
  { label: 'Email', val: 'smbkbtp@gmail.com', href: 'mailto:smbkbtp@gmail.com', Icon: IconMail, pulse: false },
  { label: 'Localisation', val: 'Bondoukou, Côte d\'Ivoire', href: 'https://www.google.com/maps/search/?api=1&query=Bondoukou%2C+C%C3%B4te+d%27Ivoire', Icon: IconPin, pulse: false },
]

/* ─── Hero stats with count-up ──────────────────────────────────────────── */
function StatItem({ label, value, suffix = '', delay = 0 }: { label: string; value: number; suffix?: string; delay?: number }) {
  const { ref, visible } = useInView(0.4)
  const count = useCountUp(value, visible)
  return (
    <div
      ref={ref}
      className="border-t border-[#f8fafc]/10 pt-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      <p className="font-mono-label text-[10px] tracking-[0.2em] text-[#64748b] uppercase mb-1">{label}</p>
      <p className="font-display text-4xl font-light text-[#f8fafc]">{count}{suffix}</p>
    </div>
  )
}

/* ─── App ────────────────────────────────────────────────────────────────── */
export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>({ '01': 0, '02': 0, '03': 0, '04': 0, '05': 0 })

  const parallax = useParallax()
  const progress = useScrollProgress()
  const navShrunk = useNavShrink()

  // images are shown on Services cards; gallery removed

  // track active section for nav highlight
  useEffect(() => {
    const sections = ['hero', 'services', 'propos', 'contact']
    const onScroll = () => {
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) { setActiveSection(id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navHref = useCallback((l: string) => {
    const map: Record<string, string> = {
      'Services': 'services',
      'À propos': 'propos',
      'Contact': 'contact',
    }
    return `#${map[l] ?? l.toLowerCase()}`
  }, [])

  return (
    <div className="bg-[#f8fafc] text-[#0f172a] min-h-screen">
      {/* scroll progress bar */}
      <div
        className="fixed top-0 left-0 z-[60] h-[2px] bg-[#d97706] origin-left"
        style={{ width: `${progress * 100}%`, transition: 'width 0.05s linear' }}
      />

      {/* NAV */}
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-[#f8fafc]/90 backdrop-blur-sm border-b border-[#0f172a]/10 transition-all duration-300"
        style={{ height: navShrunk ? '52px' : '64px' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-3 group">
            <span className="font-mono-label text-[9px] sm:text-[10px] tracking-[0.2em] text-[#64748b] uppercase">
              Société Modèle Bâti Qualité : BTP
            </span>
            <span className="w-px h-4 bg-[#64748b]/40 hidden sm:block" />
            <img
              src="/IMAGE 40.jpg"
              alt="SMBK BTP"
              className="w-auto transition-all duration-300"
              style={{ height: navShrunk ? '42px' : '48px' }}
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l, i) => {
              const id = navHref(l).slice(1)
              const isActive = activeSection === id
              return (
                <a
                  key={l}
                  href={navHref(l)}
                  className="font-mono-label text-[11px] tracking-[0.15em] uppercase transition-colors relative group"
                  style={{ color: isActive ? '#0f172a' : '#64748b' }}
                >
                  {l}
                  <span
                    className="absolute -bottom-1 left-0 h-px bg-[#d97706] transition-all duration-300"
                    style={{ width: isActive ? '100%' : '0%' }}
                  />
                </a>
              )
            })}
          </nav>

          <button
            className="md:hidden flex flex-col gap-1.5 p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {[0, 1, 2].map(i => (
              <span
                key={i}
                className="block w-6 h-px bg-[#0f172a] transition-all duration-300"
                style={{
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translateY(8px)' : i === 2 ? 'rotate(-45deg) translateY(-8px)' : 'none'
                    : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }}
              />
            ))}
          </button>
        </div>

        <div
          className="md:hidden overflow-hidden transition-all duration-300 bg-[#f8fafc] border-t border-[#0f172a]/10"
          style={{ maxHeight: menuOpen ? '240px' : '0px' }}
        >
          <div className="px-6 py-5 flex flex-col gap-4">
            {NAV_LINKS.map((l, i) => (
              <a
                key={l}
                href={navHref(l)}
                onClick={() => setMenuOpen(false)}
                className="font-mono-label text-[11px] tracking-[0.15em] text-[#64748b] uppercase"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-end pt-16 overflow-hidden" style={{ backgroundColor: '#2b3a43' }}>
        <div
          className="absolute inset-0 opacity-100 will-change-transform"
          style={{
            backgroundImage: 'url(/IMAGE 40.jpg)',
            backgroundSize: '100% 100%',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
            transform: `translateY(${parallax * 0.3}px) scale(1.06)`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,14,18,0.8)_0%,rgba(10,14,18,0.58)_30%,rgba(10,14,18,0.22)_72%,rgba(10,14,18,0.35)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),rgba(0,0,0,0.45))]" />
        <div
          className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-[#d97706]/20 blur-3xl pointer-events-none"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-40 left-10 w-64 h-64 rounded-full bg-[#1e3a8a]/20 blur-3xl pointer-events-none"
          style={{ animation: 'float 10s ease-in-out infinite 1.5s' }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-20 w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
          <div className="space-y-7">
            <div
              className="inline-flex items-center gap-3 rounded-full border border-[#d97706]/40 bg-[#d97706]/10 px-4 py-2 backdrop-blur-sm"
              style={{ animation: 'fadeUp 0.8s ease 0.1s both' }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_18px_rgba(245,158,11,0.8)]" />
              <p className="font-mono-label text-[9px] tracking-[0.3em] text-[#f8fafc] uppercase">
                Travaux Publics — Bâtiment — Topographie
              </p>
            </div>

            <div style={{ animation: 'fadeUp 0.8s ease 0.2s both' }}>
              <h1 className="font-display text-5xl md:text-7xl font-light text-[#f8fafc] leading-[0.95] tracking-tight mb-5">
                Bâtir avec le cœur,<br />
                <em className="font-light italic text-[#f8d7a3]">la rigueur</em><br />
                et le terrain.
              </h1>
              <p className="max-w-xl text-sm md:text-base text-slate-300 leading-relaxed">
                Une équipe proche de vos besoins, attentive à chaque détail et engagée jusqu’à la livraison de votre chantier.
              </p>
            </div>

            <div
              className="flex items-center gap-4 flex-wrap"
              style={{ animation: 'fadeUp 0.8s ease 0.35s both' }}
            >
              <a
                href="#services"
                className="px-8 py-4 bg-[#d97706] text-[#f8fafc] font-mono-label text-[10px] tracking-[0.2em] uppercase hover:bg-[#f59e0b] transition-all duration-300 shadow-[0_12px_30px_rgba(217,119,6,0.35)] hover:-translate-y-0.5"
              >
                Voir nos services
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6 md:text-right">
            <div
              className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-[0_20px_60px_rgba(15,23,42,0.25)]"
              style={{ animation: 'fadeUp 0.7s ease 0.45s both' }}
            >
              <p className="font-mono-label text-[9px] tracking-[0.2em] text-[#f8fafc]/70 uppercase mb-3">Accompagnement humain</p>
              <p className="font-display text-2xl font-light text-[#f8fafc] leading-snug">
                Une solution pensée autour de votre terrain, de votre budget et de vos priorités.
              </p>
            </div>

            <StatItem label="Domaines d'activité" value={5} delay={300} />
            <div
              className="border-t border-[#f8fafc]/10 pt-6"
              style={{ animation: 'fadeUp 0.6s ease 0.5s both' }}
            >
              <p className="font-mono-label text-[10px] tracking-[0.2em] text-[#64748b] uppercase mb-1">Statut</p>
              <p className="font-display text-2xl font-light text-[#f8fafc]">Société Modèle Bâti Qualité : BTP</p>
            </div>
            <div
              className="border-t border-[#f8fafc]/10 pt-6"
              style={{ animation: 'fadeUp 0.6s ease 0.6s both' }}
            >
              <p className="font-mono-label text-[10px] tracking-[0.2em] text-[#64748b] uppercase mb-1">Localisation</p>
              <p className="font-display text-2xl font-light text-[#f8fafc]">Bondoukou, Côte d'Ivoire</p>
            </div>
          </div>
        </div>

        {/* scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ animation: 'fadeUp 1s ease 1s both' }}
        >
          <span className="font-mono-label text-[8px] tracking-[0.3em] text-[#64748b] uppercase">Défiler</span>
          <div className="w-px h-10 bg-gradient-to-b from-[#64748b] to-transparent" style={{ animation: 'scrollPulse 1.8s ease-in-out infinite' }} />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative max-w-7xl mx-auto px-6 py-28 overflow-hidden">
        <div className="pointer-events-none absolute inset-0 z-0">
          <span className="absolute left-4 top-14 h-24 w-24 rounded-full border border-[#d97706]/25 bg-[#d97706]/8 blur-sm" style={{ animation: 'bubbleFloat 9s ease-in-out infinite' }} />
          <span className="absolute right-10 top-20 h-20 w-20 rounded-full border border-[#1e3a8a]/25 bg-[#1e3a8a]/8 blur-sm" style={{ animation: 'bubbleFloat 11s ease-in-out infinite 1s' }} />
          <span className="absolute left-1/3 bottom-12 h-28 w-28 rounded-full border border-[#d97706]/20 bg-[#d97706]/8 blur-sm" style={{ animation: 'bubbleFloat 13s ease-in-out infinite 2s' }} />
          <span className="absolute right-1/4 bottom-4 h-16 w-16 rounded-full border border-[#0f172a]/15 bg-[#0f172a]/5 blur-sm" style={{ animation: 'bubbleFloat 10s ease-in-out infinite 1.5s' }} />
        </div>

        <div className="relative z-10">
          <Reveal>
            <div className="flex items-baseline gap-6 mb-16">
              <span className="font-mono-label text-[10px] tracking-[0.3em] text-[#d97706] uppercase">Services</span>
              <div className="flex-1 h-px bg-[#0f172a]/10" />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {SERVICES.map((s, i) => (
              <Reveal key={s.num} delay={i * 80} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <div
                  className="group relative rounded-[12px] overflow-hidden border border-[#0f172a]/10 shadow-[0_18px_45px_rgba(15,23,42,0.07)] hover:shadow-[0_28px_70px_rgba(15,23,42,0.12)] transition-all duration-300"
                  style={{ animation: `bubbleFloat 12s ease-in-out infinite ${i * 1.2}s` }}
                  onMouseEnter={() => setHoveredCard(i)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Carrousel image */}
                  <div className="relative w-full bg-[#0f172a] overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    <div className="relative w-full h-full">
                      <img 
                        src={s.images[carouselIndex[s.num]]} 
                        alt={`${s.title} - ${carouselIndex[s.num] + 1}`} 
                        className="w-full h-full object-cover transition-opacity duration-500"
                      />
                    </div>

                    {/* Flèche gauche */}
                    <button
                      onClick={() => setCarouselIndex(prev => ({
                        ...prev,
                        [s.num]: prev[s.num] === 0 ? s.images.length - 1 : prev[s.num] - 1
                      }))}
                      className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#d97706] hover:bg-[#f59e0b] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <IconChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Flèche droite */}
                    <button
                      onClick={() => setCarouselIndex(prev => ({
                        ...prev,
                        [s.num]: prev[s.num] === s.images.length - 1 ? 0 : prev[s.num] + 1
                      }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-[#d97706] hover:bg-[#f59e0b] text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                    >
                      <IconChevronRight className="w-5 h-5" />
                    </button>

                    {/* Indicateurs (points) */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                      {s.images.map((_, imgIdx) => (
                        <button
                          key={imgIdx}
                          onClick={() => setCarouselIndex(prev => ({ ...prev, [s.num]: imgIdx }))}
                          className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                            carouselIndex[s.num] === imgIdx 
                              ? 'w-6 bg-[#f59e0b]' 
                              : 'w-2 bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-[#0f172a] text-[#f8fafc]">
                    <h3 className="font-display text-lg font-semibold text-white mb-2">{s.title}</h3>
                    <p className="text-sm text-[#94a3b8] leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Réalisations section removed — images now in Services cards */}

      {/* ABOUT */}
      <section id="propos" className="max-w-7xl mx-auto px-6 py-28">
          <Reveal>
            <div className="flex items-baseline gap-6 mb-16">
              <span className="font-mono-label text-[10px] tracking-[0.3em] text-[#d97706] uppercase">À propos</span>
              <div className="flex-1 h-px bg-[#0f172a]/10" />
            </div>
          </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-16 items-start">
          <Reveal direction="left" className="md:col-span-2">
            <div className="relative">
              <div className="bg-[#1e293b] aspect-[3/4] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541976590-713941681591?w=600&h=800&fit=crop&auto=format"
                  alt="Chantier SMBK BTP"
                  className="w-full h-full object-cover mix-blend-luminosity opacity-80 hover:opacity-100 hover:mix-blend-normal transition-all duration-700"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-[#d97706] p-6 hidden md:block">
                <p className="font-mono-label text-[10px] tracking-[0.2em] text-[#f8fafc]/70 uppercase mb-1">Statut</p>
                <p className="font-display text-xl text-[#f8fafc] font-light">Entreprise<br />Individuelle</p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" delay={150} className="md:col-span-3 md:pt-8">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-8">
                Une expertise<br />
                <em className="italic font-light text-[#d97706]">solide</em>, fiable,<br />
                à votre service.
              </h2>
              <div className="space-y-5 text-[#1e293b] font-light leading-relaxed">
                <p>
                  SMBK BTP — Société Modèle Bâti Qualité — est une entreprise basée à Bondoukou, en Côte d'Ivoire. Nous intervenons sur l'ensemble du territoire pour accompagner particuliers et institutions dans leurs projets de construction et d'aménagement.
                </p>
                <p>
                  Notre activité couvre cinq domaines complémentaires : le décapage et terrassement, l'assainissement et VRD, la voirie et compactage, le bâtiment et construction ainsi que la topographie, pour offrir un accompagnement complet, de l'étude de terrain à la livraison.
                </p>
                <p>
                  Chaque projet commence par une conversation. Nous prenons le temps de comprendre vos besoins et votre terrain pour vous proposer une solution rigoureuse, durable et adaptée à votre budget.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-[#0f172a]/10">
                {[
                  { label: 'Domaines', val: '5 activités' },
                  { label: 'Statut', val: 'Entreprise Ind.' },
                  { label: "Rayon d'action", val: 'Côte d\'Ivoire' },
                ].map((item, i) => (
                  <div
                    key={item.label}
                    style={{ transitionDelay: `${i * 80}ms` }}
                  >
                    <p className="font-mono-label text-[9px] tracking-[0.15em] text-[#64748b] uppercase mb-2">{item.label}</p>
                    <p className="font-display text-lg font-light">{item.val}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUOTE BAND */}
      <Reveal threshold={0.3}>
        <div className="bg-[#d97706] py-16 overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 60px)',
            }}
          />
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <blockquote className="font-display text-2xl md:text-4xl font-light italic text-[#f8fafc] leading-snug">
              « La qualité ne s'improvise pas, elle se construit. »
            </blockquote>
            <p className="font-mono-label text-[10px] tracking-[0.3em] text-[#f8fafc]/60 uppercase mt-6">
              — SMBK BTP
            </p>
          </div>
        </div>
      </Reveal>

      {/* CONTACT */}
      <section id="contact" className="px-6 py-28 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <div
            className="absolute -top-10 right-0 w-72 h-72 rounded-full bg-[#d97706]/10 blur-3xl pointer-events-none"
            style={{ animation: 'float 7s ease-in-out infinite' }}
          />
          <div
            className="absolute bottom-0 -left-10 w-56 h-56 rounded-full bg-[#1e3a8a]/10 blur-3xl pointer-events-none"
            style={{ animation: 'float 9s ease-in-out infinite 1s' }}
          />

          <Reveal>
            <div className="flex items-baseline gap-6 mb-16 relative z-10">
              <span className="font-mono-label text-[10px] tracking-[0.3em] text-[#d97706] uppercase">Contact</span>
              <div className="flex-1 h-px bg-[#0f172a]/10" />
            </div>
          </Reveal>

          <div className="max-w-5xl mx-auto relative z-10">
            <Reveal direction="left">
              <div className="text-left">
                <h2 className="font-display text-4xl md:text-5xl font-light leading-tight mb-6">
                  Un projet ?<br />
                  <em className="italic font-light text-[#d97706]">Parlons-en.</em>
                </h2>
                <p className="text-[#1e293b] font-light leading-relaxed mb-12 max-w-xl">
                  Devis gratuit et sans engagement. Nous répondons personnellement à chaque demande. Pour les projets urgents, appelez ou contactez-nous directement sur WhatsApp.
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {CONTACTS.map((c, i) => (
                <Reveal key={c.label} delay={i * 90} direction="up">
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel={c.href.startsWith('http') ? 'noreferrer' : undefined}
                    className="group relative flex flex-col items-center text-center gap-3 rounded-[28px] border border-[#0f172a]/10 bg-white p-6 h-full hover:bg-[#d97706] hover:border-[#d97706] hover:-translate-y-2 hover:shadow-xl hover:shadow-[#d97706]/20 transition-all duration-300"
                  >
                    {c.pulse && (
                      <span className="absolute top-4 right-4 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22c55e]" />
                      </span>
                    )}
                    <span className="w-14 h-14 rounded-full bg-[#d97706]/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                      <c.Icon className="w-6 h-6 text-[#d97706] group-hover:text-white transition-colors duration-300" />
                    </span>
                    <span className="font-mono-label text-[9px] tracking-[0.2em] text-[#64748b] group-hover:text-white/70 uppercase transition-colors duration-300">
                      {c.label}
                    </span>
                    <span className="font-light text-sm text-[#0f172a] group-hover:text-white transition-colors duration-300 break-words">
                      {c.val}
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#0f172a]/10 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/IMAGE 40.jpg"
              alt="SMBK BTP"
              className="w-auto"
              style={{ height: '56px' }}
            />
            <span className="w-px h-4 bg-[#0f172a]/20" />
            <span className="font-mono-label text-[9px] tracking-[0.2em] text-[#64748b] uppercase">Société Modèle Bâti Qualité : BTP</span>
          </div>
          <p className="font-mono-label text-[9px] tracking-[0.15em] text-[#94a3b8] uppercase">
            © 2026 SMBK BTP — Bondoukou, Côte d'Ivoire
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(0.8); }
          50%       { opacity: 1;   transform: scaleY(1); }
        }
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50%      { transform: translate(-16px, 20px) scale(1.08); }
        }
        @keyframes bubbleFloat {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50%      { transform: translate3d(16px, -18px, 0) scale(1.08); }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(217,119,6,0.2); }
          50%      { box-shadow: 0 0 20px rgba(217,119,6,0.4); }
        }
      `}</style>
    </div>
  )
}
