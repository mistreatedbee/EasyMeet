import {
  MicIcon,
  MicOffIcon,
  HandIcon,
  MessageCircleIcon,
  PhoneOffIcon,
  VideoIcon,
  VideoOffIcon,
  MonitorUpIcon,
  UsersIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';

interface MeetingControlBarProps {
  micOn: boolean;
  setMicOn: (val: boolean) => void;
  cameraOn: boolean;
  setCameraOn: () => void;
  screenSharing: boolean;
  setScreenSharing: () => void;
  handRaised: boolean;
  setHandRaised: (val: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (val: boolean) => void;
  participantsOpen: boolean;
  setParticipantsOpen: (val: boolean) => void;
  isHost: boolean;
  onLeave?: () => void;
}

export function MeetingControlBar({
  micOn,
  setMicOn,
  cameraOn,
  setCameraOn,
  screenSharing,
  setScreenSharing,
  handRaised,
  setHandRaised,
  chatOpen,
  setChatOpen,
  participantsOpen,
  setParticipantsOpen,
  isHost,
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
      {/* LEFT: Chat + Participants */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setChatOpen(!chatOpen)}
          aria-label="Toggle chat panel"
          className={cn(
            'flex flex-col items-center justify-center w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-primary focus:outline-none',
            chatOpen
              ? 'bg-primary text-white'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-500'
          )}
        >
          <MessageCircleIcon size={24} />
          <span className="text-[10px] font-semibold">Chat</span>
        </button>

        <button
          onClick={() => setParticipantsOpen(!participantsOpen)}
          aria-label="Toggle participants panel"
          className={cn(
            'flex flex-col items-center justify-center w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-primary focus:outline-none',
            participantsOpen
              ? 'bg-primary text-white'
              : 'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-500'
          )}
        >
          <UsersIcon size={24} />
          <span className="text-[10px] font-semibold">People</span>
        </button>
      </div>

      {/* CENTER: Camera + Mic + RaiseHand (students) / ScreenShare (host) */}
      <div className="flex items-center gap-2">
        <button
          onClick={setCameraOn}
          aria-label={cameraOn ? 'Turn off camera' : 'Turn on camera'}
          className={cn(
            'flex flex-col items-center justify-center w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-primary focus:outline-none',
            cameraOn
              ? 'bg-slate-600 text-white hover:bg-slate-500 active:bg-slate-400'
              : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
          )}
        >
          {cameraOn ? <VideoIcon size={24} /> : <VideoOffIcon size={24} />}
          <span className="text-[10px] font-semibold">{cameraOn ? 'Camera' : 'No Cam'}</span>
        </button>

        {/* Microphone — largest, most important */}
        <button
          onClick={() => setMicOn(!micOn)}
          aria-label={micOn ? 'Mute microphone' : 'Unmute microphone'}
          className={cn(
            'flex flex-col items-center justify-center w-[80px] h-[80px] sm:w-[88px] sm:h-[88px] rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-primary focus:outline-none ring-2 shadow-lg',
            micOn
              ? 'bg-slate-600 text-white hover:bg-slate-500 active:bg-slate-400 ring-slate-500'
              : 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 ring-red-500'
          )}
        >
          {micOn ? <MicIcon size={30} /> : <MicOffIcon size={30} />}
          <span className="text-xs font-bold">{micOn ? 'Mute' : 'Unmute'}</span>
        </button>

        {isHost ? (
          <button
            onClick={setScreenSharing}
            aria-label={screenSharing ? 'Stop sharing screen' : 'Share screen'}
            className={cn(
              'flex flex-col items-center justify-center w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-primary focus:outline-none',
              screenSharing
                ? 'bg-blue-500 text-white hover:bg-blue-600 active:bg-blue-700'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-500'
            )}
          >
            <MonitorUpIcon size={24} />
            <span className="text-[10px] font-semibold leading-tight text-center">
              {screenSharing ? 'Stop' : 'Share'}
            </span>
          </button>
        ) : (
          <button
            onClick={() => setHandRaised(!handRaised)}
            aria-label={handRaised ? 'Lower hand' : 'Raise hand'}
            className={cn(
              'flex flex-col items-center justify-center w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-primary focus:outline-none',
              handRaised
                ? 'bg-amber-500 text-white hover:bg-amber-600 active:bg-amber-700'
                : 'bg-slate-700 text-slate-200 hover:bg-slate-600 active:bg-slate-500'
            )}
          >
            <HandIcon size={24} className={handRaised ? 'animate-bounce' : ''} />
            <span className="text-[10px] font-semibold leading-tight text-center">
              {handRaised ? 'Lower' : 'Raise Hand'}
            </span>
          </button>
        )}
      </div>

      {/* RIGHT: Leave */}
      <button
        onClick={handleLeave}
        aria-label="Leave meeting"
        className="flex flex-col items-center justify-center w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl gap-1 transition-colors focus-visible:ring-4 focus-visible:ring-red-400 focus:outline-none bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-lg"
      >
        <PhoneOffIcon size={24} />
        <span className="text-[10px] font-semibold">Leave</span>
      </button>
    </div>
  );
}
