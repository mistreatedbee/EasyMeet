import React, { useState } from 'react';
import {
  SearchIcon,
  VideoIcon,
  MicIcon,
  UserIcon,
  CreditCardIcon,
  PhoneIcon,
  MessageCircleIcon,
  ChevronDownIcon,
  Volume2Icon,
  SettingsIcon } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
export function HelpCenter() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen pb-24">
      <HelpHero />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full -mt-12 relative z-10">
        <Categories />
        <TroubleshootingGuide />
        <HelpFAQ />
        <ContactSupport />
      </div>
    </div>);

}
function HelpHero() {
  return (
    <div className="bg-primary pt-20 pb-32 px-4 sm:px-6 lg:px-8 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">
        How can we help you today?
      </h1>
      <div className="max-w-2xl mx-auto relative">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <SearchIcon className="h-8 w-8 text-ink-secondary" />
        </div>
        <input
          type="text"
          className="block w-full pl-16 pr-6 py-5 border-none rounded-2xl text-xl text-ink-primary placeholder-ink-secondary/60 focus:ring-4 focus:ring-white/50 shadow-lg"
          placeholder="Search for help (e.g. 'microphone not working')" />
        
      </div>
    </div>);

}
function Categories() {
  const categories = [
  {
    icon: <UserIcon size={32} />,
    title: 'Joining a Meeting',
    desc: 'How to get in and get started'
  },
  {
    icon: <MicIcon size={32} />,
    title: 'Audio & Video',
    desc: 'Fix camera and microphone issues'
  },
  {
    icon: <VideoIcon size={32} />,
    title: 'For Hosts',
    desc: 'Creating and managing meetings'
  },
  {
    icon: <CreditCardIcon size={32} />,
    title: 'Account & Billing',
    desc: 'Manage your subscription'
  }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-24">
      {categories.map((cat, i) =>
      <Card
        key={i}
        className="flex items-start gap-6 hover:border-primary cursor-pointer transition-colors group">
        
          <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            {cat.icon}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-ink-primary mb-2">
              {cat.title}
            </h3>
            <p className="text-lg text-ink-secondary">{cat.desc}</p>
          </div>
        </Card>
      )}
    </div>);

}
function TroubleshootingGuide() {
  return (
    <div className="mb-24">
      <h2 className="text-3xl font-bold text-ink-primary mb-8 text-center">
        Quick Troubleshooting
      </h2>

      <Card className="mb-8 border-l-8 border-l-accent">
        <h3 className="text-2xl font-bold text-ink-primary mb-6 flex items-center gap-3">
          <Volume2Icon className="text-accent" size={32} />I can't hear anyone
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-muted p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-border">
              1
            </div>
            <p className="text-lg font-medium">
              Check your computer's volume is turned up
            </p>
          </div>
          <div className="bg-muted p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-border">
              2
            </div>
            <p className="text-lg font-medium">
              Make sure your speakers or headphones are plugged in
            </p>
          </div>
          <div className="bg-muted p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-border">
              3
            </div>
            <p className="text-lg font-medium">
              Ask the other person if they are muted
            </p>
          </div>
        </div>
      </Card>

      <Card className="border-l-8 border-l-primary">
        <h3 className="text-2xl font-bold text-ink-primary mb-6 flex items-center gap-3">
          <MicIcon className="text-primary" size={32} />
          They can't hear me
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-muted p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-border">
              1
            </div>
            <p className="text-lg font-medium">
              Look at the bottom of your screen
            </p>
          </div>
          <div className="bg-muted p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-border">
              2
            </div>
            <p className="text-lg font-medium">
              If the microphone icon is red with a line through it, you are
              muted
            </p>
          </div>
          <div className="bg-muted p-6 rounded-2xl text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4 border-2 border-border">
              3
            </div>
            <p className="text-lg font-medium">
              Click the microphone icon to unmute yourself
            </p>
          </div>
        </div>
      </Card>
    </div>);

}
function HelpFAQ() {
  const faqs = [
  {
    q: 'How do I change my name in a meeting?',
    a: 'Currently, you cannot change your name once you join. You will need to leave the meeting and rejoin, typing your new name on the join screen.'
  },
  {
    q: 'Can I use EasyMeet on my iPad?',
    a: 'Yes! EasyMeet works perfectly on iPads and iPhones. Just tap the link you were sent, and it will open in your web browser.'
  },
  {
    q: 'Why is my video blurry?',
    a: 'Blurry video is usually caused by a slow internet connection. Try moving closer to your WiFi router, or turning your camera off and back on again.'
  }];

  return (
    <div className="mb-24">
      <h2 className="text-3xl font-bold text-ink-primary mb-8 text-center">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, i) =>
        <FAQItem key={i} question={faq.q} answer={faq.a} />
        )}
      </div>
    </div>);

}
function FAQItem({ question, answer }: {question: string;answer: string;}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Card padding="none" className="overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-6 text-left focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-primary">
        
        <span className="text-xl font-bold text-ink-primary">{question}</span>
        <ChevronDownIcon
          size={28}
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
          
            <div className="px-6 pb-6 pt-0 text-lg text-ink-secondary border-t border-border mt-2">
              <div className="pt-4">{answer}</div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
    </Card>);

}
function ContactSupport() {
  return (
    <Card className="bg-primary/5 border-primary/20 text-center">
      <h2 className="text-3xl font-bold text-ink-primary mb-4">
        Still stuck? A real human will help you.
      </h2>
      <p className="text-xl text-ink-secondary mb-8">
        Our support team is available Monday through Friday, 9am to 5pm EST.
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Button size="xl" icon={<PhoneIcon size={24} />}>
          Call 073 153 1188
        </Button>
        <Button
          variant="outline"
          size="xl"
          icon={<MessageCircleIcon size={24} />}
          className="bg-white">
          
          Live Chat
        </Button>
      </div>
    </Card>);

}
