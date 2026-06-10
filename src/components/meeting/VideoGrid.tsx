import {
  ParticipantTile,
  useTracks,
  useLocalParticipant,
  useRemoteParticipants,
  isTrackReference,
} from '@livekit/components-react';
import { Track } from 'livekit-client';
import { UserIcon, UsersIcon, HandIcon, MicOffIcon, CrownIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useMeetingContext, Participant } from '../../contexts/MeetingContext';

interface VideoGridProps {
  sidebarOpen: boolean;
}

const STRIP_LIMIT = 8;

function findDbParticipant(identity: string, name: string | undefined, participants: Participant[]) {
  return participants.find(p =>
    (p.livekit_identity && p.livekit_identity === identity) ||
    (name && p.name === name) ||
    p.name === identity
  ) ?? null;
}

function AudioAvatarTile({
  name,
  isLocal,
  handRaised,
  isMuted,
}: {
  name: string;
  isLocal: boolean;
  handRaised?: boolean;
  isMuted?: boolean;
}) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-800 gap-1 p-2">
      <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center text-lg font-bold flex-shrink-0">
        {name.charAt(0).toUpperCase()}
      </div>
      <span className="text-xs text-slate-300 truncate max-w-full text-center">
        {isLocal ? 'You' : name}
      </span>
      {isMuted && (
        <div className="absolute bottom-1 left-1 bg-red-600/80 rounded-full p-0.5">
          <MicOffIcon size={10} className="text-white" />
        </div>
      )}
      {handRaised && (
        <div className="absolute top-1 right-1 bg-amber-500 rounded-full p-0.5">
          <HandIcon size={10} className="text-white" />
        </div>
      )}
    </div>
  );
}

export function VideoGrid({ sidebarOpen }: VideoGridProps) {
  const { participants } = useMeetingContext();

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: true }
  );
  const { localParticipant } = useLocalParticipant();
  const remoteParticipants = useRemoteParticipants();

  const trackedIds = new Set(tracks.map(t => t.participant.identity));
  const audioOnlyParticipants = remoteParticipants.filter(p => !trackedIds.has(p.identity));

  const sorted = [...tracks].sort((a, b) => {
    const aIsHost = a.participant.identity.startsWith('host:');
    const bIsHost = b.participant.identity.startsWith('host:');
    const aIsScreen = a.source === Track.Source.ScreenShare;
    const bIsScreen = b.source === Track.Source.ScreenShare;
    if (aIsHost && !bIsHost) return -1;
    if (!aIsHost && bIsHost) return 1;
    if (aIsScreen && !bIsScreen) return -1;
    if (!aIsScreen && bIsScreen) return 1;
    return 0;
  });

  const [primary, ...rest] = sorted;

  const stripEntries = [
    ...rest.map(ref => ({ kind: 'track' as const, ref, identity: ref.participant.identity })),
    ...audioOnlyParticipants.map(p => ({
      kind: 'audio' as const,
      name: p.name ?? p.identity,
      identity: p.identity,
    })),
  ];

  const visibleStrip = stripEntries.slice(0, STRIP_LIMIT);
  const overflowCount = Math.max(0, stripEntries.length - STRIP_LIMIT);

  if (!primary && stripEntries.length === 0) {
    return (
      <div className={cn(
        'flex-grow flex items-center justify-center p-4 transition-all',
        sidebarOpen ? 'lg:mr-[320px]' : ''
      )}>
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserIcon size={40} className="text-slate-500" />
          </div>
          <p className="text-slate-400 text-lg">Waiting for participants…</p>
        </div>
      </div>
    );
  }

  const primaryIsHost = primary?.participant.identity.startsWith('host:');
  const primaryDb = primary
    ? findDbParticipant(primary.participant.identity, primary.participant.name, participants)
    : null;

  return (
    <div className={cn(
      'flex-grow flex flex-col lg:flex-row p-3 gap-3 overflow-hidden transition-all',
      sidebarOpen ? 'lg:mr-[320px]' : ''
    )}>
      {/* Primary tile — host/screen share always first */}
      {primary ? (
        <div className="flex-grow bg-slate-900 rounded-2xl overflow-hidden border-2 border-primary relative min-h-[200px] lg:min-h-0">
          <ParticipantTile trackRef={primary} style={{ width: '100%', height: '100%' }} />

          {primaryIsHost && (
            <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-lg flex items-center gap-1.5">
              <CrownIcon size={12} className="text-white" />
              <span className="text-white text-xs font-bold uppercase tracking-wider">Host</span>
            </div>
          )}

          {primaryDb?.hand_raised && !primaryIsHost && (
            <div className="absolute top-3 right-3 bg-amber-500/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
              <HandIcon size={14} className="text-white" />
              <span className="text-white text-xs font-semibold">Hand Raised</span>
            </div>
          )}

          {primaryDb?.is_muted && (
            <div className="absolute bottom-3 left-3 bg-red-600/80 backdrop-blur-sm p-1.5 rounded-lg">
              <MicOffIcon size={16} className="text-white" />
            </div>
          )}
        </div>
      ) : (
        <div className="flex-grow bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-700 flex items-center justify-center min-h-[200px] lg:min-h-0">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <UserIcon size={36} className="text-slate-500" />
            </div>
            <p className="text-slate-400 text-base">Audio only</p>
          </div>
        </div>
      )}

      {/* Participant strip — capped at STRIP_LIMIT tiles */}
      {(visibleStrip.length > 0 || overflowCount > 0) && (
        <div className={cn(
          'flex gap-3 overflow-x-auto pb-1',
          'lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:w-56 lg:pb-0 lg:flex-shrink-0'
        )}>
          {visibleStrip.map((entry) => {
            const isLocal = entry.identity === localParticipant?.identity;
            const entryIsHost = entry.identity.startsWith('host:');
            const dbP = entry.kind === 'track'
              ? findDbParticipant(entry.identity, entry.ref.participant.name, participants)
              : findDbParticipant(entry.identity, entry.name, participants);

            if (entry.kind === 'audio') {
              return (
                <div
                  key={entry.identity}
                  className="w-44 h-28 lg:w-full lg:h-40 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 border border-slate-700 relative"
                >
                  <AudioAvatarTile
                    name={entry.name}
                    isLocal={isLocal}
                    handRaised={dbP?.hand_raised}
                    isMuted={dbP?.is_muted}
                  />
                  {entryIsHost && (
                    <div className="absolute top-1 left-1 bg-primary/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                      <CrownIcon size={8} /> Host
                    </div>
                  )}
                </div>
              );
            }

            const hasCamera = isTrackReference(entry.ref);
            return (
              <div
                key={`${entry.ref.participant.sid}-${entry.ref.source}`}
                className="w-44 h-28 lg:w-full lg:h-40 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-700"
              >
                {hasCamera ? (
                  <ParticipantTile
                    trackRef={entry.ref}
                    style={{ width: '100%', height: '100%' }}
                  />
                ) : (
                  <AudioAvatarTile
                    name={entry.ref.participant.name ?? entry.ref.participant.identity}
                    isLocal={isLocal}
                    handRaised={dbP?.hand_raised}
                    isMuted={dbP?.is_muted}
                  />
                )}

                {entryIsHost && (
                  <div className="absolute top-1 left-1 bg-primary/80 px-1.5 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-0.5">
                    <CrownIcon size={8} /> Host
                  </div>
                )}

                {dbP?.hand_raised && !entryIsHost && (
                  <div className="absolute top-1 right-1 bg-amber-500/90 rounded-full p-1">
                    <HandIcon size={12} className="text-white" />
                  </div>
                )}

                {dbP?.is_muted && (
                  <div className="absolute bottom-1 left-1 bg-red-600/70 rounded-full p-1">
                    <MicOffIcon size={12} className="text-white" />
                  </div>
                )}

                {isLocal && !hasCamera && (
                  <div className="absolute bottom-1 right-2 text-xs text-slate-400 font-medium">
                    You
                  </div>
                )}
              </div>
            );
          })}

          {overflowCount > 0 && (
            <div className="w-44 h-28 lg:w-full lg:h-40 bg-slate-800/60 rounded-xl flex-shrink-0 flex flex-col items-center justify-center border border-slate-700 gap-1">
              <UsersIcon size={22} className="text-slate-400" />
              <span className="text-sm font-semibold text-slate-300">+{overflowCount} more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
