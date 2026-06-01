async function signJWT(payload, secret) {
  const encoder = new TextEncoder();
  const header = { alg: 'HS256', typ: 'JWT' };

  const base64url = (str) =>
    btoa(str).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signingInput));
  const encodedSignature = base64url(String.fromCharCode(...new Uint8Array(signature)));

  return `${signingInput}.${encodedSignature}`;
}

module.exports = async function (request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { meetingCode, participantName, isHost } = await request.json();

  if (!meetingCode || !participantName) {
    return new Response(JSON.stringify({ error: 'meetingCode and participantName are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = Deno.env.get('LIVEKIT_API_KEY');
  const apiSecret = Deno.env.get('LIVEKIT_API_SECRET');

  if (!apiKey || !apiSecret) {
    return new Response(
      JSON.stringify({ error: 'LiveKit not configured — set LIVEKIT_API_KEY and LIVEKIT_API_SECRET in edge function environment' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const now = Math.floor(Date.now() / 1000);
  const identity = `${isHost ? 'host' : 'guest'}:${participantName}`;

  const payload = {
    iss: apiKey,
    sub: identity,
    exp: now + 6 * 3600,
    nbf: now - 10,
    video: {
      roomJoin: true,
      room: meetingCode,
      canPublish: true,
      canSubscribe: true,
      roomAdmin: Boolean(isHost),
    },
  };

  const token = await signJWT(payload, apiSecret);

  return new Response(JSON.stringify({ token }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
