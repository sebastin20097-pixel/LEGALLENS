import { useEffect, useState } from 'react';
import { ScanSearch, ArrowRight, Menu, X } from 'lucide-react';

interface Props {
  page: string;
  onNavigate: (page: string) => void;
}

const LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'features', label: 'Features' },
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'about', label: 'About' },
  { id: 'contact', label: 'Contact' },
];

export default function Navbar({ page, onNavigate }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (id: string) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? 'border-b border-slate-200/70 bg-white/80 shadow-sm backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => go('home')} className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-glow">
            <ScanSearch className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-slate-900">
            Legal<span className="text-gradient">Lens</span>
          </span>
        </button>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                page === link.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => go('upload')}
            className="group ml-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600"
          >
            Upload Product
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </nav>

        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg p-2 text-slate-700 transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-slate-100 bg-white/95 px-4 pb-5 pt-2 backdrop-blur-xl md:hidden">
          {LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => go(link.id)}
              className={`block w-full rounded-lg px-3.5 py-2.5 text-left text-sm font-medium ${
                page === link.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => go('upload')}
            className="mt-2 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Upload Product
          </button>
        </nav>
      )}
    </header>
  );
}
