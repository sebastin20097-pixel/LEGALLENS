import { ScanSearch, Target, Scale, Users, Compass } from 'lucide-react';
import Reveal from '@/components/Reveal';

const VALUES = [
  {
    icon: Target,
    title: 'Precision first',
    body: 'We would rather flag a borderline element than wave through a risky one. Every verdict shows its reasoning, so you can check our work.',
  },
  {
    icon: Scale,
    title: 'Regulation-anchored',
    body: 'Checks map to real labeling rules — EU Regulation 1169/2011, FDA 21 CFR, and cosmetic labeling norms — not vague "best practices".',
  },
  {
    icon: Users,
    title: 'Built for small teams',
    body: 'Enterprise compliance suites assume a legal department. LegalLens gives independent brands the same clarity, one photo at a time.',
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative overflow-hidden pb-14 pt-28 sm:pt-36">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <span className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur">
            <Compass className="h-3.5 w-3.5" />
            About LegalLens
          </span>
          <h1 className="animate-fade-up mt-6 font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Compliance clarity for
            <span className="text-gradient"> every product label</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Most recalls trace back to something simple: a label missing a required
            statement, or printing it too small to be legal. LegalLens catches
            those problems before they leave the warehouse.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <div className="card-premium relative overflow-hidden p-8 sm:p-10">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-50 blur-3xl" />
            <h2 className="relative font-display text-2xl font-bold text-slate-900">
              Our story
            </h2>
            <div className="relative mt-4 space-y-4 leading-relaxed text-slate-600">
              <p>
                LegalLens began when a small food brand had an entire production run
                held at customs — not because the product was unsafe, but because
                the manufacturer's address was missing from the label. The fix took
                five minutes. The delay took three weeks.
              </p>
              <p>
                We built LegalLens so that moment never happens to you. Point your
                camera at a label, and our engine reads it, detects the five
                elements every market requires, verifies each one against labeling
                rules, and hands you a scored report with concrete fixes. One photo
                replaces the checklist on the whiteboard.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, body }, i) => (
            <Reveal key={title} delay={i * 90}>
              <div className="card-premium card-premium-hover h-full p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-glow">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="my-14 flex items-start gap-3 rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-6">
            <ScanSearch className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
            <p className="text-sm leading-relaxed text-blue-900">
              LegalLens provides automated label guidance and does not constitute
              legal advice. For regulated markets, have final artwork reviewed by
              qualified counsel.
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
