const FUNCTIONS_URL = 'https://pv755ixk.functions.insforge.app';

export async function getLivekitToken(
  meetingCode: string,
  participantName: string,
  isHost: boolean
): Promise<string> {
  const res = await fetch(`${FUNCTIONS_URL}/livekit-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ meetingCode, participantName, isHost }),
  });
  if (!res.ok) {
    const msg = await res.text().catch(() => res.statusText);
    throw new Error(`LiveKit token request failed (${res.status}): ${msg}`);
  }
  const data = await res.json();
  return data.token as string;
}
