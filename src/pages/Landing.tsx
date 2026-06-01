import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PhoneIcon,
  VideoIcon,
  CheckCircle2Icon,
  UserIcon,
  Volume2Icon,
  ShieldCheckIcon,
  MousePointerClickIcon,
  ChevronDownIcon,
  MessageCircleIcon } from
'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
export function Landing() {
  return (
    <div className="flex flex-col w-full">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
    </div>);

}
function HeroSection() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden bg-background">
      <div className="absolute inset-0 bg-primary/5 rounded-br-[100px] sm:rounded-br-[200px] -z-10" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <motion.h1
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            className="text-5xl sm:text-6xl lg:text-[64px] font-extrabold text-ink-primary leading-[1.1] mb-8">
            
            Join a meeting as easily as answering a phone call.
          </motion.h1>
          <motion.p
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.1
            }}
            className="text-2xl text-ink-secondary mb-12 max-w-2xl mx-auto lg:mx-0">
            
            The radically simple video calling app designed for everyone.
            Perfect for churches, schools, families, and anyone who finds
            technology frustrating.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              delay: 0.2
            }}
            className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            
            <Link to="/join" tabIndex={-1}>
              <Button
                variant="success"
                size="xl"
                fullWidth
                icon={<PhoneIcon size={28} />}>
                
                Join Meeting
              </Button>
            </Link>
            <Link to="/admin/create" tabIndex={-1}>
              <Button
                variant="primary"
                size="xl"
                fullWidth
                icon={<VideoIcon size={28} />}>
                
                Create Meeting
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="flex-1 w-full max-w-lg lg:max-w-none relative">
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.9
            }}
            animate={{
              opacity: 1,
              scale: 1
            }}
            transition={{
              delay: 0.3,
              duration: 0.5
            }}
            className="relative bg-white rounded-[2rem] shadow-2xl p-4 border-8 border-slate-100 aspect-[4/3] flex flex-col overflow-hidden">
            
            {/* Mock UI Header */}
            <div className="flex justify-between items-center mb-4 px-2">
              <div className="h-4 w-32 bg-slate-200 rounded-full" />
              <div className="flex gap-2">
                <div className="h-3 w-3 bg-red-400 rounded-full" />
                <div className="h-3 w-3 bg-amber-400 rounded-full" />
                <div className="h-3 w-3 bg-green-400 rounded-full" />
              </div>
            </div>
            {/* Mock Video Grid */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="bg-blue-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="w-20 h-20 bg-blue-200 rounded-full flex items-center justify-center">
                  <UserIcon size={40} className="text-blue-400" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                  Pastor John
                </div>
              </div>
              <div className="bg-green-100 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="w-20 h-20 bg-green-200 rounded-full flex items-center justify-center">
                  <UserIcon size={40} className="text-green-400" />
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                  Sarah (You)
                </div>
              </div>
            </div>
            {/* Mock Controls */}
            <div className="mt-4 flex justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <Volume2Icon size={20} className="text-slate-500" />
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                <VideoIcon size={20} className="text-slate-500" />
              </div>
              <div className="w-16 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <PhoneIcon size={20} className="text-red-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>);

}
function FeaturesSection() {
  const features = [
  {
    icon: <MousePointerClickIcon size={40} />,
    title: 'One-Click Join',
    desc: 'No confusing links or downloads. Just click the big green button.'
  },
  {
    icon: <UserIcon size={40} />,
    title: 'No Account Needed',
    desc: "Participants don't need to remember passwords or create accounts."
  },
  {
    icon: <Volume2Icon size={40} />,
    title: 'Voice Assistance',
    desc: 'Built-in screen reading and voice prompts for visually impaired users.'
  },
  {
    icon: <CheckCircle2Icon size={40} />,
    title: 'Big Buttons',
    desc: 'Large, clearly labeled buttons that are easy to see and tap.'
  },
  {
    icon: <VideoIcon size={40} />,
    title: 'Crystal-Clear Audio',
    desc: 'Optimized for voice clarity, even on slower internet connections.'
  },
  {
    icon: <ShieldCheckIcon size={40} />,
    title: 'Secure & Private',
    desc: 'Meetings are locked and secure. Only invited guests can join.'
  }];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-ink-primary mb-6">
            Designed for simplicity
          </h2>
          <p className="text-2xl text-ink-secondary max-w-3xl mx-auto">
            We removed all the confusing features so you can focus on the
            conversation.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) =>
          <Card
            key={i}
            className="flex flex-col items-center text-center hover:border-primary transition-colors">
            
              <div className="w-20 h-20 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                {f.icon}
              </div>
              <h3 className="text-2xl font-bold text-ink-primary mb-4">
                {f.title}
              </h3>
              <p className="text-xl text-ink-secondary">{f.desc}</p>
            </Card>
          )}
        </div>
      </div>
    </section>);

}
function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-ink-primary mb-6">
            How it works
          </h2>
          <p className="text-2xl text-ink-secondary">
            Three simple steps to start talking.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute top-12 left-20 right-20 h-1 bg-border -z-10" />

          {[
          {
            step: 1,
            title: 'Get a meeting link',
            desc: 'Your host will send you a simple link via email or text message.'
          },
          {
            step: 2,
            title: 'Click Join',
            desc: "Type your name and click the big green 'Join Meeting' button."
          },
          {
            step: 3,
            title: "You're in!",
            desc: 'Wait a moment for the host to let you in, and start talking.'
          }].
          map((s) =>
          <div
            key={s.step}
            className="flex-1 flex flex-col items-center text-center">
            
              <div className="w-24 h-24 rounded-full bg-primary text-white text-4xl font-bold flex items-center justify-center mb-8 shadow-lg border-8 border-muted">
                {s.step}
              </div>
              <h3 className="text-3xl font-bold text-ink-primary mb-4">
                {s.title}
              </h3>
              <p className="text-xl text-ink-secondary">{s.desc}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}
function TestimonialsSection() {
  const testimonials = [
  {
    quote:
    'Finally, a video app my 85-year-old mother can use without calling me for help first. It just works.',
    name: 'David M.',
    role: 'Son'
  },
  {
    quote:
    'We switched our Sunday services to EasyMeet. Our older congregation members love how big the buttons are.',
    name: 'Pastor Sarah',
    role: 'Community Church'
  },
  {
    quote:
    "I don't need to install anything or remember passwords. I just click the link and see my grandchildren.",
    name: 'Margaret T.',
    role: 'Grandmother'
  }];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-ink-primary text-center mb-16">
          Loved by people who hate technology
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) =>
          <Card key={i} className="bg-primary/5 border-none">
              <div className="flex gap-1 mb-6 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) =>
              <span key={star}>★</span>
              )}
              </div>
              <p className="text-2xl text-ink-primary font-medium mb-8 leading-relaxed">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="text-xl font-bold text-ink-primary">
                    {t.name}
                  </div>
                  <div className="text-lg text-ink-secondary">{t.role}</div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </section>);

}
function FAQSection() {
  const faqs = [
  {
    q: 'Do I need to install anything?',
    a: 'No! EasyMeet works directly in your web browser. There is nothing to download or install.'
  },
  {
    q: 'Is it free?',
    a: 'Joining a meeting is always 100% free. Hosts can create free accounts for short meetings, or upgrade for unlimited time.'
  },
  {
    q: 'Will it work on my phone or tablet?',
    a: 'Yes, EasyMeet works beautifully on iPhones, iPads, Android phones, and all computers.'
  },
  {
    q: 'Do I need an account to join?',
    a: 'Never. Only the person creating the meeting needs an account. Guests just type their name and join.'
  },
  {
    q: 'Is it secure?',
    a: 'Yes. All meetings are private and encrypted. The host controls who is allowed into the meeting room.'
  }];

  return (
    <section className="py-24 bg-muted">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-ink-primary text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, i) =>
          <FAQItem key={i} question={faq.q} answer={faq.a} />
          )}
        </div>
      </div>
    </section>);

}
function FAQItem({ question, answer }: {question: string;answer: string;}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 sm:p-8 text-left focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary">
        
        <span className="text-2xl font-bold text-ink-primary">{question}</span>
        <ChevronDownIcon
          size={32}
          className={`text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        
      </button>
      <AnimatePresence>
        {isOpen &&
        <motion.div
          initial={{
            height: 0,
            opacity: 0
          }}
          animate={{
            height: 'auto',
            opacity: 1
          }}
          exit={{
            height: 0,
            opacity: 0
          }}
          transition={{
            duration: 0.3
          }}>
          
            <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 text-xl text-ink-secondary border-t border-border mt-2">
              <div className="pt-6">{answer}</div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </Card>);

}
function ContactSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-ink-primary mb-6">
          Still have questions?
        </h2>
        <p className="text-2xl text-ink-secondary mb-12">
          Our friendly support team is here to help you.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-8 mb-12">
          <div className="flex items-center justify-center gap-4 text-2xl font-medium text-ink-primary">
            <PhoneIcon size={32} className="text-primary" />
            1-800-EASY-MEET
          </div>
          <div className="flex items-center justify-center gap-4 text-2xl font-medium text-ink-primary">
            <MessageCircleIcon size={32} className="text-primary" />
            help@easymeet.example.com
          </div>
        </div>

        <Link to="/help" tabIndex={-1}>
          <Button variant="outline" size="xl">
            Visit Help Center
          </Button>
        </Link>
      </div>
    </section>);

}