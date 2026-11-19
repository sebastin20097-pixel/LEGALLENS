import { useEffect, useRef, useState } from 'react';
import {
  Loader2,
  RotateCcw,
  FileText,
  Factory,
  ListChecks,
  Scale,
  CalendarClock,
  ArrowRight,
  ScanText,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Lock,
} from 'lucide-react';
import { createScanDraft } from '@/lib/analysis';
import { supabase } from '@/lib/supabase';
import type { Scan } from '@/lib/types';
import ComplianceResults from '@/components/ComplianceResults';
import ImageUploader from '@/components/ImageUploader';
import Reveal from '@/components/Reveal';

function makeThumbnail(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const maxW = 480;
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read image'));
    };
    img.src = url;
  });
}

const FIELD_META = [
  { key: 'product_name', label: 'Product Name', icon: FileText },
  { key: 'manufacturer', label: 'Manufacturer', icon: Factory },
  { key: 'ingredients', label: 'Ingredients', icon: ListChecks },
  { key: 'weight', label: 'Weight', icon: Scale },
  { key: 'expiry_date', label: 'Expiry Date', icon: CalendarClock },
] as const;

const ANALYSIS_STEPS = [
  { icon: ScanText, label: 'Reading label text with OCR' },
  { icon: ListChecks, label: 'Detecting product information' },
  { icon: ShieldCheck, label: 'Verifying compliance rules' },
  { icon: Sparkles, label: 'Generating recommendations' },
];

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [phase, setPhase] = useState<'idle' | 'analyzing' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [scan, setScan] = useState<Scan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const runRef = useRef(0);

  useEffect(() => {
    return () => {
      if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFileSelected = (f: File) => {
    setError(null);
    setScan(null);
    setPhase('idle');
    setProgress(0);
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleReject = (message: string) => {
    setError(message);
  };

  const handleClear = () => {
    setFile(null);
    setScan(null);
    setPhase('idle');
    setProgress(0);
    setError(null);
    setPreview(null);
  };

  const analyze = async () => {
    if (!file || !preview) return;
    const runId = ++runRef.current;
    setPhase('analyzing');
    setError(null);
    setProgress(0);

    for (const p of [16, 38, 62, 86]) {
      await new Promise((r) => setTimeout(r, 600));
      if (runRef.current !== runId) return;
      setProgress(p);
    }

    try {
      const thumbnail = await makeThumbnail(file);
      const draft = createScanDraft(file, thumbnail, preview);
      const { data, error: dbError } = await supabase
        .from('scans')
        .insert(draft)
        .select()
        .single();

      if (runRef.current !== runId) return;
      if (dbError) throw dbError;
      setProgress(100);
      setScan(data);
      setPhase('done');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      if (runRef.current !== runId) return;
      setError(
        e instanceof Error
          ? `Analysis failed: ${e.message}`
          : 'Analysis failed. Please try again.'
      );
      setPhase('idle');
    }
  };

  return (
    <div>
      <section className="relative overflow-hidden pb-10 pt-28 sm:pt-36">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="animate-fade-up font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Product Label <span className="text-gradient">Scan</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Upload a photo of your product label. LegalLens reads it, extracts the
            details, and verifies them against labeling requirements.
          </p>
          <p className="animate-fade-up mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500">
            <Lock className="h-3 w-3" />
            Your image stays private and is never shared
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        {phase === 'idle' && (
          <div className="animate-fade-up space-y-5">
            <ImageUploader
              file={file}
              previewUrl={preview}
              onFileSelected={handleFileSelected}
              onClear={handleClear}
              onReject={handleReject}
            />

            {error && (
              <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                {error}
              </p>
            )}

            {file && preview && (
              <Reveal>
                <div className="card-premium flex flex-col items-center justify-between gap-4 p-6 sm:flex-row">
                  <div>
                    <p className="font-display font-semibold text-slate-900">
                      Ready when you are
                    </p>
                    <p className="text-sm text-slate-500">
                      The compliance check takes under a minute.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={analyze}
                      className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-blue-700 hover:shadow-glow-lg"
                    >
                      Run Compliance Check
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                    <button
                      onClick={handleClear}
                      className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                      Start Over
                    </button>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        )}

        {phase === 'analyzing' && (
          <div className="card-premium p-8 sm:p-12">
            <div className="flex flex-col items-center text-center">
              <span className="relative flex h-20 w-20 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-blue-400/20" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-glow">
                  <Loader2 className="h-7 w-7 animate-spin" />
                </span>
              </span>
              <p className="mt-6 font-display text-xl font-bold text-slate-900">
                Analyzing your label
              </p>
              <p className="mt-1.5 text-sm text-slate-500">
                This usually takes less than a minute
              </p>
              <div className="mt-8 h-2.5 w-full max-w-md overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-sky-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs font-semibold text-slate-500">{progress}%</p>
              <ul className="mt-8 w-full max-w-sm space-y-2.5 text-left">
                {ANALYSIS_STEPS.map((step, i) => {
                  const done = progress >= (i + 1) * 22;
                  const active = !done && progress >= i * 22;
                  return (
                    <li
                      key={step.label}
                      className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm ring-1 transition-all duration-300 ${
                        done
                          ? 'bg-green-50 text-green-800 ring-green-100'
                          : active
                            ? 'bg-blue-50 text-blue-800 ring-blue-100'
                            : 'bg-slate-50 text-slate-400 ring-slate-100'
                      }`}
                    >
                      {done ? (
                        <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-green-600" />
                      ) : (
                        <step.icon
                          className={`h-4.5 w-4.5 shrink-0 ${
                            active ? 'animate-pulse-soft text-blue-600' : 'text-slate-300'
                          }`}
                        />
                      )}
                      {step.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {phase === 'done' && scan && (
          <div className="space-y-8">
            <Reveal>
              <div className="card-premium overflow-hidden">
                <div className="flex flex-col gap-7 p-7 sm:p-9 lg:flex-row">
                  <div className="lg:w-60 shrink-0">
                    {scan.thumbnail && (
                      <img
                        src={scan.thumbnail}
                        alt={scan.image_name}
                        className="w-full rounded-2xl border border-slate-200 object-cover shadow-card"
                      />
                    )}
                    <p className="mt-2.5 truncate text-xs text-slate-500">
                      {scan.image_name}
                    </p>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="font-display text-2xl font-bold text-slate-900">
                        Product Details
                      </h2>
                      <button
                        onClick={handleClear}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        New Scan
                      </button>
                    </div>
                    <dl className="mt-5 grid gap-x-8 sm:grid-cols-2">
                      {FIELD_META.map(({ key, label, icon: Icon }) => {
                        const value = scan[key] || 'Not detected';
                        const missing = !scan[key];
                        return (
                          <div
                            key={key}
                            className={`flex gap-3 rounded-xl p-3 transition-colors ${
                              missing ? 'bg-red-50/60' : 'hover:bg-slate-50'
                            }`}
                          >
                            <Icon
                              className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${
                                missing ? 'text-red-400' : 'text-blue-600'
                              }`}
                            />
                            <div className="min-w-0">
                              <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                {label}
                              </dt>
                              <dd
                                className={`mt-0.5 break-words text-sm leading-relaxed ${
                                  missing ? 'italic text-red-500' : 'text-slate-800'
                                }`}
                              >
                                {value}
                              </dd>
                            </div>
                          </div>
                        );
                      })}
                    </dl>
                  </div>
                </div>
              </div>
            </Reveal>

            <ComplianceResults scan={scan} />
          </div>
        )}
      </section>
    </div>
  );
}
