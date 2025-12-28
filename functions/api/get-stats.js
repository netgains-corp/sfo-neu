export async function onRequest(context) {
  // Zero Trust Header auslesen
  const userEmail = context.request.headers.get('Cf-Access-Authenticated-User-Email');
  
  // Falls kein User authentifiziert → Fehler
  if (!userEmail) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // N8n Webhook URL
  const N8N_WEBHOOK = 'https://n8n.srv1164949.hstgr.cloud/webhook/dfd9dbf0-7c8b-470e-910e-fddec3bae8e9';
  
  // Query Parameter auslesen (z.B. action=get_stats)
  const url = new URL(context.request.url);
  const action = url.searchParams.get('action') || 'get_stats';

  // Request an N8n mit Benutzer-Email
  const n8nResponse = await fetch(N8N_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action: action,
      userEmail: userEmail,
      timestamp: new Date().toISOString()
    })
  });

  // N8n Antwort zurückgeben
  const data = await n8nResponse.json();
  
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
