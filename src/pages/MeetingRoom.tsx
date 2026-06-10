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
import {
  HandIcon, XIcon, SendIcon, HelpCircleIcon,
  MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, UserXIcon, CrownIcon,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MeetingControlBar } from '../components/MeetingControlBar';
import { VideoGrid } from '../components/meeting/VideoGrid';
import { ConnectionStatus } from '../components/meeting/ConnectionStatus';
import { cn } from '../utils/cn';
import { insforge } from '../lib/insforge';
import { useMeetingContext, Participant } from '../contexts/MeetingContext';

const LIVEKIT_URL = import.meta.env.VITE_LIVEKIT_URL as string;

// ── Participants panel — used by both Inner and Fallback ──
function HostParticipantsPanel({
  meetingCode,
  isHost,
  onClose,
}: {
  meetingCode: string;
  isHost: boolean;
  onClose: () => void;
}) {
  const { meeting, participants, publishEvent, refreshParticipants } = useMeetingContext();
  const participantId = sessionStorage.getItem('participantId') ?? '';

  const handleToggleMic = async (p: Participant) => {
    if (!isHost) return;
    const next = !p.is_muted;
    await insforge.database.from('participants').update({ is_muted: next }).eq('id', p.id);
    await publishEvent(meetingCode, 'participant_muted', { participantId: p.id, isMuted: next });
  };

  const handleToggleCamera = async (p: Participant) => {
    if (!isHost) return;
    const next = !p.camera_off;
    await insforge.database.from('participants').update({ camera_off: next }).eq('id', p.id);
    await publishEvent(meetingCode, 'participant_camera_off', { participantId: p.id, cameraOff: next });
  };

  const handleLowerHand = async (p: Participant) => {
    if (!isHost) return;
    await insforge.database.from('participants').update({ hand_raised: false }).eq('id', p.id);
    await publishEvent(meetingCode, 'hand_lowered', { participantId: p.id });
  };

  const handleRemove = async (p: Participant) => {
    if (!isHost || !window.confirm(`Remove ${p.name} from the meeting?`)) return;
    await insforge.database.from('participants').update({ left_at: new Date().toISOString() }).eq('id', p.id);
    await publishEvent(meetingCode, 'participant_removed', { participantId: p.id });
    if (meeting) refreshParticipants(meeting.id);
  };

  const handleMuteAll = async () => {
    if (!isHost || !meeting) return;
    await insforge.database.from('participants').update({ is_muted: true }).eq('meeting_id', meeting.id).neq('role', 'host');
    await publishEvent(meetingCode, 'mute_all', {});
  };

  return (
    <div className="absolute lg:static right-0 top-0 bottom-0 w-full sm:w-[320px] bg-white text-ink-primary flex flex-col border-l border-border z-20 shadow-2xl lg:shadow-none">
      <div className="p-4 border-b border-border flex justify-between items-center bg-slate-50 flex-shrink-0">
        <h2 className="text-xl font-bold">Participants ({participants.length})</h2>
        <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg">
          <XIcon size={24} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto p-2">
        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl border-b border-border last:border-0"
          >
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={cn(
                'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                p.role === 'host' ? 'bg-primary text-white' : 'bg-primary/10 text-primary'
              )}>
                {p.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink-primary truncate flex items-center gap-1 flex-wrap">
                  {p.name}
                  {p.id === participantId && (
                    <span className="text-[10px] text-ink-secondary">(you)</span>
                  )}
                  {p.role === 'host' && (
                    <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded flex items-center gap-0.5">
                      <CrownIcon size={8} /> Host
                    </span>
                  )}
                  {p.role === 'presenter' && (
                    <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Presenter</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {p.is_muted && (
                    <span className="text-[10px] text-red-500 flex items-center gap-0.5">
                      <MicOffIcon size={8} /> Muted
                    </span>
                  )}
                  {p.camera_off && (
                    <span className="text-[10px] text-red-500 flex items-center gap-0.5">
                      <VideoOffIcon size={8} /> No cam
                    </span>
                  )}
                  {p.hand_raised && (
                    <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
                      <HandIcon size={8} /> Hand raised
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isHost && p.role !== 'host' && p.id !== participantId && (
              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                <button
                  onClick={() => handleToggleMic(p)}
                  className={cn('p-1.5 rounded-lg transition-colors', p.is_muted ? 'bg-red-100 text-red-600' : 'text-ink-secondary hover:bg-slate-200')}
                  title={p.is_muted ? 'Unmute' : 'Mute'}
                >
                  {p.is_muted ? <MicOffIcon size={15} /> : <MicIcon size={15} />}
                </button>
                <button
                  onClick={() => handleToggleCamera(p)}
                  className={cn('p-1.5 rounded-lg transition-colors', p.camera_off ? 'bg-red-100 text-red-600' : 'text-ink-secondary hover:bg-slate-200')}
                  title={p.camera_off ? 'Enable Camera' : 'Disable Camera'}
                >
                  {p.camera_off ? <VideoOffIcon size={15} /> : <VideoIcon size={15} />}
                </button>
                {p.hand_raised && (
                  <button
                    onClick={() => handleLowerHand(p)}
                    className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg"
                    title="Lower Hand"
                  >
                    <HandIcon size={15} />
                  </button>
                )}
                <button
                  onClick={() => handleRemove(p)}
                  className="p-1.5 text-danger hover:bg-red-50 rounded-lg"
                  title="Remove"
                >
                  <UserXIcon size={15} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isHost && (
        <div className="p-3 border-t border-border bg-slate-50 flex-shrink-0">
          <button
            onClick={handleMuteAll}
            className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-ink-primary text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <MicOffIcon size={16} />
            Mute All Participants
          </button>
        </div>
      )}
    </div>
  );
}

// ── Inner component — must live inside <LiveKitRoom> to use LiveKit hooks ──
function MeetingRoomInner({ meetingCode, isHost }: { meetingCode: string; isHost: boolean }) {
  const navigate = useNavigate();
  const { meeting, chatMessages, sendChat, publishEvent, loadMeeting, refreshParticipants } = useMeetingContext();

  const { toggle: toggleMic, enabled: micOn } = useTrackToggle({ source: Track.Source.Microphone });
  const { toggle: toggleCamera, enabled: cameraOn } = useTrackToggle({ source: Track.Source.Camera });
  const { toggle: toggleScreenShare, enabled: screenSharing } = useTrackToggle({ source: Track.Source.ScreenShare });
  const connectionState = useConnectionState();

  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [duration, setDuration] = useState(0);
  const [handToasts, setHandToasts] = useState<Array<{ toastId: string; name: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Refs to avoid stale closures in event listeners
  const micOnRef = useRef(micOn);
  const cameraOnRef = useRef(cameraOn);
  useEffect(() => { micOnRef.current = micOn; }, [micOn]);
  useEffect(() => { cameraOnRef.current = cameraOn; }, [cameraOn]);

  const participantId = sessionStorage.getItem('participantId') ?? '';
  const participantName = sessionStorage.getItem('participantName') ?? 'Guest';

  // Mutually exclusive sidebars
  const handleSetChatOpen = useCallback((val: boolean) => {
    setChatOpen(val);
    if (val) setParticipantsOpen(false);
  }, []);

  const handleSetParticipantsOpen = useCallback((val: boolean) => {
    setParticipantsOpen(val);
    if (val) setChatOpen(false);
  }, []);

  useEffect(() => {
    loadMeeting(meetingCode);
    console.info('[EasyMeet] Joined meeting room', { meetingCode, isHost, participantName });
  }, [meetingCode, loadMeeting, isHost, participantName]);

  useEffect(() => {
    if (meeting) refreshParticipants(meeting.id);
  }, [meeting, refreshParticipants]);

  useEffect(() => {
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Hand-raise toasts for host
  useEffect(() => {
    if (!isHost) return;
    const onHandRaised = (payload: { participantId: string; name: string }) => {
      const toastId = crypto.randomUUID();
      setHandToasts(prev => [...prev, { toastId, name: payload.name ?? 'Someone' }]);
      setTimeout(() => {
        setHandToasts(prev => prev.filter(t => t.toastId !== toastId));
      }, 5000);
    };
    insforge.realtime.on('hand_raised', onHandRaised);
    return () => insforge.realtime.off('hand_raised', onHandRaised);
  }, [isHost]);

  // Host mutes local mic
  useEffect(() => {
    const onMuted = (payload: { participantId: string; isMuted: boolean }) => {
      if (payload.participantId !== participantId) return;
      if (payload.isMuted && micOnRef.current) toggleMic();
      else if (!payload.isMuted && !micOnRef.current) toggleMic();
    };
    insforge.realtime.on('participant_muted', onMuted);
    return () => insforge.realtime.off('participant_muted', onMuted);
  }, [participantId, toggleMic]);

  // Host turns off local camera
  useEffect(() => {
    const onCameraOff = (payload: { participantId: string; cameraOff: boolean }) => {
      if (payload.participantId !== participantId) return;
      if (payload.cameraOff && cameraOnRef.current) toggleCamera();
      else if (!payload.cameraOff && !cameraOnRef.current) toggleCamera();
    };
    insforge.realtime.on('participant_camera_off', onCameraOff);
    return () => insforge.realtime.off('participant_camera_off', onCameraOff);
  }, [participantId, toggleCamera]);

  // Mute all
  useEffect(() => {
    if (isHost) return;
    const onMuteAll = () => {
      if (micOnRef.current) toggleMic();
    };
    insforge.realtime.on('mute_all', onMuteAll);
    return () => insforge.realtime.off('mute_all', onMuteAll);
  }, [isHost, toggleMic]);

  // Meeting ended / removed
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

  // Attendance
  useEffect(() => {
    const handleLeave = () => {
      if (participantId) {
        insforge.database.from('participants').update({ left_at: new Date().toISOString() }).eq('id', participantId).then(() => {});
      }
    };
    window.addEventListener('beforeunload', handleLeave);
    return () => window.removeEventListener('beforeunload', handleLeave);
  }, [participantId]);

  const handleLeaveRoom = useCallback(async () => {
    if (participantId) {
      await insforge.database.from('participants').update({ left_at: new Date().toISOString() }).eq('id', participantId);
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
  const sidebarOpen = chatOpen || participantsOpen;

  return (
    <div className="flex-grow flex flex-col bg-slate-950 text-white overflow-hidden" style={{ height: 'calc(100dvh - 80px)' }}>
      {isReconnecting && (
        <div className="absolute inset-x-0 top-0 bg-amber-600 text-white text-center text-sm font-semibold py-2 z-50">
          Connection lost — attempting to reconnect…
        </div>
      )}

      {/* Hand-raise toasts for host */}
      {isHost && handToasts.length > 0 && (
        <div className="absolute top-20 right-4 flex flex-col gap-2 z-40 pointer-events-none">
          {handToasts.map(toast => (
            <div
              key={toast.toastId}
              className="bg-amber-500 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold"
            >
              <HandIcon size={16} className="flex-shrink-0" />
              <span>{toast.name} raised their hand</span>
            </div>
          ))}
        </div>
      )}

      {/* Top Bar */}
      <div className="flex justify-between items-center px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-lg font-bold truncate max-w-[140px] sm:max-w-xs">
            {meeting?.title ?? 'Meeting'}
          </h1>
          {isHost && (
            <div className="hidden sm:flex items-center gap-1.5 bg-primary/20 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
              <CrownIcon size={12} /> Host
            </div>
          )}
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

      {/* Main Content */}
      <div className="flex-grow flex overflow-hidden relative">
        <VideoGrid sidebarOpen={sidebarOpen} />

        {/* Chat Sidebar */}
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

        {/* Participants Sidebar */}
        {participantsOpen && (
          <HostParticipantsPanel
            meetingCode={meetingCode}
            isHost={isHost}
            onClose={() => setParticipantsOpen(false)}
          />
        )}
      </div>

      <StartAudio
        label="🔊 Click to enable audio"
        className="absolute inset-x-4 bottom-28 mx-auto max-w-sm bg-primary text-white text-center py-4 px-6 rounded-2xl text-lg font-bold shadow-2xl z-50 cursor-pointer hover:bg-primary-dark transition-colors"
      />

      <MeetingControlBar
        micOn={micOn}
        setMicOn={() => toggleMic()}
        cameraOn={cameraOn}
        setCameraOn={() => toggleCamera()}
        screenSharing={screenSharing}
        setScreenSharing={() => toggleScreenShare()}
        handRaised={handRaised}
        setHandRaised={() => handleRaiseHand()}
        chatOpen={chatOpen}
        setChatOpen={handleSetChatOpen}
        participantsOpen={participantsOpen}
        setParticipantsOpen={handleSetParticipantsOpen}
        isHost={isHost}
        onLeave={handleLeaveRoom}
      />
    </div>
  );
}

// ── Fallback when LiveKit is not configured ──
function MeetingRoomFallback({ meetingCode, isHost }: { meetingCode: string; isHost: boolean }) {
  const navigate = useNavigate();
  const { meeting, chatMessages, sendChat, publishEvent, loadMeeting, refreshParticipants } = useMeetingContext();
  const [micOn, setMicOn] = useState(false);
  const [handRaised, setHandRaised] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [duration, setDuration] = useState(0);
  const [handToasts, setHandToasts] = useState<Array<{ toastId: string; name: string }>>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const participantId = sessionStorage.getItem('participantId') ?? '';
  const participantName = sessionStorage.getItem('participantName') ?? 'Guest';

  const handleSetChatOpen = useCallback((val: boolean) => {
    setChatOpen(val);
    if (val) setParticipantsOpen(false);
  }, []);

  const handleSetParticipantsOpen = useCallback((val: boolean) => {
    setParticipantsOpen(val);
    if (val) setChatOpen(false);
  }, []);

  useEffect(() => { loadMeeting(meetingCode); }, [meetingCode, loadMeeting]);
  useEffect(() => { if (meeting) refreshParticipants(meeting.id); }, [meeting, refreshParticipants]);
  useEffect(() => { const t = setInterval(() => setDuration(d => d + 1), 1000); return () => clearInterval(t); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  // Hand-raise toasts for host
  useEffect(() => {
    if (!isHost) return;
    const onHandRaised = (payload: { participantId: string; name: string }) => {
      const toastId = crypto.randomUUID();
      setHandToasts(prev => [...prev, { toastId, name: payload.name ?? 'Someone' }]);
      setTimeout(() => setHandToasts(prev => prev.filter(t => t.toastId !== toastId)), 5000);
    };
    insforge.realtime.on('hand_raised', onHandRaised);
    return () => insforge.realtime.off('hand_raised', onHandRaised);
  }, [isHost]);

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
      {/* Hand-raise toasts for host */}
      {isHost && handToasts.length > 0 && (
        <div className="absolute top-20 right-4 flex flex-col gap-2 z-40 pointer-events-none">
          {handToasts.map(toast => (
            <div key={toast.toastId} className="bg-amber-500 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-semibold">
              <HandIcon size={16} className="flex-shrink-0" />
              <span>{toast.name} raised their hand</span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center px-4 py-3 bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-lg font-bold truncate max-w-[140px] sm:max-w-xs">{meeting?.title ?? 'Meeting'}</h1>
          {isHost && (
            <div className="hidden sm:flex items-center gap-1.5 bg-primary/20 text-primary px-2.5 py-1 rounded-full text-xs font-bold">
              <CrownIcon size={12} /> Host
            </div>
          )}
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
        <div className={cn('flex-grow flex items-center justify-center p-6', (chatOpen || participantsOpen) ? 'lg:mr-[320px]' : '')}>
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

        {participantsOpen && (
          <HostParticipantsPanel
            meetingCode={meetingCode}
            isHost={isHost}
            onClose={() => setParticipantsOpen(false)}
          />
        )}
      </div>

      <MeetingControlBar
        micOn={micOn}
        setMicOn={setMicOn}
        cameraOn={false}
        setCameraOn={() => {}}
        screenSharing={false}
        setScreenSharing={() => {}}
        handRaised={handRaised}
        setHandRaised={() => handleRaiseHand()}
        chatOpen={chatOpen}
        setChatOpen={handleSetChatOpen}
        participantsOpen={participantsOpen}
        setParticipantsOpen={handleSetParticipantsOpen}
        isHost={isHost}
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
        audio={true}
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

  return <MeetingRoomFallback meetingCode={meetingCode} isHost={isHost} />;
}
