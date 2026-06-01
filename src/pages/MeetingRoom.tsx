import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  useTrackToggle,
  useConnectionState,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { Track, ConnectionState } from 'livekit-client';
import { HandIcon, XIcon, SendIcon, HelpCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MeetingControlBar } from '../components/MeetingControlBar';
import { VideoGrid } from '../components/meeting/VideoGrid';
import { ConnectionStatus } from '../components/meeting/ConnectionStatus';
import { cn } from '../utils/cn';
import { insforge } from '../lib/insforge';
import { useMeetingContext } from '../contexts/MeetingContext';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string;

// ── Inner component — must live inside <LiveKitRoom> to use LiveKit hooks ──
function MeetingRoomInner({ meetingCode, isHost }: { meetingCode: string; isHost: boolean }) {
  const navigate = useNavigate();
  const { meeting, chatMessages, sendChat, publishEvent, loadMeeting, refreshParticipants } = useMeetingContext();

  // Real LiveKit track toggles — these actually mute/unmute the tracks
  const { toggle: toggleMic, enabled: micOn } = useTrackToggle({ source: Track.Source.Microphone });
  const { toggle: toggleCam, enabled: cameraOn } = useTrackToggle({ source: Track.Source.Camera });
  const connectionState = useConnectionState();

  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [duration, setDuration] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const participantId = sessionStorage.getItem('participantId') ?? '';
  const participantName = sessionStorage.getItem('participantName') ?? 'Guest';

  // ── Load meeting data ──
  useEffect(() => {
    loadMeeting(meetingCode);
    console.info('[EasyMeet] Joined meeting room', { meetingCode, isHost, participantName });
  }, [meetingCode, loadMeeting, isHost, participantName]);

  useEffect(() => {
    if (meeting) refreshParticipants(meeting.id);
  }, [meeting, refreshParticipants]);

  // ── Timer ──
  useEffect(() => {
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // ── Log track state changes ──
  useEffect(() => {
    console.info('[EasyMeet] Mic track', micOn ? 'enabled' : 'muted');
  }, [micOn]);

  useEffect(() => {
    console.info('[EasyMeet] Camera track', cameraOn ? 'enabled' : 'off');
  }, [cameraOn]);

  useEffect(() => {
    console.info('[EasyMeet] Connection state:', connectionState);
  }, [connectionState]);

  // ── Attendance: record leave time on page unload ──
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

  // ── Auto-scroll chat ──
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // ── Listen for meeting_ended / being removed ──
  useEffect(() => {
    const onEnded = () => {
      console.info('[EasyMeet] Meeting ended by host');
      handleLeaveRoom();
    };
    insforge.realtime.on('meeting_ended', onEnded);
    return () => insforge.realtime.off('meeting_ended', onEnded);
  });

  useEffect(() => {
    const onRemoved = (payload: { participantId: string }) => {
      if (payload.participantId === participantId) {
        console.info('[EasyMeet] Removed from meeting by host');
        handleLeaveRoom();
      }
    };
    insforge.realtime.on('participant_removed', onRemoved);
    return () => insforge.realtime.off('participant_removed', onRemoved);
  }, [participantId]);

  // ── Listen for host muting this participant ──
  useEffect(() => {
    const onMuted = (payload: { participantId: string; isMuted: boolean }) => {
      if (payload.participantId === participantId && payload.isMuted && micOn) {
        toggleMic();
        console.info('[EasyMeet] Muted by host');
      }
    };
    insforge.realtime.on('participant_muted', onMuted);
    return () => insforge.realtime.off('participant_muted', onMuted);
  }, [participantId, micOn, toggleMic]);

  const handleLeaveRoom = useCallback(async () => {
    if (participantId) {
      await insforge.database
        .from('participants')
        .update({ left_at: new Date().toISOString() })
        .eq('id', participantId);
    }
    console.info('[EasyMeet] Left meeting', { meetingCode });
    navigate('/');
  }, [participantId, navigate, meetingCode]);

  const handleRaiseHand = useCallback(async () => {
    const next = !handRaised;
    setHandRaised(next);
    await publishEvent(meetingCode, next ? 'hand_raised' : 'hand_lowered', { participantId, name: participantName });
    if (participantId) {
      await insforge.database.from('participants').update({ hand_raised: next }).eq('id', participantId);
    }
    console.info('[EasyMeet] Hand', next ? 'raised' : 'lowered');
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

  const isReconnecting = connectionState === ConnectionState.Reconnecting;

  return (
    <div className="flex-grow flex flex-col bg-slate-950 text-white overflow-hidden" style={{ height: 'calc(100dvh - 80px)' }}>
      {/* Reconnecting banner */}
      {isReconnecting && (
        <div className="absolute inset-x-0 top-0 bg-amber-600 text-white text-center text-sm font-semibold py-2 z-50">
          Connection lost — attempting to reconnect…
        </div>
      )}

      {/* ── Top Bar ── */}
      <div className="flex justify-between items-center px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-lg font-bold truncate max-w-[140px] sm:max-w-xs">
            {meeting?.title ?? 'Meeting'}
          </h1>
          <ConnectionStatus />
        </div>

        <div className="flex items-center gap-3">
          {handRaised && (
            <div className="flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold">
              <HandIcon size={14} />
              Hand raised
            </div>
          )}
          <div className="text-base font-mono bg-slate-800 px-3 py-1 rounded-lg tabular-nums">
            {formatTime(duration)}
          </div>
          <Link to="/help" className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors">
            <HelpCircleIcon size={16} />
            Help
          </Link>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex-grow flex overflow-hidden relative">
        {/* Video grid */}
        <VideoGrid isHost={isHost} chatOpen={chatOpen} />

        {/* ── Chat Sidebar ── */}
        {chatOpen && (
          <div className="absolute lg:static right-0 top-0 bottom-0 w-full sm:w-[320px] bg-white text-ink-primary flex flex-col border-l border-border z-20 shadow-2xl lg:shadow-none">
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50 flex-shrink-0">
              <h2 className="text-xl font-bold">Meeting Chat</h2>
              <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg">
                <XIcon size={24} />
              </button>
            </div>

            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 min-h-0">
              {chatMessages.length === 0 && (
                <p className="text-ink-secondary text-center text-sm mt-4">No messages yet — say hello!</p>
              )}
              {chatMessages.map((msg) => {
                const isMe = msg.participant_id === participantId;
                return (
                  <div
                    key={msg.id}
                    className={cn('p-3 rounded-2xl max-w-[85%] text-sm', isMe
                      ? 'bg-primary/10 self-end rounded-tr-none'
                      : 'bg-slate-100 self-start rounded-tl-none'
                    )}>
                    <div className={cn('text-xs font-bold mb-1', isMe ? 'text-primary' : 'text-ink-secondary')}>
                      {isMe ? 'You' : msg.sender_name}
                    </div>
                    <div>{msg.message}</div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-border bg-slate-50 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                  className="flex-grow h-11 px-3 rounded-xl border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
                />
                <button
                  onClick={handleSendChat}
                  disabled={!chatInput.trim()}
                  className="w-11 h-11 bg-primary disabled:opacity-40 text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-colors">
                  <SendIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Autoplay unblock — shown by browsers that block audio until user interaction */}
      <StartAudio
        label="🔊 Click to enable audio"
        className="absolute inset-x-4 bottom-28 mx-auto max-w-sm bg-primary text-white text-center py-4 px-6 rounded-2xl text-lg font-bold shadow-2xl z-50 cursor-pointer hover:bg-primary-dark transition-colors"
      />

      {/* ── Control Bar ── */}
      <MeetingControlBar
        micOn={micOn}
        setMicOn={() => toggleMic()}
        cameraOn={cameraOn}
        setCameraOn={() => toggleCam()}
        handRaised={handRaised}
        setHandRaised={() => handleRaiseHand()}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        onLeave={handleLeaveRoom}
      />
    </div>
  );
}

// ── Fallback when LiveKit is not configured ──
function MeetingRoomFallback({ meetingCode }: { meetingCode: string }) {
  const navigate = useNavigate();
  const { meeting, chatMessages, sendChat, publishEvent, loadMeeting, refreshParticipants } = useMeetingContext();
  const [micOn, setMicOn] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [duration, setDuration] = useState(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const participantId = sessionStorage.getItem('participantId') ?? '';
  const participantName = sessionStorage.getItem('participantName') ?? 'Guest';

  useEffect(() => { loadMeeting(meetingCode); }, [meetingCode, loadMeeting]);
  useEffect(() => { if (meeting) refreshParticipants(meeting.id); }, [meeting, refreshParticipants]);
  useEffect(() => { const t = setInterval(() => setDuration(d => d + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleLeaveRoom = useCallback(async () => {
    if (participantId) {
      await insforge.database.from('participants').update({ left_at: new Date().toISOString() }).eq('id', participantId);
    }
    navigate('/');
  }, [participantId, navigate]);

  const handleRaiseHand = useCallback(async () => {
    const next = !handRaised;
    setHandRaised(next);
    await publishEvent(meetingCode, next ? 'hand_raised' : 'hand_lowered', { participantId, name: participantName });
    if (participantId) await insforge.database.from('participants').update({ hand_raised: next }).eq('id', participantId);
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

  return (
    <div className="flex-grow flex flex-col bg-slate-950 text-white overflow-hidden" style={{ height: 'calc(100dvh - 80px)' }}>
      <div className="flex justify-between items-center px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-lg font-bold truncate max-w-[140px] sm:max-w-xs">{meeting?.title ?? 'Meeting'}</h1>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-sm text-slate-300">Audio only</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {handRaised && (
            <div className="flex items-center gap-1.5 bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-semibold">
              <HandIcon size={14} /> Hand raised
            </div>
          )}
          <div className="text-base font-mono bg-slate-800 px-3 py-1 rounded-lg tabular-nums">{formatTime(duration)}</div>
          <Link to="/help" className="hidden sm:flex items-center gap-1 text-slate-400 hover:text-white text-sm">
            <HelpCircleIcon size={16} /> Help
          </Link>
        </div>
      </div>

      <div className="flex-grow flex overflow-hidden relative">
        <div className={cn('flex-grow flex items-center justify-center p-6', chatOpen ? 'lg:mr-[320px]' : '')}>
          <div className="text-center">
            <div className="w-28 h-28 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-5xl font-bold">{participantName.charAt(0).toUpperCase()}</span>
            </div>
            <p className="text-slate-300 text-lg font-medium mb-2">{participantName}</p>
            <p className="text-slate-500 text-sm">
              Video requires LiveKit configuration.{' '}
              <span className="text-primary">Chat and controls are fully functional.</span>
            </p>
            {handRaised && (
              <div className="mt-4 inline-flex items-center gap-2 bg-accent/20 text-accent px-4 py-2 rounded-full text-sm font-semibold">
                <HandIcon size={16} /> Your hand is raised
              </div>
            )}
          </div>
        </div>

        {chatOpen && (
          <div className="absolute lg:static right-0 top-0 bottom-0 w-full sm:w-[320px] bg-white text-ink-primary flex flex-col border-l border-border z-20 shadow-2xl lg:shadow-none">
            <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50 flex-shrink-0">
              <h2 className="text-xl font-bold">Meeting Chat</h2>
              <button onClick={() => setChatOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg"><XIcon size={24} /></button>
            </div>
            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3 min-h-0">
              {chatMessages.length === 0 && <p className="text-ink-secondary text-center text-sm mt-4">No messages yet — say hello!</p>}
              {chatMessages.map((msg) => {
                const isMe = msg.participant_id === participantId;
                return (
                  <div key={msg.id} className={cn('p-3 rounded-2xl max-w-[85%] text-sm', isMe ? 'bg-primary/10 self-end rounded-tr-none' : 'bg-slate-100 self-start rounded-tl-none')}>
                    <div className={cn('text-xs font-bold mb-1', isMe ? 'text-primary' : 'text-ink-secondary')}>{isMe ? 'You' : msg.sender_name}</div>
                    <div>{msg.message}</div>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <div className="p-3 border-t border-border bg-slate-50 flex-shrink-0">
              <div className="flex gap-2">
                <input type="text" placeholder="Type a message…" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendChat()} className="flex-grow h-11 px-3 rounded-xl border border-border focus:outline-none focus:border-primary text-sm" />
                <button onClick={handleSendChat} disabled={!chatInput.trim()} className="w-11 h-11 bg-primary disabled:opacity-40 text-white rounded-xl flex items-center justify-center">
                  <SendIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <MeetingControlBar
        micOn={micOn} setMicOn={setMicOn}
        cameraOn={cameraOn} setCameraOn={setCameraOn}
        handRaised={handRaised} setHandRaised={() => handleRaiseHand()}
        chatOpen={chatOpen} setChatOpen={setChatOpen}
        onLeave={handleLeaveRoom}
      />
    </div>
  );
}

// ── Root export — decides whether to wrap in LiveKitRoom ──
export function MeetingRoom() {
  const { meetingCode } = useParams<{ meetingCode: string }>();
  const navigate = useNavigate();

  const livekitToken = sessionStorage.getItem('livekitToken') ?? '';
  const participantId = sessionStorage.getItem('participantId');
  const isHost = sessionStorage.getItem('isHost') === 'true';

  useEffect(() => {
    if (!participantId || !meetingCode) {
      navigate(`/join/${meetingCode ?? ''}`);
    }
  }, [participantId, meetingCode, navigate]);

  if (!meetingCode) return null;

  const hasLivekit =
    !!LIVEKIT_URL &&
    !LIVEKIT_URL.includes('your-project') &&
    !!livekitToken;

  if (hasLivekit) {
    return (
      <LiveKitRoom
        serverUrl={LIVEKIT_URL}
        token={livekitToken}
        connect={true}
        audio={isHost}
        video={isHost}
        options={{
          adaptiveStream: true,
          dynacast: true,
          publishDefaults: { simulcast: true },
        }}
        onError={(err) => console.error('[LiveKit] Room error:', err)}
        style={{ display: 'contents' }}
      >
        <MeetingRoomInner meetingCode={meetingCode} isHost={isHost} />
        <RoomAudioRenderer />
      </LiveKitRoom>
    );
  }

  return <MeetingRoomFallback meetingCode={meetingCode} />;
}
