import { useEffect, useState } from 'react';
import {
  ScanSearch,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  FileStack,
  ArrowRight,
  UploadCloud,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Scan } from '@/lib/types';
import Reveal from '@/components/Reveal';

function scoreColor(score: number) {
  if (score >= 80) return { stroke: '#16a34a', text: 'text-green-600', chip: 'bg-green-50 text-green-700 ring-green-200' };
  if (score >= 50) return { stroke: '#d97706', text: 'text-amber-600', chip: 'bg-amber-50 text-amber-700 ring-amber-200' };
  return { stroke: '#dc2626', text: 'text-red-600', chip: 'bg-red-50 text-red-700 ring-red-200' };
}

function scoreLabel(score: number) {
  if (score === 100) return 'Perfect';
  if (score >= 80) return 'Strong';
  if (score >= 50) return 'Needs attention';
  return 'Non-compliant';
}

function MiniRing({ score }: { score: number }) {
  const color = scoreColor(score);
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg className="h-14 w-14 -rotate-90" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
        <circle
          cx="30"
          cy="30"
          r={r}
          fill="none"
          stroke={color.stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - score / 100)}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${color.text}`}>
        {score}
      </span>
    </div>
  );
}

const CATEGORY_CHECKS: { name: string; match: RegExp }[] = [
  { name: 'Product name', match: /product name/i },
  { name: 'Manufacturer details', match: /responsible party/i },
  { name: 'Ingredient list', match: /ingredient list/i },
  { name: 'Net quantity', match: /net quantity/i },
  { name: 'Date marking', match: /date marking/i },
  { name: 'Country of origin', match: /country of origin/i },
  { name: 'Legibility', match: /font size/i },
];

const BUCKETS = [
  { name: 'Critical', range: '0–49', test: (s: number) => s < 50, color: 'bg-gradient-to-t from-red-600 to-red-400' },
  { name: 'Needs work', range: '50–79', test: (s: number) => s >= 50 && s < 80, color: 'bg-gradient-to-t from-amber-600 to-amber-400' },
  { name: 'Strong', range: '80–99', test: (s: number) => s >= 80 && s < 100, color: 'bg-gradient-to-t from-blue-600 to-sky-400' },
  { name: 'Perfect', range: '100', test: (s: number) => s === 100, color: 'bg-gradient-to-t from-green-700 to-green-400' },
];

export default function DashboardPage({ onNavigate }: { onNavigate: (page: string) => void }) {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data, error: dbError } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (dbError) {
        setError('We could not load your scan history. Please refresh to try again.');
      } else {
        setScans(data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  const total = scans.length;
  const avgScore = total ? Math.round(scans.reduce((a, s) => a + s.compliance_score, 0) / total) : 0;
  const fullyCompliant = scans.filter((s) => s.compliance_score >= 80).length;
  const totalGaps = scans.reduce((a, s) => a + s.missing_information.length, 0);

  const bucketCounts = BUCKETS.map((b) => ({
    ...b,
    count: scans.filter((s) => b.test(s.compliance_score)).length,
  }));
  const maxBucket = Math.max(1, ...bucketCounts.map((b) => b.count));

  const categoryRates = CATEGORY_CHECKS.map((cat) => {
    const passed = scans.filter((s) =>
      (s.passed_checks as { label: string }[]).some((c) => cat.match.test(c.label))
    ).length;
    return { name: cat.name, passed, rate: total ? Math.round((passed / total) * 100) : 0 };
  });

  const gapCounts = new Map<string, number>();
  for (const s of scans) {
    for (const m of s.missing_information) {
      gapCounts.set(m, (gapCounts.get(m) ?? 0) + 1);
    }
  }
  const topGaps = [...gapCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxGap = Math.max(1, ...topGaps.map((g) => g[1]));

  const recent = scans.slice(0, 6);

  return (
    <div>
      <section className="relative overflow-hidden pb-10 pt-28 sm:pt-36">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="animate-fade-up font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Compliance <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Every scan you have run, aggregated into one view — scores, trends,
            and the gaps that keep coming back.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        {loading && (
          <div className="card-premium flex flex-col items-center py-20">
            <span className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-blue-400/20" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-glow">
                <Gauge className="h-6 w-6 animate-pulse-soft" />
              </span>
            </span>
            <p className="mt-5 text-sm font-medium text-slate-500">Loading your scan history…</p>
          </div>
        )}

        {!loading && error && (
          <div className="rounded-2xl bg-red-50 px-5 py-4 text-sm text-red-700 ring-1 ring-red-100">
            {error}
          </div>
        )}

        {!loading && !error && total === 0 && (
          <Reveal>
            <div className="card-premium flex flex-col items-center px-6 py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-glow">
                <ScanSearch className="h-8 w-8" />
              </span>
              <h2 className="mt-5 font-display text-xl font-bold text-slate-900">
                No scans yet
              </h2>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                Run your first label check and this dashboard will fill up with
                scores, charts, and recommendations.
              </p>
              <button
                onClick={() => onNavigate('upload')}
                className="group mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-blue-700"
              >
                <UploadCloud className="h-4 w-4" />
                Upload Your First Product
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </Reveal>
        )}

        {!loading && !error && total > 0 && (
          <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: FileStack,
                  label: 'Total scans',
                  value: total.toString(),
                  sub: 'Labels analyzed to date',
                },
                {
                  icon: Gauge,
                  label: 'Average score',
                  value: avgScore.toString(),
                  sub: scoreLabel(avgScore),
                  accent: 'text-gradient',
                },
                {
                  icon: CheckCircle2,
                  label: 'Strong labels',
                  value: `${fullyCompliant}/${total}`,
                  sub: 'Scoring 80 or above',
                },
                {
                  icon: AlertTriangle,
                  label: 'Open gaps',
                  value: totalGaps.toString(),
                  sub: 'Missing items across all scans',
                },
              ].map((card, i) => (
                <Reveal key={card.label} delay={i * 70}>
                  <div className="card-premium card-premium-hover h-full p-6">
                    <div className="flex items-center justify-between">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <card.icon className="h-5 w-5" />
                      </span>
                      <TrendingUp className="h-4 w-4 text-slate-300" />
                    </div>
                    <p className={`mt-4 font-display text-3xl font-bold ${card.accent ?? 'text-slate-900'}`}>
                      {card.value}
                    </p>
                    <p className="text-sm font-medium text-slate-700">{card.label}</p>
                    <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <Reveal>
                <div className="card-premium h-full p-7">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    <BarChart3 className="h-4 w-4" />
                    Score Distribution
                  </div>
                  <div className="mt-6 flex h-56 items-end justify-around gap-4 sm:gap-8">
                    {bucketCounts.map((b) => (
                      <div key={b.name} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <span className="text-sm font-bold text-slate-900">{b.count}</span>
                        <div
                          className={`w-full max-w-16 rounded-t-xl ${b.color} transition-all duration-700`}
                          style={{ height: `${(b.count / maxBucket) * 82}%`, minHeight: b.count > 0 ? '8px' : '3px' }}
                        />
                        <div className="text-center">
                          <p className="text-xs font-semibold text-slate-700">{b.name}</p>
                          <p className="text-[11px] text-slate-400">{b.range}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <div className="card-premium h-full p-7">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    <CheckCircle2 className="h-4 w-4" />
                    Pass Rate by Requirement
                  </div>
                  <ul className="mt-6 space-y-4">
                    {categoryRates.map((cat) => (
                      <li key={cat.name}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-slate-700">{cat.name}</span>
                          <span className="font-semibold text-slate-900">
                            {cat.passed}/{total}
                          </span>
                        </div>
                        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              cat.rate >= 80
                                ? 'bg-gradient-to-r from-green-600 to-green-400'
                                : cat.rate >= 50
                                  ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                                  : 'bg-gradient-to-r from-red-600 to-red-400'
                            }`}
                            style={{ width: `${cat.rate}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>

            <div className="grid gap-6 lg:grid-cols-[2fr_3fr]">
              <Reveal>
                <div className="card-premium h-full p-7">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                    <AlertTriangle className="h-4 w-4" />
                    Most Common Gaps
                  </div>
                  <ul className="mt-6 space-y-4">
                    {topGaps.map(([gap, count]) => (
                      <li key={gap}>
                        <div className="flex items-center justify-between gap-3 text-sm">
                          <span className="font-medium text-slate-700">{gap}</span>
                          <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-red-100">
                            {count}×
                          </span>
                        </div>
                        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-700"
                            style={{ width: `${(count / maxGap) * 100}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => onNavigate('features')}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    See how checks work
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Reveal>

              <Reveal delay={90}>
                <div className="card-premium h-full p-7">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                      <ScanSearch className="h-4 w-4" />
                      Recent Scans
                    </div>
                    <button
                      onClick={() => onNavigate('upload')}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      New Scan
                    </button>
                  </div>
                  <ul className="mt-5 divide-y divide-slate-100">
                    {recent.map((s) => {
                      const color = scoreColor(s.compliance_score);
                      return (
                        <li key={s.id} className="flex items-center gap-4 py-3.5">
                          <MiniRing score={s.compliance_score} />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {s.product_name || s.image_name || 'Untitled label'}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(s.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                              {' · '}
                              {s.missing_information.length === 0
                                ? 'All checks passed'
                                : `${s.missing_information.length} gap${s.missing_information.length > 1 ? 's' : ''}`}
                            </p>
                          </div>
                          <span
                            className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 sm:block ${color.chip}`}
                          >
                            {scoreLabel(s.compliance_score)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
