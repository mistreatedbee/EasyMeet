import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PhoneIcon,
  Volume2Icon,
  TypeIcon,
  ContrastIcon,
  LockIcon,
  ChevronDownIcon } from
'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { FloatingHelpButton } from '../components/FloatingHelpButton';
export function JoinMeeting() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  // Accessibility states
  const [voiceAssistance, setVoiceAssistance] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      navigate('/waiting');
    }
  };
  return (
    <div
      className={`flex-grow flex flex-col items-center justify-center p-4 py-12 ${highContrast ? 'bg-black text-white' : 'bg-background'}`}>
      
      <div
        className={`w-full max-w-[560px] ${largeText ? 'scale-110 origin-top' : ''}`}>
        
        <Card
          className={`mb-8 ${highContrast ? 'bg-black border-white border-4' : ''}`}>
          
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Join a Meeting</h1>
            <div
              className={`inline-block px-4 py-2 rounded-lg ${highContrast ? 'bg-white text-black' : 'bg-muted text-ink-secondary'} text-lg font-medium`}>
              
              Sunday Service with Pastor John
            </div>
          </div>

          <form onSubmit={handleJoin} className="space-y-6">
            <Input
              label="Your Name"
              placeholder="e.g. Mary Smith"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              className={highContrast ? 'bg-black text-white border-white' : ''} />
            

            {!showPassword ?
            <button
              type="button"
              onClick={() => setShowPassword(true)}
              className="flex items-center gap-2 text-lg text-ink-secondary hover:text-primary font-medium focus-visible:ring-4 focus-visible:ring-primary rounded-lg p-1">
              
                <LockIcon size={20} />
                This meeting has a password
                <ChevronDownIcon size={20} />
              </button> :

            <Input
              label="Meeting Password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={
              highContrast ? 'bg-black text-white border-white' : ''
              } />

            }

            <Button
              type="submit"
              variant="success"
              size="xl"
              fullWidth
              icon={<PhoneIcon size={28} />}
              disabled={!name.trim()}
              className="mt-4">
              
              Join Meeting
            </Button>
          </form>
        </Card>

        {/* Accessibility Controls */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setVoiceAssistance(!voiceAssistance)}
            className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 text-lg font-medium transition-colors focus-visible:ring-4 focus-visible:ring-primary ${voiceAssistance ? 'bg-primary text-white border-primary' : 'bg-white text-ink-primary border-border hover:border-primary'}`}
            aria-pressed={voiceAssistance}>
            
            <Volume2Icon size={24} />
            Voice Assistance {voiceAssistance ? 'On' : 'Off'}
          </button>

          <button
            onClick={() => setLargeText(!largeText)}
            className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 text-lg font-medium transition-colors focus-visible:ring-4 focus-visible:ring-primary ${largeText ? 'bg-primary text-white border-primary' : 'bg-white text-ink-primary border-border hover:border-primary'}`}
            aria-pressed={largeText}>
            
            <TypeIcon size={24} />
            Larger Text
          </button>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 text-lg font-medium transition-colors focus-visible:ring-4 focus-visible:ring-primary ${highContrast ? 'bg-primary text-white border-primary' : 'bg-white text-ink-primary border-border hover:border-primary'}`}
            aria-pressed={highContrast}>
            
            <ContrastIcon size={24} />
            High Contrast
          </button>
        </div>

        {/* Instructions */}
        <Card
          padding="sm"
          className={`bg-blue-50 border-blue-100 ${highContrast ? 'bg-black border-white border-2' : ''}`}>
          
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm">
              i
            </span>
            Simple Instructions
          </h3>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                1
              </div>
              <span>Type your name in the box above.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                2
              </div>
              <span>Press the big green "Join Meeting" button.</span>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                3
              </div>
              <span>Wait a moment for the host to let you in.</span>
            </li>
          </ul>
        </Card>
      </div>
      <FloatingHelpButton />
    </div>);

}