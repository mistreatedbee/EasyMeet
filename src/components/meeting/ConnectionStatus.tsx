import { useConnectionState } from '@livekit/components-react';
import { ConnectionState } from 'livekit-client';

export function ConnectionStatus() {
  const state = useConnectionState();

  if (state === ConnectionState.Connected) {
    return (
      <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-sm text-slate-300">Connected</span>
      </div>
    );
  }

  if (state === ConnectionState.Reconnecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-amber-900/60 rounded-full">
        <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-sm text-amber-300">Reconnecting…</span>
      </div>
    );
  }

  if (state === ConnectionState.Connecting) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-slate-800 rounded-full">
        <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
        <span className="text-sm text-slate-300">Connecting…</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-red-900/60 rounded-full">
      <div className="w-2 h-2 rounded-full bg-red-500" />
      <span className="text-sm text-red-300">Disconnected</span>
    </div>
  );
}
