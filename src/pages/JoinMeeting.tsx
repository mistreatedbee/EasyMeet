import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  PhoneIcon,
  Volume2Icon,
  TypeIcon,
  ContrastIcon,
  LockIcon,
  ChevronDownIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card } from '../components/Card';
import { FloatingHelpButton } from '../components/FloatingHelpButton';
import { insforge } from '../lib/insforge';

export function JoinMeeting() {
  const navigate = useNavigate();
  const { meetingCode } = useParams<{ meetingCode: string }>();

  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingId, setMeetingId] = useState('');
  const [meetingStatus, setMeetingStatus] = useState<'waiting' | 'active' | 'ended' | 'not_found'>('waiting');
  const [loadingMeeting, setLoadingMeeting] = useState(true);

  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');

  const [voiceAssistance, setVoiceAssistance] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);

  useEffect(() => {
    if (!meetingCode) return;
    insforge.database
      .from('meetings')
      .select('id, title, status, is_locked')
      .eq('meeting_code', meetingCode)
      .single()
      .then(({ data }) => {
        if (!data) {
          setMeetingStatus('not_found');
        } else {
          setMeetingId(data.id);
          setMeetingTitle(data.title);
          setMeetingStatus(data.status as 'waiting' | 'active' | 'ended');
          if (data.is_locked) setMeetingStatus('ended');
        }
        setLoadingMeeting(false);
      });
  }, [meetingCode]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !meetingCode || !meetingId) return;
    setJoining(true);
    setError('');

    const { data: participant, error: dbErr } = await insforge.database
      .from('participants')
      .insert([{
        meeting_id: meetingId,
        name: name.trim(),
        role: 'student',
        admitted: false,
      }])
      .select()
      .single();

    if (dbErr || !participant) {
      setError('Could not join. Please try again.');
      setJoining(false);
      return;
    }

    sessionStorage.setItem('participantId', participant.id);
    sessionStorage.setItem('participantName', name.trim());
    sessionStorage.setItem('meetingCode', meetingCode);
    sessionStorage.setItem('meetingId', meetingId);

    navigate(`/waiting/${meetingCode}`);
  };

  if (loadingMeeting) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="text-ink-secondary text-xl">Loading meeting...</div>
      </div>
    );
  }

  if (meetingStatus === 'not_found') {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <Card className="max-w-[480px] w-full text-center">
          <AlertCircleIcon size={48} className="text-danger mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-ink-primary mb-2">Meeting Not Found</h1>
          <p className="text-ink-secondary text-lg">
            This meeting link is invalid or has expired. Please check the link and try again.
          </p>
        </Card>
      </div>
    );
  }

  if (meetingStatus === 'ended') {
    return (
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <Card className="max-w-[480px] w-full text-center">
          <AlertCircleIcon size={48} className="text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-ink-primary mb-2">Meeting Has Ended</h1>
          <p className="text-ink-secondary text-lg">
            This meeting is no longer active. The host may start a new one.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`flex-grow flex flex-col items-center justify-center p-4 py-12 ${highContrast ? 'bg-black text-white' : 'bg-background'}`}>

      <div className={`w-full max-w-[560px] ${largeText ? 'scale-110 origin-top' : ''}`}>
        <Card className={`mb-8 ${highContrast ? 'bg-black border-white border-4' : ''}`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Join a Meeting</h1>
            <div
              className={`inline-block px-4 py-2 rounded-lg ${highContrast ? 'bg-white text-black' : 'bg-muted text-ink-secondary'} text-lg font-medium`}>
              {meetingTitle || 'Loading...'}
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
              className={highContrast ? 'bg-black text-white border-white' : ''}
            />

            {!showPassword ? (
              <button
                type="button"
                onClick={() => setShowPassword(true)}
                className="flex items-center gap-2 text-lg text-ink-secondary hover:text-primary font-medium focus-visible:ring-4 focus-visible:ring-primary rounded-lg p-1">
                <LockIcon size={20} />
                This meeting has a password
                <ChevronDownIcon size={20} />
              </button>
            ) : (
              <Input
                label="Meeting Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={highContrast ? 'bg-black text-white border-white' : ''}
              />
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-base">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="success"
              size="xl"
              fullWidth
              icon={<PhoneIcon size={28} />}
              disabled={!name.trim() || joining}
              className="mt-4">
              {joining ? 'Joining...' : 'Join Meeting'}
            </Button>
          </form>
        </Card>

        {/* Accessibility Controls */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {[
            { state: voiceAssistance, setter: setVoiceAssistance, Icon: Volume2Icon, label: 'Voice Assistance' },
            { state: largeText, setter: setLargeText, Icon: TypeIcon, label: 'Larger Text' },
            { state: highContrast, setter: setHighContrast, Icon: ContrastIcon, label: 'High Contrast' },
          ].map(({ state, setter, Icon, label }) => (
            <button
              key={label}
              onClick={() => setter(!state)}
              className={`flex items-center gap-2 px-4 py-3 rounded-full border-2 text-lg font-medium transition-colors focus-visible:ring-4 focus-visible:ring-primary ${state ? 'bg-primary text-white border-primary' : 'bg-white text-ink-primary border-border hover:border-primary'}`}
              aria-pressed={state}>
              <Icon size={24} />
              {label} {Icon === Volume2Icon ? (state ? 'On' : 'Off') : ''}
            </button>
          ))}
        </div>

        <Card padding="sm" className={`bg-blue-50 border-blue-100 ${highContrast ? 'bg-black border-white border-2' : ''}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center text-sm">i</span>
            Simple Instructions
          </h3>
          <ul className="space-y-4 text-lg">
            {['Type your name in the box above.', 'Press the big green "Join Meeting" button.', 'Wait a moment for the host to let you in.'].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-blue-200 flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <FloatingHelpButton />
    </div>
  );
}
