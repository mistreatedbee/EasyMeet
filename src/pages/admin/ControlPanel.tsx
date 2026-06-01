import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MicIcon, MicOffIcon, VideoIcon, VideoOffIcon,
  UserXIcon, MonitorUpIcon, LockIcon, UnlockIcon,
  MessageSquareOffIcon, PhoneOffIcon, HandIcon,
  CheckCircleIcon, RefreshCwIcon,
} from 'lucide-react';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { cn } from '../../utils/cn';
import { insforge } from '../../lib/insforge';
import { getLivekitToken } from '../../lib/livekit';
import { useAuth } from '../../contexts/AuthContext';

interface Participant {
  id: string;
  name: string;
  role: 'host' | 'student' | 'presenter';
  is_muted: boolean;
  camera_off: boolean;
  hand_raised: boolean;
  admitted: boolean;
  joined_at: string;
  left_at: string | null;
}

interface MeetingData {
  id: string;
  title: string;
  meeting_code: string;
  status: 'waiting' | 'active' | 'ended';
  is_locked: boolean;
  chat_enabled: boolean;
}

export function ControlPanel() {
  const { meetingCode } = useParams<{ meetingCode: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [meeting, setMeeting] = useState<MeetingData | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [waitingParticipants, setWaitingParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [hostToken, setHostToken] = useState('');

  const loadData = useCallback(async (code: string) => {
    const { data: mtg } = await insforge.database
      .from('meetings')
      .select('*')
      .eq('meeting_code', code)
      .single();

    if (!mtg) return;
    setMeeting(mtg as MeetingData);

    const { data: parts } = await insforge.database
      .from('participants')
      .select('*')
      .eq('meeting_id', mtg.id)
      .is('left_at', null)
      .order('joined_at', { ascending: true });

    if (parts) {
      const admitted = (parts as Participant[]).filter((p) => p.admitted);
      const waiting = (parts as Participant[]).filter((p) => !p.admitted);
      setParticipants(admitted);
      setWaitingParticipants(waiting);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!meetingCode) return;
    loadData(meetingCode);

    const channel = `meeting:${meetingCode}`;
    (async () => {
      await insforge.realtime.connect();
      await insforge.realtime.subscribe(channel);
    })();

    return () => { insforge.realtime.unsubscribe(channel); };
  }, [meetingCode, loadData]);

  // Get host LiveKit token to join the meeting
  useEffect(() => {
    if (!meetingCode) return;
    getLivekitToken(meetingCode, user?.profile?.name ?? user?.email ?? 'Host', true)
      .then(setHostToken)
      .catch(() => {});
  }, [meetingCode, user]);

  const publish = useCallback(async (event: string, payload: Record<string, unknown>) => {
    if (!meetingCode) return;
    await insforge.realtime.publish(`meeting:${meetingCode}`, event, payload);
  }, [meetingCode]);

  const publishWaiting = useCallback(async (event: string, payload: Record<string, unknown>) => {
    if (!meetingCode) return;
    await insforge.realtime.publish(`waiting:${meetingCode}`, event, payload);
  }, [meetingCode]);

  const admitParticipant = async (p: Participant) => {
    await insforge.database.from('participants').update({ admitted: true }).eq('id', p.id);
    await publishWaiting('participant_admitted', { participantId: p.id });
    setWaitingParticipants((prev) => prev.filter((x) => x.id !== p.id));
    setParticipants((prev) => [...prev, { ...p, admitted: true }]);
  };

  const rejectParticipant = async (p: Participant) => {
    await insforge.database.from('participants').update({ left_at: new Date().toISOString() }).eq('id', p.id);
    await publishWaiting('participant_rejected', { participantId: p.id });
    setWaitingParticipants((prev) => prev.filter((x) => x.id !== p.id));
  };

  const toggleMic = async (p: Participant) => {
    const next = !p.is_muted;
    await insforge.database.from('participants').update({ is_muted: next }).eq('id', p.id);
    await publish('participant_muted', { participantId: p.id, isMuted: next });
    setParticipants((prev) => prev.map((x) => x.id === p.id ? { ...x, is_muted: next } : x));
  };

  const toggleCamera = async (p: Participant) => {
    const next = !p.camera_off;
    await insforge.database.from('participants').update({ camera_off: next }).eq('id', p.id);
    await publish('participant_camera_off', { participantId: p.id, cameraOff: next });
    setParticipants((prev) => prev.map((x) => x.id === p.id ? { ...x, camera_off: next } : x));
  };

  const removeParticipant = async (p: Participant) => {
    if (!window.confirm(`Remove ${p.name} from the meeting?`)) return;
    await insforge.database.from('participants').update({ left_at: new Date().toISOString() }).eq('id', p.id);
    await publish('participant_removed', { participantId: p.id });
    setParticipants((prev) => prev.filter((x) => x.id !== p.id));
  };

  const promoteParticipant = async (p: Participant) => {
    const newRole = p.role === 'presenter' ? 'student' : 'presenter';
    await insforge.database.from('participants').update({ role: newRole }).eq('id', p.id);
    await publish('promoted', { participantId: p.id, role: newRole });
    setParticipants((prev) => prev.map((x) => x.id === p.id ? { ...x, role: newRole } : x));
  };

  const lowerHand = async (p: Participant) => {
    await insforge.database.from('participants').update({ hand_raised: false }).eq('id', p.id);
    await publish('hand_lowered', { participantId: p.id });
    setParticipants((prev) => prev.map((x) => x.id === p.id ? { ...x, hand_raised: false } : x));
  };

  const muteAll = async () => {
    if (!meeting) return;
    await insforge.database.from('participants').update({ is_muted: true }).eq('meeting_id', meeting.id).neq('role', 'host');
    await publish('mute_all', {});
    setParticipants((prev) => prev.map((p) => p.role !== 'host' ? { ...p, is_muted: true } : p));
  };

  const toggleLock = async () => {
    if (!meeting) return;
    const next = !meeting.is_locked;
    await insforge.database.from('meetings').update({ is_locked: next }).eq('id', meeting.id);
    await publish('meeting_locked', { locked: next });
    setMeeting((m) => m ? { ...m, is_locked: next } : m);
  };

  const toggleChat = async () => {
    if (!meeting) return;
    const next = !meeting.chat_enabled;
    await insforge.database.from('meetings').update({ chat_enabled: next }).eq('id', meeting.id);
    setMeeting((m) => m ? { ...m, chat_enabled: next } : m);
  };

  const startMeeting = async () => {
    if (!meeting) return;
    await insforge.database.from('meetings').update({ status: 'active' }).eq('id', meeting.id);
    setMeeting((m) => m ? { ...m, status: 'active' } : m);
    // Auto-admit all waiting participants when starting without waiting room
    for (const p of waitingParticipants) {
      await admitParticipant(p);
    }
    // Store host token and navigate to meeting
    if (hostToken) sessionStorage.setItem('livekitToken', hostToken);
    sessionStorage.setItem('meetingCode', meetingCode ?? '');
    if (meeting) sessionStorage.setItem('meetingId', meeting.id);
    const hostName = user?.profile?.name ?? user?.email ?? 'Host';
    sessionStorage.setItem('participantName', hostName);

    // Insert host as participant if not already present
    const { data: existing } = await insforge.database
      .from('participants')
      .select('id')
      .eq('meeting_id', meeting.id)
      .eq('role', 'host')
      .maybeSingle();

    if (!existing) {
      const { data: hostParticipant } = await insforge.database
        .from('participants')
        .insert([{ meeting_id: meeting.id, name: hostName, role: 'host', admitted: true }])
        .select()
        .single();
      if (hostParticipant) sessionStorage.setItem('participantId', hostParticipant.id);
    } else {
      sessionStorage.setItem('participantId', existing.id);
    }

    navigate(`/meeting/${meetingCode}`);
  };

  const endMeeting = async () => {
    if (!meeting) return;
    if (!window.confirm('End this meeting for all participants?')) return;
    const now = new Date().toISOString();
    await insforge.database.from('meetings').update({ status: 'ended', ended_at: now }).eq('id', meeting.id);
    await insforge.database.from('participants').update({ left_at: now }).eq('meeting_id', meeting.id).is('left_at', null);
    await publish('meeting_ended', {});
    navigate('/admin');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-secondary text-xl">Loading meeting...</p>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-ink-secondary text-xl">Meeting not found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ink-primary mb-1">
            Host Controls: {meeting.title}
          </h1>
          <p className="text-lg text-ink-secondary flex items-center gap-3">
            <span className={cn('inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-sm font-bold',
              meeting.status === 'active' ? 'bg-green-100 text-green-700' :
              meeting.status === 'ended' ? 'bg-red-100 text-red-700' :
              'bg-amber-100 text-amber-700'
            )}>
              <span className={cn('w-2 h-2 rounded-full', meeting.status === 'active' ? 'bg-green-500' : meeting.status === 'ended' ? 'bg-red-500' : 'bg-amber-500')} />
              {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
            </span>
            Code: <span className="font-mono font-bold">{meeting.meeting_code}</span>
          </p>
        </div>
        <div className="flex gap-3">
          {meeting.status !== 'active' && (
            <Button variant="success" size="md" icon={<VideoIcon size={20} />} onClick={startMeeting}>
              Start Meeting
            </Button>
          )}
          {meeting.status === 'active' && (
            <Button variant="primary" size="md" icon={<VideoIcon size={20} />} onClick={() => navigate(`/meeting/${meetingCode}`)}>
              Rejoin Meeting
            </Button>
          )}
          <Button variant="danger" size="md" icon={<PhoneOffIcon size={20} />} onClick={endMeeting}>
            End for All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Global Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h2 className="text-xl font-bold text-ink-primary mb-4">Global Actions</h2>
            <div className="space-y-3">
              <Button variant="outline" fullWidth onClick={muteAll} className="justify-start">
                <MicOffIcon size={20} className="mr-3 text-ink-secondary" />
                Mute All Participants
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={toggleLock}
                className={cn('justify-start', meeting.is_locked && 'bg-amber-50 border-amber-200 text-amber-800')}>
                {meeting.is_locked ? <LockIcon size={20} className="mr-3" /> : <UnlockIcon size={20} className="mr-3 text-ink-secondary" />}
                {meeting.is_locked ? 'Meeting Locked' : 'Lock Meeting'}
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={toggleChat}
                className={cn('justify-start', !meeting.chat_enabled && 'bg-amber-50 border-amber-200 text-amber-800')}>
                <MessageSquareOffIcon size={20} className={cn('mr-3', !meeting.chat_enabled ? '' : 'text-ink-secondary')} />
                {meeting.chat_enabled ? 'Disable Chat' : 'Enable Chat'}
              </Button>
              <Button
                variant="outline"
                fullWidth
                onClick={() => setIsRecording(!isRecording)}
                className={cn('justify-start', isRecording && 'bg-red-50 border-red-200 text-red-700')}>
                <div className={cn('w-4 h-4 rounded-full mr-3 flex-shrink-0', isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-400')} />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </Button>
              <Button variant="outline" fullWidth onClick={() => loadData(meetingCode!)} className="justify-start">
                <RefreshCwIcon size={20} className="mr-3 text-ink-secondary" />
                Refresh Participants
              </Button>
            </div>
          </Card>

          {/* Meeting link */}
          <Card className="bg-primary/5 border-primary/20">
            <h3 className="text-base font-bold text-ink-primary mb-2">Meeting Link</h3>
            <p className="font-mono text-sm break-all text-primary mb-3">
              {window.location.origin}/join/{meeting.meeting_code}
            </p>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/join/${meeting.meeting_code}`)}>
              Copy Link
            </Button>
          </Card>
        </div>

        {/* Right: Participant List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Waiting Room */}
          {waitingParticipants.length > 0 && (
            <Card padding="none">
              <div className="p-6 border-b border-border bg-amber-50 rounded-t-2xl">
                <h2 className="text-xl font-bold text-amber-800">
                  Waiting Room ({waitingParticipants.length})
                </h2>
              </div>
              <div className="p-2">
                {waitingParticipants.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                        {p.name.charAt(0)}
                      </div>
                      <span className="text-base font-semibold text-ink-primary">{p.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="success" size="md" icon={<CheckCircleIcon size={18} />} onClick={() => admitParticipant(p)}>
                        Admit
                      </Button>
                      <Button variant="danger" size="md" icon={<UserXIcon size={18} />} onClick={() => rejectParticipant(p)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Active Participants */}
          <Card padding="none" className="flex flex-col" style={{ minHeight: '400px' }}>
            <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-ink-primary">
                Participants ({participants.length})
              </h2>
            </div>
            <div className="flex-grow overflow-y-auto p-2">
              {participants.length === 0 && (
                <p className="text-center text-ink-secondary py-8">No participants yet.</p>
              )}
              {participants.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-xl transition-colors border-b border-border last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-lg font-bold text-ink-primary flex items-center gap-2 flex-wrap">
                        {p.name}
                        {p.role === 'host' && (
                          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded uppercase tracking-wider">Host</span>
                        )}
                        {p.role === 'presenter' && (
                          <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded uppercase tracking-wider">Presenter</span>
                        )}
                        {p.hand_raised && (
                          <span className="bg-accent/20 text-accent text-xs px-2 py-0.5 rounded flex items-center gap-1">
                            <HandIcon size={12} /> Hand Raised
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {p.role !== 'host' && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => toggleMic(p)}
                        className={cn('p-2 rounded-lg transition-colors', p.is_muted ? 'bg-red-100 text-red-600' : 'text-ink-secondary hover:bg-slate-200')}
                        title={p.is_muted ? 'Unmute' : 'Mute'}>
                        {p.is_muted ? <MicOffIcon size={20} /> : <MicIcon size={20} />}
                      </button>
                      <button
                        onClick={() => toggleCamera(p)}
                        className={cn('p-2 rounded-lg transition-colors', p.camera_off ? 'bg-red-100 text-red-600' : 'text-ink-secondary hover:bg-slate-200')}
                        title={p.camera_off ? 'Enable Camera' : 'Disable Camera'}>
                        {p.camera_off ? <VideoOffIcon size={20} /> : <VideoIcon size={20} />}
                      </button>
                      {p.hand_raised && (
                        <button onClick={() => lowerHand(p)} className="p-2 text-accent hover:bg-orange-50 rounded-lg" title="Lower Hand">
                          <HandIcon size={20} />
                        </button>
                      )}
                      <div className="w-px h-8 bg-border mx-1 hidden sm:block" />
                      <button
                        onClick={() => promoteParticipant(p)}
                        className="p-2 text-ink-secondary hover:bg-slate-200 rounded-lg hidden sm:block"
                        title={p.role === 'presenter' ? 'Demote to Student' : 'Promote to Presenter'}>
                        <MonitorUpIcon size={20} />
                      </button>
                      <button
                        onClick={() => removeParticipant(p)}
                        className="p-2 text-danger hover:bg-red-50 rounded-lg"
                        title="Remove">
                        <UserXIcon size={20} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
