import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { insforge } from '../lib/insforge';

export interface ChatMessage {
  id: string;
  sender_name: string;
  message: string;
  sent_at: string;
  participant_id: string;
}

export interface Participant {
  id: string;
  name: string;
  role: 'host' | 'student' | 'presenter';
  is_muted: boolean;
  camera_off: boolean;
  hand_raised: boolean;
  admitted: boolean;
  livekit_identity: string | null;
}

export interface Meeting {
  id: string;
  meeting_code: string;
  title: string;
  subject: string | null;
  status: 'waiting' | 'active' | 'ended';
  is_locked: boolean;
  chat_enabled: boolean;
  waiting_room_enabled: boolean;
}

interface MeetingContextValue {
  meeting: Meeting | null;
  participants: Participant[];
  chatMessages: ChatMessage[];
  myParticipantId: string | null;
  connected: boolean;
  loadMeeting: (meetingCode: string) => Promise<void>;
  sendChat: (meetingCode: string, message: string) => Promise<void>;
  publishEvent: (meetingCode: string, event: string, payload: Record<string, unknown>) => Promise<void>;
  refreshParticipants: (meetingId: string) => Promise<void>;
}

const MeetingContext = createContext<MeetingContextValue | null>(null);

export function MeetingProvider({ children }: { children: React.ReactNode }) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [connected, setConnected] = useState(false);
  const channelRef = useRef<string | null>(null);

  const myParticipantId = sessionStorage.getItem('participantId');

  const loadMeeting = useCallback(async (meetingCode: string) => {
    const { data } = await insforge.database
      .from('meetings')
      .select('*')
      .eq('meeting_code', meetingCode)
      .single();
    if (data) setMeeting(data as Meeting);
  }, []);

  const refreshParticipants = useCallback(async (meetingId: string) => {
    const { data } = await insforge.database
      .from('participants')
      .select('*')
      .eq('meeting_id', meetingId)
      .is('left_at', null);
    if (data) setParticipants(data as Participant[]);
  }, []);

  const sendChat = useCallback(async (meetingCode: string, message: string) => {
    const participantId = sessionStorage.getItem('participantId');
    const participantName = sessionStorage.getItem('participantName') ?? 'Guest';

    if (!meeting) return;
    await insforge.database.from('chat_messages').insert([{
      meeting_id: meeting.id,
      participant_id: participantId,
      sender_name: participantName,
      message,
    }]);

    await insforge.realtime.publish(`meeting:${meetingCode}`, 'chat_message', {
      id: crypto.randomUUID(),
      sender_name: participantName,
      message,
      sent_at: new Date().toISOString(),
      participant_id: participantId,
    });
  }, [meeting]);

  const publishEvent = useCallback(async (
    meetingCode: string,
    event: string,
    payload: Record<string, unknown>
  ) => {
    await insforge.realtime.publish(`meeting:${meetingCode}`, event, payload);
  }, []);

  useEffect(() => {
    if (!meeting) return;

    const channel = `meeting:${meeting.meeting_code}`;
    channelRef.current = channel;

    let mounted = true;

    (async () => {
      await insforge.realtime.connect();
      await insforge.realtime.subscribe(channel);
      if (mounted) setConnected(true);

      insforge.realtime.on('chat_message', (payload: ChatMessage) => {
        if (!mounted) return;
        setChatMessages((prev) => [...prev, payload]);
      });

      insforge.realtime.on('participant_muted', (payload: { participantId: string; isMuted: boolean }) => {
        if (!mounted) return;
        setParticipants((prev) =>
          prev.map((p) => p.id === payload.participantId ? { ...p, is_muted: payload.isMuted } : p)
        );
      });

      insforge.realtime.on('participant_camera_off', (payload: { participantId: string; cameraOff: boolean }) => {
        if (!mounted) return;
        setParticipants((prev) =>
          prev.map((p) => p.id === payload.participantId ? { ...p, camera_off: payload.cameraOff } : p)
        );
      });

      insforge.realtime.on('hand_raised', (payload: { participantId: string }) => {
        if (!mounted) return;
        setParticipants((prev) =>
          prev.map((p) => p.id === payload.participantId ? { ...p, hand_raised: true } : p)
        );
      });

      insforge.realtime.on('hand_lowered', (payload: { participantId: string }) => {
        if (!mounted) return;
        setParticipants((prev) =>
          prev.map((p) => p.id === payload.participantId ? { ...p, hand_raised: false } : p)
        );
      });

      insforge.realtime.on('promoted', (payload: { participantId: string; role: 'presenter' | 'student' }) => {
        if (!mounted) return;
        setParticipants((prev) =>
          prev.map((p) => p.id === payload.participantId ? { ...p, role: payload.role } : p)
        );
      });
    })();

    return () => {
      mounted = false;
      insforge.realtime.unsubscribe(channel);
    };
  }, [meeting]);

  return (
    <MeetingContext.Provider value={{
      meeting, participants, chatMessages, myParticipantId,
      connected, loadMeeting, sendChat, publishEvent, refreshParticipants,
    }}>
      {children}
    </MeetingContext.Provider>
  );
}

export function useMeetingContext() {
  const ctx = useContext(MeetingContext);
  if (!ctx) throw new Error('useMeetingContext must be used inside MeetingProvider');
  return ctx;
}
