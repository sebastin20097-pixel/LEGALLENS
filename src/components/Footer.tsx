import { ScanSearch, ShieldCheck } from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

const PAGES = ['home', 'features', 'upload', 'about', 'contact'];

const label = (id: string) => (id === 'upload' ? 'Scan' : id === 'dashboard' ? 'Dashboard' : id);

export default function Footer({ onNavigate }: Props) {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-slate-950 text-slate-300">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[50rem] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 text-white">
                <ScanSearch className="h-5 w-5" />
              </span>
              <span className="font-display text-lg font-bold text-white">
                Legal<span className="text-gradient">Lens</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              AI-powered label compliance for modern product teams. Upload a photo,
              get a scored verdict in seconds.
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-slate-300">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-400" />
              SOC 2-grade data handling
            </span>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Product
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {PAGES.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => onNavigate(p)}
                    className="capitalize text-slate-400 transition hover:text-white"
                  >
                    {label(p)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Company
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li>support@legallens.example</li>
              <li>120 Commerce Street, Suite 400</li>
              <li>Boston, MA 02110</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} LegalLens. All rights reserved.</p>
          <p>Automated label guidance — not legal advice.</p>
        </div>
      </div>
    </footer>
  );
}
