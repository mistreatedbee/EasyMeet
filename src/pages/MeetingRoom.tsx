import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { HandIcon, XIcon, SendIcon } from 'lucide-react';
import { MeetingControlBar } from '../components/MeetingControlBar';
import { FloatingHelpButton } from '../components/FloatingHelpButton';
import { cn } from '../utils/cn';
import { insforge } from '../lib/insforge';
import { useMeetingContext } from '../contexts/MeetingContext';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string;

// Inner component — must be inside <LiveKitRoom>
function MeetingRoomInner({ meetingCode }: { meetingCode: string }) {
  const navigate = useNavigate();
  const { meeting, chatMessages, sendChat, publishEvent, loadMeeting, refreshParticipants } = useMeetingContext();

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [duration, setDuration] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const participantId = sessionStorage.getItem('participantId') ?? '';
  const participantName = sessionStorage.getItem('participantName') ?? 'Guest';

  useEffect(() => {
    loadMeeting(meetingCode);
  }, [meetingCode, loadMeeting]);

  useEffect(() => {
    if (meeting) refreshParticipants(meeting.id);
  }, [meeting, refreshParticipants]);

  // Timer
  useEffect(() => {
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Mark left_at on unload
  useEffect(() => {
    const handleLeave = () => {
      if (participantId) {
        insforge.database
          .from('participants')
          .update({ left_at: new Date().toISOString() })
          .eq('id', participantId)
          .then(() => {});
      }
    };
    window.addEventListener('beforeunload', handleLeave);
    return () => window.removeEventListener('beforeunload', handleLeave);
  }, [participantId]);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Listen for meeting_ended
  useEffect(() => {
    const handler = () => {
      handleLeaveRoom();
    };
    insforge.realtime.on('meeting_ended', handler);
    return () => insforge.realtime.off('meeting_ended', handler);
  }, []);

  // Listen for being removed
  useEffect(() => {
    const handler = (payload: { participantId: string }) => {
      if (payload.participantId === participantId) handleLeaveRoom();
    };
    insforge.realtime.on('participant_removed', handler);
    return () => insforge.realtime.off('participant_removed', handler);
  }, [participantId]);

  const handleLeaveRoom = useCallback(async () => {
    if (participantId) {
      await insforge.database
        .from('participants')
        .update({ left_at: new Date().toISOString() })
        .eq('id', participantId);
    }
    navigate('/');
  }, [participantId, navigate]);

  const handleRaiseHand = useCallback(async () => {
    const next = !handRaised;
    setHandRaised(next);
    await publishEvent(meetingCode, next ? 'hand_raised' : 'hand_lowered', { participantId, name: participantName });
    if (participantId) {
      await insforge.database.from('participants').update({ hand_raised: next }).eq('id', participantId);
    }
  }, [handRaised, meetingCode, participantId, participantName, publishEvent]);

  const handleSendChat = useCallback(async () => {
    if (!chatInput.trim()) return;
    await sendChat(meetingCode, chatInput.trim());
    setChatInput('');
  }, [chatInput, meetingCode, sendChat]);

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const livekitToken = sessionStorage.getItem('livekitToken');
  const hasLivekit = LIVEKIT_URL && livekitToken && !LIVEKIT_URL.includes('your-project');

  return (
    <div className="flex-grow flex flex-col bg-slate-950 text-white h-[calc(100vh-80px)] sm:h-[calc(100vh-96px)] overflow-hidden">
      {/* Top Bar */}
      <div className="flex justify-between items-center p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold truncate max-w-[200px] sm:max-w-md">
            {meeting?.title ?? 'Meeting'}
          </h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm text-slate-300">Connected</span>
          </div>
        </div>
        <div className="text-lg font-mono bg-slate-800 px-4 py-1 rounded-lg">
          {formatTime(duration)}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden relative">
        {hasLivekit ? (
          /* LiveKit video grid when configured */
          <div className={cn('flex-grow overflow-hidden', chatOpen ? 'lg:mr-[320px]' : '')}>
            <VideoConference />
            <RoomAudioRenderer />
          </div>
        ) : (
          /* Fallback UI when LiveKit not yet configured */
          <div className={cn(
            'flex-grow flex flex-col lg:flex-row p-4 gap-4 overflow-y-auto lg:overflow-hidden transition-all',
            chatOpen ? 'lg:mr-[320px]' : ''
          )}>
            <div className="flex-grow bg-slate-900 rounded-3xl border-4 border-primary relative overflow-hidden min-h-[300px] lg:min-h-0 flex flex-col items-center justify-center gap-4">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary text-5xl font-bold">
                  {participantName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-center px-6">
                <p className="text-slate-300 text-lg font-medium">{participantName}</p>
                <p className="text-slate-500 text-sm mt-2">
                  Video is not available yet — configure LiveKit credentials to enable it.
                </p>
              </div>
              {handRaised && (
                <div className="absolute top-4 right-4 bg-accent px-3 py-1 rounded-full flex items-center gap-2">
                  <HandIcon size={16} />
                  <span className="text-sm font-bold">Hand Raised</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Sidebar */}
        {chatOpen && (
          <div className="absolute lg:static right-0 top-0 bottom-0 w-full sm:w-[320px] bg-white text-ink-primary flex flex-col border-l border-border z-20 shadow-2xl lg:shadow-none">
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold">Meeting Chat</h2>
              <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg">
                <XIcon size={24} />
              </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4">
              {chatMessages.length === 0 && (
                <p className="text-ink-secondary text-center text-base mt-4">No messages yet. Say hello!</p>
              )}
              {chatMessages.map((msg) => {
                const isMe = msg.participant_id === participantId;
                return (
                  <div key={msg.id} className={cn('p-3 rounded-2xl max-w-[85%]', isMe ? 'bg-primary/10 self-end rounded-tr-none' : 'bg-slate-100 self-start rounded-tl-none')}>
                    <div className={cn('text-sm font-bold mb-1', isMe ? 'text-primary' : 'text-ink-secondary')}>
                      {isMe ? 'You' : msg.sender_name}
                    </div>
                    <div className="text-lg">{msg.message}</div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="p-4 border-t border-border bg-slate-50">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                  className="flex-grow h-12 px-4 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={handleSendChat}
                  className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark">
                  <SendIcon size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <MeetingControlBar
        micOn={micOn}
        setMicOn={setMicOn}
        cameraOn={cameraOn}
        setCameraOn={setCameraOn}
        handRaised={handRaised}
        setHandRaised={() => handleRaiseHand()}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        onLeave={handleLeaveRoom}
      />

      {!chatOpen && <FloatingHelpButton />}
    </div>
  );
}

export function MeetingRoom() {
  const { meetingCode } = useParams<{ meetingCode: string }>();
  const navigate = useNavigate();
  const livekitToken = sessionStorage.getItem('livekitToken');
  const participantId = sessionStorage.getItem('participantId');

  useEffect(() => {
    if (!participantId || !meetingCode) {
      navigate(`/join/${meetingCode ?? ''}`);
    }
  }, [participantId, meetingCode, navigate]);

  const LIVEKIT_URL_VALUE = import.meta.env.VITE_LIVEKIT_URL as string;
  const hasLivekit = LIVEKIT_URL_VALUE && livekitToken && !LIVEKIT_URL_VALUE.includes('your-project');

  if (!meetingCode) return null;

  if (hasLivekit) {
    return (
      <LiveKitRoom
        serverUrl={LIVEKIT_URL_VALUE}
        token={livekitToken!}
        connect={true}
        video={true}
        audio={true}
        style={{ height: '100%', flex: 1 }}
      >
        <MeetingRoomInner meetingCode={meetingCode} />
      </LiveKitRoom>
    );
  }

  return <MeetingRoomInner meetingCode={meetingCode} />;
}
