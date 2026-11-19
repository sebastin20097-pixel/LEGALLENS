import { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Clock, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Reveal from '@/components/Reveal';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email, and message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setSending(true);
    setError(null);
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert({ name: name.trim(), email: email.trim(), message: message.trim() });
    if (dbError) {
      setError('Your message could not be sent. Please try again in a moment.');
      setSending(false);
      return;
    }
    setSending(false);
    setSent(true);
  };

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

  return (
    <div>
      <section className="relative overflow-hidden pb-12 pt-28 sm:pt-36">
        <div className="absolute inset-0 bg-grid-fade" />
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h1 className="animate-fade-up font-display text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Talk to a <span className="text-gradient">human</span>
          </h1>
          <p className="animate-fade-up mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-600">
            Questions about a label, a regulation, or a scan result? We reply
            within one business day.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20 sm:px-6">
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">
            <div className="card-premium p-7 sm:p-9">
              {sent ? (
                <div className="flex flex-col items-center py-12 text-center">
                  <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                  </span>
                  <h2 className="mt-5 font-display text-xl font-bold text-slate-900">
                    Message sent
                  </h2>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-600">
                    Thanks, {name.split(' ')[0]}. We have your message and will
                    reply to {email} shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setName('');
                      setEmail('');
                      setMessage('');
                    }}
                    className="mt-7 rounded-xl border border-slate-300 px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Jane Smith"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-slate-700"
                      >
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jane@company.com"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-slate-700"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Tell us about your product and what you need checked…"
                      className={`${inputClass} resize-y`}
                    />
                  </div>
                  {error && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={sending}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-blue-700 hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {sending ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  title: 'Email',
                  body: 'support@legallens.example',
                },
                {
                  icon: MapPin,
                  title: 'Office',
                  body: '120 Commerce Street, Suite 400, Boston, MA 02110',
                },
                {
                  icon: Clock,
                  title: 'Response time',
                  body: 'Within 1 business day',
                },
                {
                  icon: MessageSquare,
                  title: 'Enterprise',
                  body: 'Volume reviews and API access on request',
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  className="card-premium card-premium-hover p-5"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 text-sm font-semibold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
