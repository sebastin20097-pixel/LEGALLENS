import {
  CheckCircle2,
  XCircle,
  Lightbulb,
  ShieldCheck,
  Gauge,
} from 'lucide-react';
import type { Scan } from '@/lib/types';
import Reveal from '@/components/Reveal';

function scoreTheme(score: number) {
  if (score >= 80)
    return {
      ring: '#16a34a',
      text: 'text-green-600',
      chip: 'bg-green-50 text-green-700 ring-green-200',
      label: 'Strong',
    };
  if (score >= 50)
    return {
      ring: '#d97706',
      text: 'text-amber-600',
      chip: 'bg-amber-50 text-amber-700 ring-amber-200',
      label: 'Needs attention',
    };
  return {
    ring: '#dc2626',
    text: 'text-red-600',
    chip: 'bg-red-50 text-red-700 ring-red-200',
    label: 'Non-compliant',
  };
}

export default function ComplianceResults({ scan }: { scan: Scan }) {
  const theme = scoreTheme(scan.compliance_score);
  const circumference = 2 * Math.PI * 54;
  const total = scan.passed_checks.length + scan.missing_information.length;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-3">
        <Reveal className="lg:col-span-1">
          <div className="card-premium flex h-full flex-col items-center justify-center p-7">
            <div className="flex w-full items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <Gauge className="h-4 w-4" />
              Compliance Score
            </div>
            <div className="relative mt-6 h-40 w-40">
              <svg className="h-40 w-40 -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" fill="none" stroke="#e2e8f0" strokeWidth="10" />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke={theme.ring}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - scan.compliance_score / 100)}
                  style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22, 1, 0.36, 1)' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`font-display text-5xl font-bold ${theme.text}`}>
                  {scan.compliance_score}
                </span>
                <span
                  className={`mt-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ${theme.chip}`}
                >
                  {theme.label}
                </span>
              </div>
            </div>
            <p className="mt-5 text-center text-sm text-slate-600">
              {scan.passed_checks.length} of {total} mandatory label checks passed
            </p>
          </div>
        </Reveal>

        <Reveal delay={90} className="lg:col-span-2">
          <div className="card-premium h-full p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              Passed Checks
            </div>
            <ul className="mt-5 space-y-3.5">
              {scan.passed_checks.map((check) => (
                <li
                  key={check.label}
                  className="flex gap-3 rounded-xl bg-green-50/50 p-3.5 ring-1 ring-green-100/70"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{check.label}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-slate-600">
                      {check.detail}
                    </p>
                  </div>
                </li>
              ))}
              {scan.passed_checks.length === 0 && (
                <li className="text-sm text-slate-500">No checks passed yet.</li>
              )}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal delay={60}>
          <div className="h-full rounded-2xl border border-red-100 bg-gradient-to-br from-red-50 to-rose-50 p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-700">
              <XCircle className="h-4 w-4" />
              Missing Information
            </div>
            <ul className="mt-5 space-y-2.5">
              {scan.missing_information.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl bg-white/70 px-4 py-3 text-sm font-medium text-red-900 ring-1 ring-red-100"
                >
                  <XCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-red-500" />
                  <span>{item}</span>
                </li>
              ))}
              {scan.missing_information.length === 0 && (
                <li className="flex items-center gap-2 rounded-xl bg-white/70 px-4 py-3 text-sm font-semibold text-green-700 ring-1 ring-green-100">
                  <CheckCircle2 className="h-4.5 w-4.5" />
                  Nothing missing — all required label elements were found.
                </li>
              )}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="h-full rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 via-sky-50 to-blue-50 p-7">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-700">
              <Lightbulb className="h-4 w-4" />
              AI Recommendations
            </div>
            <ul className="mt-5 space-y-3">
              {scan.recommendations.map((rec, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl bg-white/80 p-4 text-sm leading-relaxed text-blue-900 ring-1 ring-blue-100"
                >
                  <span className="mt-0.5 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
