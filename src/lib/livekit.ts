const INSFORGE_URL = import.meta.env.VITE_INSFORGE_URL as string;

export async function getLivekitToken(
  meetingCode: string,
  participantName: string,
  isHost: boolean
): Promise<string> {
  const res = await fetch(`${INSFORGE_URL}/functions/livekit-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meetingCode, participantName, isHost }),
  });
  if (!res.ok) {
    throw new Error('Failed to get LiveKit token');
  }
  const data = await res.json();
  return data.token as string;
}
