import React, { useEffect, useState } from 'react';
import { MicOffIcon, HandIcon, UserIcon, XIcon, SendIcon } from 'lucide-react';
import { MeetingControlBar } from '../components/MeetingControlBar';
import { FloatingHelpButton } from '../components/FloatingHelpButton';
import { cn } from '../utils/cn';
export function MeetingRoom() {
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [duration, setDuration] = useState(1453); // Mock starting duration in seconds
  useEffect(() => {
    const timer = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(timer);
  }, []);
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = seconds % 60;
    if (h > 0)
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };
  const participants = [
  {
    id: 1,
    name: 'Pastor John',
    role: 'Host',
    color: 'bg-blue-600',
    isSpeaking: true,
    micOn: true,
    cameraOn: true
  },
  {
    id: 2,
    name: 'Mary Smith',
    role: 'Guest',
    color: 'bg-purple-600',
    isSpeaking: false,
    micOn: false,
    cameraOn: true
  },
  {
    id: 3,
    name: 'David M.',
    role: 'Guest',
    color: 'bg-green-600',
    isSpeaking: false,
    micOn: false,
    cameraOn: false
  },
  {
    id: 4,
    name: 'Sarah (You)',
    role: 'Guest',
    color: 'bg-amber-600',
    isSpeaking: false,
    micOn: micOn,
    cameraOn: cameraOn,
    handRaised: handRaised
  }];

  return (
    <div className="flex-grow flex flex-col bg-slate-950 text-white h-[calc(100vh-80px)] sm:h-[calc(100vh-96px)] overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold truncate max-w-[200px] sm:max-w-md">
            Sunday Service with Pastor John
          </h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-slate-300">Excellent Connection</span>
          </div>
        </div>
        <div className="text-lg font-mono bg-slate-800 px-4 py-1 rounded-lg">
          {formatTime(duration)}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow flex overflow-hidden relative">
        {/* Video Area */}
        <div
          className={cn(
            'flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-y-auto lg:overflow-hidden transition-all',
            chatOpen ? 'lg:mr-[320px]' : ''
          )}>
          
          {/* Active Speaker (Large) */}
          <div className="flex-grow bg-slate-900 rounded-3xl border-4 border-primary relative overflow-hidden min-h-[300px] lg:min-h-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center text-5xl font-bold">
              PJ
            </div>
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-4 py-2 rounded-xl flex items-center gap-3">
              <span className="text-xl font-bold">Pastor John</span>
              <span className="bg-primary text-xs px-2 py-1 rounded text-white font-bold uppercase tracking-wider">
                Host
              </span>
            </div>
          </div>

          {/* Participant Strip */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-64 flex-shrink-0 pb-2 lg:pb-0">
            {participants.slice(1).map((p) =>
            <div
              key={p.id}
              className="w-48 lg:w-full h-32 lg:h-48 bg-slate-900 rounded-2xl relative overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-800">
              
                {p.cameraOn ?
              <div
                className={cn(
                  'w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold',
                  p.color
                )}>
                
                    {p.name.
                split(' ').
                map((n) => n[0]).
                join('').
                substring(0, 2)}
                  </div> :

              <UserIcon size={48} className="text-slate-600" />
              }

                <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end">
                  <div className="bg-black/60 backdrop-blur px-2 py-1 rounded-lg text-sm font-medium truncate max-w-[120px]">
                    {p.name}
                  </div>
                  <div className="flex gap-1">
                    {!p.micOn &&
                  <div className="bg-red-500 p-1 rounded-md">
                        <MicOffIcon size={14} className="text-white" />
                      </div>
                  }
                    {p.handRaised &&
                  <div className="bg-accent p-1 rounded-md">
                        <HandIcon size={14} className="text-white" />
                      </div>
                  }
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        {chatOpen &&
        <div className="absolute lg:static right-0 top-0 bottom-0 w-full sm:w-[320px] bg-white text-ink-primary flex flex-col border-l border-border z-20 shadow-2xl lg:shadow-none">
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold">Meeting Chat</h2>
              <button
              onClick={() => setChatOpen(false)}
              className="p-2 hover:bg-slate-200 rounded-lg">
              
                <XIcon size={24} />
              </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
              <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-none self-start max-w-[85%]">
                <div className="text-sm font-bold text-ink-secondary mb-1">
                  Pastor John
                </div>
                <div className="text-lg">
                  Welcome everyone! We will begin shortly.
                </div>
              </div>
              <div className="bg-primary/10 p-3 rounded-2xl rounded-tr-none self-end max-w-[85%]">
                <div className="text-sm font-bold text-primary mb-1">You</div>
                <div className="text-lg">Hello! Glad to be here.</div>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-slate-50">
              <div className="flex gap-2">
                <input
                type="text"
                placeholder="Type a message..."
                className="flex-grow h-12 px-4 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              
                <button className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark">
                  <SendIcon size={20} />
                </button>
              </div>
            </div>
          </div>
        }
      </div>

      <MeetingControlBar
        micOn={micOn}
        setMicOn={setMicOn}
        cameraOn={cameraOn}
        setCameraOn={setCameraOn}
        handRaised={handRaised}
        setHandRaised={setHandRaised}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen} />
      

      {!chatOpen && <FloatingHelpButton />}
    </div>);

}