import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  PhoneIcon,
  VideoIcon,
  CheckCircle2Icon,
  UserIcon,
  Volume2Icon,
  ShieldCheckIcon,
  MousePointerClickIcon,
  ChevronDownIcon,
  MessageCircleIcon,
  ArrowRightIcon,
  XIcon,
  StarIcon,
  MicIcon,
  MicOffIcon,
  VideoOffIcon,
  MonitorUpIcon,
  UsersIcon,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

// ----------------------------------------------------------------------
// 1. LANDING PAGE (main composition)
// ----------------------------------------------------------------------
export function Landing() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </div>
  );
}

// ----------------------------------------------------------------------
// 2. MODAL (join with code) – fully accessible
// ----------------------------------------------------------------------
function JoinWithCodeModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Close on outside click
  const handleBackdrop = useCallback(
    (e: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  const handleJoin = () => {
    const cleaned = code.trim();
    if (!cleaned) return;
    onClose();
    navigate(`/join/${cleaned}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
      onClick={handleBackdrop}
      aria-modal="true"
      role="dialog"
      aria-label="Enter meeting code"
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, y: -8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -8 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-border p-6 sm:p-8 relative"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors focus-visible:ring-2 focus-visible:ring-primary"
        >
          <XIcon size={20} />
        </button>

        <h2 className="text-2xl font-bold text-ink-primary mb-1">Join a Meeting</h2>
        <p className="text-base text-ink-secondary mb-6">
          Enter the meeting code or full link you received.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            ref={inputRef}
            type="text"
            placeholder="e.g. abc123xyz"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            className="flex-1 h-14 px-5 rounded-2xl border-2 border-border focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 text-lg"
            aria-label="Meeting code"
          />
          <Button
            variant="success"
            size="lg"
            icon={<ArrowRightIcon size={22} />}
            disabled={!code.trim()}
            onClick={handleJoin}
            className="w-full sm:w-auto"
          >
            Join
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ----------------------------------------------------------------------
// 3. HERO SECTION – improved mockup, accessibility, and CTA
// ----------------------------------------------------------------------
function HeroSection() {
  const [showJoinModal, setShowJoinModal] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  return (
    <section
      aria-label="Hero"
      className="relative pt-20 sm:pt-28 pb-32 overflow-hidden bg-background"
    >
      {/* Decorative background shapes */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-br-[120px] sm:rounded-br-[200px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
        {/* Left column */}
        <div className="flex-1 text-center lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl lg:text-[64px] font-extrabold text-ink-primary leading-[1.1] mb-8"
          >
            Video calls so simple,<br />
            <span className="text-primary">it feels like answering the phone.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl sm:text-2xl text-ink-secondary mb-12 max-w-2xl mx-auto lg:mx-0"
          >
            No downloads. No passwords. No frustration. Perfect for churches,
            schools, families, and everyone who thinks technology should just
            work.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start"
          >
            {/* Join button with modal */}
            <div ref={wrapperRef} className="relative">
              <Button
                variant="success"
                size="xl"
                icon={<PhoneIcon size={28} />}
                onClick={() => setShowJoinModal((v) => !v)}
                aria-haspopup="dialog"
                aria-expanded={showJoinModal}
              >
                Join a Meeting
              </Button>
              <AnimatePresence>
                {showJoinModal && (
                  <JoinWithCodeModal onClose={() => setShowJoinModal(false)} />
                )}
              </AnimatePresence>
            </div>

            {/* Create meeting link */}
            <Link to="/admin/login" tabIndex={-1}>
              <Button variant="primary" size="xl" fullWidth icon={<VideoIcon size={28} />}>
                Host a Meeting
              </Button>
            </Link>
          </motion.div>

          {/* Trust badge – quick social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-sm text-ink-secondary flex items-center gap-2 justify-center lg:justify-start"
          >
            <ShieldCheckIcon size={18} className="text-primary" />
            Trusted by 10,000+ families & organizations
          </motion.p>
        </div>

        {/* Right column – realistic mockup */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: 'easeOut' }}
            className="relative"
          >
            {/* Floating animation */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="relative bg-white rounded-[2.5rem] shadow-2xl p-4 border-[6px] border-slate-200 aspect-[4/3] flex flex-col overflow-hidden"
            >
              {/* Top bar */}
              <div className="flex justify-between items-center mb-4 px-2">
                <div className="flex items-center gap-2">
                  <UsersIcon size={18} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-500">Family Chat</span>
                </div>
                <div className="flex gap-2">
                  <div className="h-3 w-3 bg-red-400 rounded-full" />
                  <div className="h-3 w-3 bg-amber-400 rounded-full" />
                  <div className="h-3 w-3 bg-green-400 rounded-full" />
                </div>
              </div>

              {/* 2x2 participant grid */}
              <div className="flex-1 grid grid-cols-2 gap-3">
                {[
                  { name: 'Pastor John', bg: 'bg-blue-100', avatar: 'bg-blue-200 text-blue-500' },
                  { name: 'Sarah (You)', bg: 'bg-green-100', avatar: 'bg-green-200 text-green-500' },
                  { name: 'Martha', bg: 'bg-purple-100', avatar: 'bg-purple-200 text-purple-500' },
                  { name: 'David', bg: 'bg-amber-100', avatar: 'bg-amber-200 text-amber-600' },
                ].map((p) => (
                  <div
                    key={p.name}
                    className={`${p.bg} rounded-2xl flex items-center justify-center relative overflow-hidden`}
                  >
                    <div className={`w-14 h-14 ${p.avatar} rounded-full flex items-center justify-center`}>
                      <UserIcon size={28} />
                    </div>
                    <span className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-lg">
                      {p.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Control bar */}
              <div className="mt-4 flex justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <MicIcon size={20} className="text-slate-600" />
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
                  <VideoIcon size={20} className="text-slate-600" />
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors">
                  <PhoneIcon size={20} className="text-red-500" />
                </div>
              </div>
            </motion.div>

            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2 border border-border"
            >
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm font-medium text-ink-primary">Live demo</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ----------------------------------------------------------------------
// 4. FEATURES SECTION – animated cards, memoised for perf
// ----------------------------------------------------------------------
const FeaturesSection = React.memo(() => {
  const features = [
    { icon: <MousePointerClickIcon size={36} />, title: 'One‑Click Join', desc: 'No confusing links or installs. Just tap the big green button.' },
    { icon: <UserIcon size={36} />, title: 'No Account Needed', desc: 'Guests never need a password. Type your name and you’re in.' },
    { icon: <Volume2Icon size={36} />, title: 'Voice Prompts', desc: 'Built‑in screen reading helps visually impaired users join effortlessly.' },
    { icon: <CheckCircle2Icon size={36} />, title: 'Big, Friendly Buttons', desc: 'Extra‑large touch targets designed for all ages and abilities.' },
    { icon: <VideoIcon size={36} />, title: 'Crystal‑Clear Audio', desc: 'Optimised for voice, even on slow connections or older devices.' },
    { icon: <ShieldCheckIcon size={36} />, title: 'Private & Secure', desc: 'Every meeting is locked. Only people you invite can get in.' },
  ];

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-ink-primary mb-6">
            Radically simple by design
          </h2>
          <p className="text-xl sm:text-2xl text-ink-secondary max-w-3xl mx-auto">
            We stripped away the clutter so you can connect in seconds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="flex flex-col items-center text-center h-full hover:border-primary hover:shadow-lg transition-all group">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-ink-primary mb-3">{f.title}</h3>
                <p className="text-lg text-ink-secondary">{f.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ----------------------------------------------------------------------
// 5. HOW IT WORKS – progressive disclosure, accessible steps
// ----------------------------------------------------------------------
const HowItWorksSection = React.memo(() => {
  const steps = [
    {
      step: '01',
      title: 'Get a meeting link',
      desc: 'The host shares a link via WhatsApp, SMS, or email. No app store needed.',
    },
    {
      step: '02',
      title: 'Click to join',
      desc: 'Type your name and tap the big green “Join” button. That’s it.',
    },
    {
      step: '03',
      title: 'Start talking',
      desc: 'Once the host lets you in, you’re live – video, audio, and all.',
    },
  ];

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} id="how-it-works" className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-ink-primary mb-4">How it works</h2>
          <p className="text-xl text-ink-secondary">
            Three steps. Less than a minute. No tech skills required.
          </p>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-10 left-[15%] right-[15%] h-0.5 bg-border -z-10" />

          {steps.map((s, idx) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className="flex-1 flex flex-col items-center text-center"
            >
              <div
                className="w-24 h-24 rounded-full bg-white border-4 border-primary text-primary text-3xl font-bold flex items-center justify-center mb-6 shadow-lg"
                aria-hidden="true"
              >
                {s.step}
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-ink-primary mb-4">{s.title}</h3>
              <p className="text-lg text-ink-secondary max-w-xs">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ----------------------------------------------------------------------
// 6. TESTIMONIALS – improved visuals, accessible stars
// ----------------------------------------------------------------------
const TestimonialsSection = React.memo(() => {
  const testimonials = [
    {
      quote: 'Finally, a video app my 85‑year‑old mother can use without calling me for help. It just works.',
      name: 'David M.',
      role: 'Son',
    },
    {
      quote: 'We switched our Sunday services to EasyMeet. Our older members love how big the buttons are.',
      name: 'Pastor Sarah',
      role: 'Community Church',
    },
    {
      quote: 'I don’t need to install anything or remember passwords. I just click the link and see my grandchildren.',
      name: 'Margaret T.',
      role: 'Grandmother',
    },
  ];

  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl font-bold text-ink-primary text-center mb-16"
        >
          Loved by people who “hate technology”
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15, duration: 0.5 }}
            >
              <Card className="bg-primary/5 border-none h-full flex flex-col">
                <div className="flex gap-1 mb-6 text-amber-400" aria-label="5 out of 5 stars">
                  {[...Array(5)].map((_, idx) => (
                    <StarIcon key={idx} size={24} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="text-xl sm:text-2xl text-ink-primary font-medium mb-8 leading-relaxed flex-1">
                  “{t.quote}”
                </blockquote>
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl"
                    aria-hidden="true"
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-ink-primary">{t.name}</div>
                    <div className="text-base text-ink-secondary">{t.role}</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ----------------------------------------------------------------------
// 7. FAQ – accordion with full keyboard & ARIA support
// ----------------------------------------------------------------------
const FAQSection = React.memo(() => {
  const faqs = [
    { q: 'Do I need to install anything?', a: 'No! EasyMeet works right in your browser on any device. Zero downloads, zero hassle.' },
    { q: 'Is it free?', a: 'Joining a meeting is always free. Hosts get a free plan for short meetings, and affordable upgrades for unlimited time.' },
    { q: 'Does it work on my phone or tablet?', a: 'Absolutely – it’s fully responsive on iPhones, iPads, Android devices, and all computers.' },
    { q: 'Do I need an account to join?', a: 'Never. Only the person hosting needs an account. Guests just type their name.' },
    { q: 'Is it secure?', a: 'Yes. Every meeting is encrypted and locked. The host controls who enters – no gatecrashers.' },
  ];

  return (
    <section aria-label="Frequently Asked Questions" className="py-24 bg-muted">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-ink-primary text-center mb-12">FAQ</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>
    </section>
  );
});

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const id = question.toLowerCase().replace(/\s+/g, '-');
  const panelId = `${id}-answer`;

  return (
    <Card padding="none" className="overflow-hidden">
      <h3>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls={panelId}
          id={`${id}-question`}
          className="w-full flex justify-between items-center p-6 sm:p-8 text-left hover:bg-muted/50 transition-colors focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary rounded-t-2xl"
        >
          <span className="text-xl sm:text-2xl font-bold text-ink-primary pr-4">{question}</span>
          <ChevronDownIcon
            size={28}
            className={`text-primary flex-shrink-0 transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={`${id}-question`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 text-lg sm:text-xl text-ink-secondary border-t border-border mt-2">
              <p className="pt-6">{answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

// ----------------------------------------------------------------------
// 8. CONTACT – final CTA with stickiness on mobile
// ----------------------------------------------------------------------
const ContactSection = React.memo(() => {
  return (
    <section className="py-24 bg-white relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-ink-primary mb-6">Still have questions?</h2>
        <p className="text-xl sm:text-2xl text-ink-secondary mb-12">
          Our friendly support team is just a call or click away.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-8 mb-12">
          <a
            href="tel:18003279633"
            className="flex items-center justify-center gap-4 text-2xl font-medium text-ink-primary hover:text-primary transition-colors"
          >
            <PhoneIcon size={32} className="text-primary" />
            1-800-EASY-MEET
          </a>
          <a
            href="mailto:help@easymeet.example.com"
            className="flex items-center justify-center gap-4 text-2xl font-medium text-ink-primary hover:text-primary transition-colors"
          >
            <MessageCircleIcon size={32} className="text-primary" />
            help@easymeet.example.com
          </a>
        </div>

        <Link to="/help" tabIndex={-1}>
          <Button variant="outline" size="xl">
            Visit Help Center
          </Button>
        </Link>

        {/* Sticky mobile join button */}
        <div className="fixed bottom-6 right-6 z-40 sm:hidden">
          <Link to="/join" tabIndex={-1}>
            <Button
              variant="success"
              size="lg"
              icon={<PhoneIcon size={24} />}
              className="rounded-full shadow-lg h-16 w-16 !p-0 flex items-center justify-center"
              aria-label="Join a meeting"
            />
          </Link>
        </div>
      </div>
    </section>
  );
});
