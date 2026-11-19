import {
  UploadCloud,
  ScanText,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Gauge,
  Lock,
  Zap,
  Globe,
} from 'lucide-react';
import Reveal from '@/components/Reveal';

interface Props {
  onNavigate: (page: string) => void;
}

const FEATURES = [
  {
    icon: ScanText,
    title: 'OCR Text Extraction',
    body: 'Every word on your label is read automatically — even curved wrappers, glossy finishes, and low-light photos.',
  },
  {
    icon: CheckCircle2,
    title: 'Product Information Detection',
    body: 'Name, manufacturer, ingredients, net weight, and dates are pulled out and structured — nothing hides in the fine print.',
  },
  {
    icon: ShieldCheck,
    title: 'Compliance Verification',
    body: 'Each element is checked against labeling requirements, with a clear pass or fail for every individual rule.',
  },
  {
    icon: Sparkles,
    title: 'AI Recommendations',
    body: 'Plain-language fixes that tell you exactly what to add, where it belongs, and the regulation it satisfies.',
  },
];

const STATS = [
  { value: '38k+', label: 'Labels analyzed' },
  { value: '120+', label: 'Markets covered' },
  { value: '94%', label: 'Issues caught pre-print' },
  { value: '<60s', label: 'Photo to verdict' },
];

const LOGOS = ['HARVEST&CO', 'NORTHWIND', 'ATLAS BRANDS', 'VERTEX HEALTH', 'SUNRISE'];

function DashboardMockup() {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-8 rounded-[2.5rem] bg-gradient-to-tr from-blue-600/25 via-sky-400/15 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-glow-lg">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/80 px-5 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
          <span className="ml-3 rounded-md bg-white px-3 py-1 text-xs text-slate-500 shadow-sm ring-1 ring-slate-200">
            legallens.app/scan/report
          </span>
        </div>

        <div className="space-y-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-sm font-semibold text-slate-900">
                Premium Chai Latte Mix — 250 g
              </p>
              <p className="text-xs text-slate-500">Scan completed 12 seconds ago</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Verified
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-20 w-20 -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={2 * Math.PI * 34 * 0.07}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display text-lg font-bold text-slate-900">
                93
              </span>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: 'Product name declared', ok: true },
                { label: 'Ingredients in descending order', ok: true },
                { label: 'Country of origin statement', ok: false },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-700 ring-1 ring-slate-100"
                >
                  {row.ok ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-600" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                  )}
                  {row.label}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-sky-50 p-4 ring-1 ring-blue-100">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700">
              <Sparkles className="h-3.5 w-3.5" />
              AI Recommendation
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-blue-900">
              Add a "Made in" statement to the bottom panel — required by EU Reg.
              1169/2011 Art. 26 for imported goods.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute -left-6 top-16 hidden animate-float rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-card backdrop-blur sm:block">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <ScanText className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-900">OCR complete</p>
            <p className="text-[11px] text-slate-500">247 characters extracted</p>
          </div>
        </div>
      </div>

      <div className="absolute -right-6 bottom-14 hidden animate-float-delayed rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-card backdrop-blur sm:block">
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
            <ShieldCheck className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold text-slate-900">8 of 9 checks passed</p>
            <p className="text-[11px] text-slate-500">1 fix recommended</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage({ onNavigate }: Props) {
  return (
    <div>
      <section className="relative overflow-hidden pb-20 pt-28 sm:pt-36">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-blue-100/80 via-sky-50/60 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/70 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur"
              style={{ animationDelay: '0ms' }}
            >
              <Zap className="h-3.5 w-3.5 text-blue-600" />
              Label compliance, verified in seconds
            </div>
            <h1
              className="animate-fade-up mt-6 font-display text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 sm:text-6xl"
              style={{ animationDelay: '90ms' }}
            >
              Ship products that
              <span className="text-gradient"> pass every check</span>
            </h1>
            <p
              className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600"
              style={{ animationDelay: '180ms' }}
            >
              LegalLens reads your product label with AI, verifies it against
              labeling law, and hands you the exact fixes — turning hours of
              regulatory review into one photo.
            </p>
            <div
              className="animate-fade-up mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              style={{ animationDelay: '270ms' }}
            >
              <button
                onClick={() => onNavigate('upload')}
                className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3.5 text-base font-semibold text-white shadow-glow transition hover:bg-blue-700 hover:shadow-glow-lg"
              >
                <UploadCloud className="h-5 w-5" />
                Upload Product
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => onNavigate('features')}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white/80 px-7 py-3.5 text-base font-semibold text-slate-700 backdrop-blur transition hover:border-slate-400 hover:bg-white"
              >
                See How It Works
              </button>
            </div>
            <p
              className="animate-fade-up mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-500"
              style={{ animationDelay: '360ms' }}
            >
              <Lock className="h-3 w-3" />
              No account needed · Images processed securely
            </p>
          </div>

          <div className="animate-fade-up relative mx-auto mt-16 max-w-3xl" style={{ animationDelay: '450ms' }}>
            <DashboardMockup />
          </div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50/60 py-8">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400">
            Trusted by product teams at
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="font-display text-sm font-semibold tracking-wide text-slate-400 transition hover:text-slate-600"
              >
                {logo}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Four checks. One clear answer.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg text-slate-600">
              From photo to compliance verdict in under a minute — no legal
              department required.
            </p>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 90}>
              <div className="card-premium card-premium-hover group relative h-full overflow-hidden p-6">
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-glow">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="relative mt-5 font-semibold text-slate-900">{f.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-slate-600">{f.body}</p>
                <p className="relative mt-4 text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Step {i + 1}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="grid gap-5 rounded-3xl bg-slate-950 p-8 sm:p-12">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {STATS.map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                    <span className="text-gradient">{s.value}</span>
                  </p>
                  <p className="mt-1.5 text-xs font-medium text-slate-400 sm:text-sm">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-white/10 pt-8 text-xs font-medium text-slate-400">
              <span className="inline-flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-400" />
                Works across 120+ markets
              </span>
              <span className="inline-flex items-center gap-2">
                <Gauge className="h-4 w-4 text-blue-400" />
                Scores every mandatory element
              </span>
              <span className="inline-flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-400" />
                Images never shared
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-blue-700 to-sky-600 px-8 py-14 text-center shadow-glow-lg sm:px-12">
            <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />
            <h2 className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Is your label ready for the shelf?
            </h2>
            <p className="relative mx-auto mt-3 max-w-xl text-blue-100">
              Upload one photo and find out in under a minute. Free, fast, and no
              sign-up required.
            </p>
            <button
              onClick={() => onNavigate('upload')}
              className="group relative mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-3.5 text-base font-semibold text-blue-700 shadow-lg transition hover:bg-blue-50"
            >
              <UploadCloud className="h-5 w-5" />
              Check Your Label
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
