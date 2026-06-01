import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MicIcon, MicOffIcon, VideoIcon, VideoOffIcon, XCircleIcon } from 'lucide-react';
import { insforge } from '../lib/insforge';
import { getLivekitToken } from '../lib/livekit';

type RoomStatus = 'waiting' | 'admitted' | 'rejected' | 'ended';

export function WaitingRoom() {
  const navigate = useNavigate();
  const { meetingCode } = useParams<{ meetingCode: string }>();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [status, setStatus] = useState<RoomStatus>('waiting');
  const [meetingTitle, setMeetingTitle] = useState('');
  const subscribed = useRef(false);

  const participantId = sessionStorage.getItem('participantId');
  const participantName = sessionStorage.getItem('participantName') ?? 'Guest';

  useEffect(() => {
    if (!meetingCode || !participantId) {
      navigate('/');
      return;
    }

    insforge.database
      .from('meetings')
      .select('title, status, waiting_room_enabled')
      .eq('meeting_code', meetingCode)
      .single()
      .then(({ data }) => {
        if (data) {
          setMeetingTitle(data.title);
          if (!data.waiting_room_enabled || data.status === 'active') {
            handleAdmitted();
          }
        }
      });

    const channel = `waiting:${meetingCode}`;
    let mounted = true;

    (async () => {
      await insforge.realtime.connect();
      await insforge.realtime.subscribe(channel);
      subscribed.current = true;

      insforge.realtime.on('participant_admitted', (payload: { participantId: string }) => {
        if (!mounted) return;
        if (payload.participantId === participantId) handleAdmitted();
      });

      insforge.realtime.on('participant_rejected', (payload: { participantId: string }) => {
        if (!mounted) return;
        if (payload.participantId === participantId) setStatus('rejected');
      });

      insforge.realtime.on('meeting_ended', () => {
        if (!mounted) return;
        setStatus('ended');
      });
    })();

    return () => {
      mounted = false;
      insforge.realtime.unsubscribe(channel);
    };
  }, [meetingCode, participantId]);

  const handleAdmitted = async () => {
    if (!meetingCode) return;
    sessionStorage.setItem('isHost', 'false');
    console.info('[EasyMeet] Student admitted to meeting', { meetingCode, participantName });
    try {
      if (participantId) {
        await insforge.database
          .from('participants')
          .update({ admitted: true })
          .eq('id', participantId);
      }
      const token = await getLivekitToken(meetingCode, participantName, false);
      sessionStorage.setItem('livekitToken', token);
      console.info('[EasyMeet] LiveKit token obtained for student');
    } catch (err) {
      console.warn('[EasyMeet] LiveKit token failed, joining without video', err);
      sessionStorage.setItem('livekitToken', '');
    }
    setStatus('admitted');
    setTimeout(() => navigate(`/meeting/${meetingCode}`), 800);
  };

  if (status === 'rejected') {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <XCircleIcon size={64} className="text-danger mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-ink-primary mb-2">Entry Declined</h2>
          <p className="text-ink-secondary text-lg">The host has declined your request to join this meeting.</p>
        </div>
      </div>
    );
  }

  if (status === 'ended') {
    return (
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-ink-primary mb-2">Meeting Has Ended</h2>
          <p className="text-ink-secondary text-lg">The host has ended this meeting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col items-center justify-center p-4 py-12 bg-background">
      <div className="w-full max-w-[560px] text-center">
        <div className="mb-10">
          <motion.div
            className="w-32 h-32 mx-auto mb-8 relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E2E8F0" strokeWidth="6" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke="#1E5AFF" strokeWidth="6"
                strokeDasharray="70 212"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary text-3xl font-bold">
                  {participantName.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </motion.div>

          {status === 'admitted' ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <h1 className="text-3xl font-bold text-green-600 mb-2">Admitted!</h1>
              <p className="text-lg text-ink-secondary">Joining the meeting...</p>
            </motion.div>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-ink-primary mb-3">Please wait...</h1>
              <p className="text-xl text-ink-secondary mb-1">
                <span className="font-semibold text-ink-primary">{participantName}</span>, the host will admit you shortly.
              </p>
              {meetingTitle && (
                <p className="text-lg text-ink-secondary">
                  Meeting: <span className="font-medium text-ink-primary">{meetingTitle}</span>
                </p>
              )}
            </>
          )}
        </div>

        {status === 'waiting' && (
          <div className="flex justify-center gap-3 mb-10">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-4 h-4 bg-primary rounded-full"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        )}

        {status === 'waiting' && (
          <div className="bg-white border border-border rounded-2xl p-6">
            <p className="text-base text-ink-secondary mb-5 font-medium">
              Test your devices while you wait
            </p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${micOn ? 'bg-slate-100 text-ink-primary' : 'bg-red-100 text-danger'}`}
                aria-label={micOn ? 'Mute' : 'Unmute'}>
                {micOn ? <MicIcon size={28} /> : <MicOffIcon size={28} />}
                <span className="text-base font-medium">{micOn ? 'Mic On' : 'Mic Off'}</span>
              </button>
              <button
                onClick={() => setCameraOn(!cameraOn)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-colors ${cameraOn ? 'bg-slate-100 text-ink-primary' : 'bg-red-100 text-danger'}`}
                aria-label={cameraOn ? 'Camera off' : 'Camera on'}>
                {cameraOn ? <VideoIcon size={28} /> : <VideoOffIcon size={28} />}
                <span className="text-base font-medium">{cameraOn ? 'Camera On' : 'Camera Off'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
