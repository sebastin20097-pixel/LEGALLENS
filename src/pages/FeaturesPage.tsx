import {
  ScanText,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  UploadCloud,
  Gauge,
  XCircle,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import Reveal from '@/components/Reveal';

interface Props {
  onNavigate: (page: string) => void;
}

const SECTIONS = [
  {
    icon: ScanText,
    accent: 'from-blue-600 to-sky-500',
    title: 'OCR Text Extraction',
    body: 'LegalLens reads every character on your label using optical character recognition tuned for packaging — small print, curved surfaces, and busy backgrounds included. What used to take a magnifying glass and an hour now takes a single photo.',
    points: [
      'Reads printed and curved label text automatically',
      'Handles small mandatory statements and fine print',
      'Works from any clear photo, no special equipment',
    ],
  },
  {
    icon: CheckCircle2,
    accent: 'from-sky-500 to-cyan-500',
    title: 'Product Information Detection',
    body: 'After the text is read, the engine identifies the five elements every label must carry: the product name, the responsible manufacturer, the ingredient list, the net quantity, and the date marking. Each one is extracted and structured so nothing hides in the fine print.',
    points: [
      'Detects name, manufacturer, ingredients, weight, expiry',
      'Structures the data so gaps are impossible to miss',
      'Flags anything it could not find on the label',
    ],
  },
  {
    icon: ShieldCheck,
    accent: 'from-blue-700 to-blue-500',
    title: 'Compliance Verification',
    body: 'Every detected element is checked against labeling requirements — from declaration placement and minimum type sizes to allergen disclosures and date formats. You get a compliance score plus a plain pass or fail for each individual rule.',
    points: [
      'Scores the label from 0 to 100',
      'Pass/fail verdict for each mandatory check',
      'Highlights every missing or malformed element',
    ],
  },
  {
    icon: Sparkles,
    accent: 'from-sky-600 to-blue-400',
    title: 'AI Recommendations',
    body: 'A failed check is only useful if you know how to fix it. LegalLens turns each finding into a concrete, plain-language recommendation — what to add, where it belongs on the label, and the regulation it satisfies.',
    points: [
      'Concrete fixes written in plain language',
      'References the rule each change satisfies',
      'Prioritized so critical gaps come first',
    ],
  },
] as const;

export default function FeaturesPage({ onNavigate }: Props) {
  return (
    <div>
      <section className="relative overflow-hidden pb-16 pt-28 sm:pt-36">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="animate-fade-up font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Built like a
            <span className="text-gradient"> compliance team</span> in a box
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            LegalLens walks your label through four stages — reading, detecting,
            verifying, and advising — to give you one clear verdict.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 sm:px-6">
        {SECTIONS.map(({ icon: Icon, accent, title, body, points }, i) => (
          <Reveal key={title} delay={i * 60}>
            <div className="card-premium grid gap-7 p-8 sm:p-10 lg:grid-cols-[auto_1fr_20rem]">
              <div className="flex lg:flex-col lg:items-start lg:gap-4 items-center gap-4">
                <span
                  className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${accent} text-white shadow-glow`}
                >
                  <Icon className="h-7 w-7" />
                </span>
                <span className="hidden font-display text-5xl font-bold text-slate-100 lg:block">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
                  {title}
                </h2>
                <p className="mt-3 leading-relaxed text-slate-600">{body}</p>
              </div>
              <ul className="space-y-3 self-center rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-100">
                {points.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2.5 text-sm text-slate-700"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100">
                      <ShieldCheck className="h-3 w-3 text-blue-600" />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-8 sm:p-14">
            <div className="pointer-events-none absolute -top-24 right-0 h-72 w-96 rounded-full bg-blue-600/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 left-10 h-72 w-96 rounded-full bg-sky-500/15 blur-3xl" />
            <div className="relative grid gap-8 sm:grid-cols-2 sm:gap-4">
              <div>
                <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
                  Everything you need on one report
                </h2>
                <p className="mt-3 max-w-md leading-relaxed text-slate-400">
                  A single scan returns the full picture — no tabs, no spreadsheets,
                  no legalese.
                </p>
                <button
                  onClick={() => onNavigate('upload')}
                  className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <UploadCloud className="h-4 w-4" />
                  Try It With Your Label
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  { icon: UploadCloud, label: 'Upload any product photo' },
                  { icon: Gauge, label: 'Score from 0 to 100' },
                  { icon: XCircle, label: 'Exact missing elements' },
                  { icon: Lightbulb, label: 'Fixes you can act on' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-medium text-slate-200 backdrop-blur transition hover:border-blue-400/40 hover:bg-white/10"
                  >
                    <Icon className="h-5 w-5 shrink-0 text-blue-400" />
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
