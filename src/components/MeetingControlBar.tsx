import {
  MicIcon,
  MicOffIcon,
  HandIcon,
  MessageCircleIcon,
  PhoneOffIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

interface MeetingControlBarProps {
  micOn: boolean;
  setMicOn: (val: boolean) => void;
  handRaised: boolean;
  setHandRaised: (val: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (val: boolean) => void;
  onLeave?: () => void;
}

export function MeetingControlBar({
  micOn,
  setMicOn,
  handRaised,
  setHandRaised,
  chatOpen,
  setChatOpen,
  onLeave,
}: MeetingControlBarProps) {
  const navigate = useNavigate();

  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave the meeting?')) {
      if (onLeave) onLeave();
      else navigate('/');
    }
  };

  return (
    <div
      className="bg-slate-900 border-t border-slate-800 flex items-center justify-between px-4 py-3 w-full flex-shrink-0"
      style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom))' }}
    >
      {/* LEFT: Chat */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        aria-label="Toggle chat panel"
        className={cn(
          'flex flex-col items-center justify-center w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-primary focus:outline-none',
          chatOpen
            ? 'bg-primary text-white'
            : 'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-500'
        )}
      >
        <MessageCircleIcon size={28} />
        <span className="text-xs font-semibold">Chat</span>
      </button>

      {/* CENTER: Mic + Raise Hand — primary actions */}
      <div className="flex items-center gap-3">
        {/* Microphone — largest button, most important control */}
        <button
          onClick={() => setMicOn(!micOn)}
          aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
          className={cn(
            'flex flex-col items-center justify-center w-[88px] h-[88px] sm:w-24 sm:h-24 rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-primary focus:outline-none ring-2 shadow-lg',
            micOn
              ? 'bg-slate-600 text-white hover:bg-slate-500 active:bg-slate-400 ring-slate-500'
              : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 ring-red-500'
          )}
        >
          {micOn ? <MicIcon size={32} /> : <MicOffIcon size={32} />}
          <span className="text-xs font-bold">{micOn ? 'Mute' : 'Unmute'}</span>
        </button>

        {/* Raise Hand */}
        <button
          onClick={() => setHandRaised(!handRaised)}
          aria-label={handRaised ? 'Lower hand' : 'Raise hand'}
          className={cn(
            'flex flex-col items-center justify-center w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-primary focus:outline-none',
            handRaised
              ? 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-500'
          )}
        >
          <HandIcon
            size={28}
            className={handRaised ? 'animate-bounce' : ''}
          />
          <span className="text-[10px] sm:text-xs font-semibold leading-tight text-center">
            {handRaised ? 'Lower' : 'Raise Hand'}
          </span>
        </button>
      </div>

      {/* RIGHT: End Call */}
      <button
        onClick={handleLeave}
        aria-label="Leave meeting"
        className="flex flex-col items-center justify-center w-[72px] h-[72px] sm:w-20 sm:h-20 rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-red-400 focus:outline-none bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg"
      >
        <PhoneOffIcon size={28} />
        <span className="text-xs font-semibold">Leave</span>
      </button>
    </div>
  );
}
