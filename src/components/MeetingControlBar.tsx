import React from 'react';
import {
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
  HandIcon,
  MessageCircleIcon,
  PhoneOffIcon } from
'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../utils/cn';
interface MeetingControlBarProps {
  micOn: boolean;
  setMicOn: (val: boolean) => void;
  cameraOn: boolean;
  setCameraOn: (val: boolean) => void;
  handRaised: boolean;
  setHandRaised: (val: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (val: boolean) => void;
}
export function MeetingControlBar({
  micOn,
  setMicOn,
  cameraOn,
  setCameraOn,
  handRaised,
  setHandRaised,
  chatOpen,
  setChatOpen
}: MeetingControlBarProps) {
  const navigate = useNavigate();
  const handleLeave = () => {
    if (window.confirm('Are you sure you want to leave the meeting?')) {
      navigate('/');
    }
  };
  const ControlButton = ({
    active,
    onClick,
    icon,
    label,
    danger = false,
    accent = false







  }: {active: boolean;onClick: () => void;icon: React.ReactNode;label: string;danger?: boolean;accent?: boolean;}) => {
    return (
      <button
        onClick={onClick}
        className={cn(
          'flex flex-col items-center justify-center min-w-[88px] min-h-[88px] rounded-2xl transition-all focus-visible:ring-4 focus-visible:ring-primary focus:outline-none gap-2',
          danger ?
          'bg-danger text-white hover:bg-red-700' :
          accent && active ?
          'bg-accent text-white hover:bg-orange-600' :
          active ?
          'bg-slate-700 text-white hover:bg-slate-600' :
          'bg-red-100 text-red-600 hover:bg-red-200' // For muted states
        )}>
        
        {icon}
        <span className="text-sm font-bold">{label}</span>
      </button>);

  };
  return (
    <div className="bg-slate-900 border-t border-slate-800 p-4 flex justify-center items-center gap-2 sm:gap-6 w-full overflow-x-auto">
      <ControlButton
        active={micOn}
        onClick={() => setMicOn(!micOn)}
        icon={micOn ? <MicIcon size={32} /> : <MicOffIcon size={32} />}
        label={micOn ? 'Mute' : 'Unmute'} />
      

      <ControlButton
        active={cameraOn}
        onClick={() => setCameraOn(!cameraOn)}
        icon={cameraOn ? <VideoIcon size={32} /> : <VideoOffIcon size={32} />}
        label={cameraOn ? 'Stop Video' : 'Start Video'} />
      

      <div className="w-px h-16 bg-slate-700 mx-2 hidden sm:block" />

      <ControlButton
        active={handRaised}
        onClick={() => setHandRaised(!handRaised)}
        icon={<HandIcon size={32} />}
        label={handRaised ? 'Lower Hand' : 'Raise Hand'}
        accent={true} />
      

      <ControlButton
        active={chatOpen}
        onClick={() => setChatOpen(!chatOpen)}
        icon={<MessageCircleIcon size={32} />}
        label="Chat" />
      

      <div className="w-px h-16 bg-slate-700 mx-2 hidden sm:block" />

      <ControlButton
        active={true}
        onClick={handleLeave}
        icon={<PhoneOffIcon size={32} />}
        label="Leave"
        danger={true} />
      
    </div>);

}