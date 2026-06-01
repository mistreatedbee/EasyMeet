import { ParticipantTile, useTracks, useLocalParticipant } from '@livekit/components-react';
import { Track } from 'livekit-client';
import { UserIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface VideoGridProps {
  isHost: boolean;
  chatOpen: boolean;
}

export function VideoGrid({ isHost, chatOpen }: VideoGridProps) {
  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { onlySubscribed: false }
  );
  const { localParticipant } = useLocalParticipant();

  // Sort: host identity first, screen shares second, then others
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

  if (tracks.length === 0) {
    // No tracks yet — show a waiting placeholder
    return (
      <div className={cn(
        'flex-grow flex items-center justify-center p-4 transition-all',
        chatOpen ? 'lg:mr-[320px]' : ''
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

  return (
    <div className={cn(
      'flex-grow flex flex-col lg:flex-row p-3 gap-3 overflow-hidden transition-all',
      chatOpen ? 'lg:mr-[320px]' : ''
    )}>
      {/* Primary tile — teacher/screen share always first */}
      {primary && (
        <div className="flex-grow bg-slate-900 rounded-2xl overflow-hidden border-2 border-primary relative min-h-[200px] lg:min-h-0">
          <ParticipantTile
            trackRef={primary}
            style={{ width: '100%', height: '100%' }}
          />
          {/* Teacher badge */}
          {primary.participant.identity.startsWith('host:') && (
            <div className="absolute top-3 left-3 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-lg">
              <span className="text-white text-xs font-bold uppercase tracking-wider">Teacher</span>
            </div>
          )}
        </div>
      )}

      {/* Participant strip */}
      {rest.length > 0 && (
        <div className={cn(
          'flex gap-3 overflow-x-auto pb-1',
          'lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden lg:w-56 lg:pb-0 lg:flex-shrink-0'
        )}>
          {rest.map((track) => {
            const isLocal = track.participant.identity === localParticipant?.identity;
            return (
              <div
                key={`${track.participant.sid}-${track.source}`}
                className="w-44 h-28 lg:w-full lg:h-40 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0 relative border border-slate-700"
              >
                <ParticipantTile
                  trackRef={track}
                  style={{ width: '100%', height: '100%' }}
                />
                {isLocal && (
                  <div className="absolute bottom-1 right-2 text-xs text-slate-400 font-medium">
                    You
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
