import { getStore } from '@netlify/blobs';

const businessTypes = new Set(['wholesaler', 'distributor', 'manufacturer', 'trader', 'other']);
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});

export default async (request) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405);
  if (!request.headers.get('content-type')?.includes('application/json')) return json({ error: 'Expected JSON.' }, 415);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid JSON.' }, 400);
  }

  if (typeof body?.website === 'string' && body.website.trim()) return json({ ok: true });

  const name = typeof body?.name === 'string' ? body.name.trim().slice(0, 100) : '';
  const phone = typeof body?.phone === 'string' ? body.phone.trim().slice(0, 32) : '';
  const phoneDigits = phone.replace(/\D/g, '');
  const businessType = typeof body?.businessType === 'string' ? body.businessType : '';
  const debtorAccounts = Number(body?.debtorAccounts);

  if (!name || phoneDigits.length < 7 || phoneDigits.length > 15 || !businessTypes.has(businessType) || !Number.isSafeInteger(debtorAccounts) || debtorAccounts < 1) {
    return json({ error: 'Please check the form fields and try again.' }, 400);
  }

  const lead = {
    name,
    phone,
    businessType,
    debtorAccounts,
    receivedAt: new Date().toISOString(),
  };

  try {
    const store = getStore('ello-business-demo-leads');
    const id = `${Date.now()}-${crypto.randomUUID()}`;
    await store.setJSON(id, lead);
    return json({ ok: true });
  } catch {
    return json({ error: 'We could not save your request. Please use WhatsApp instead.' }, 503);
  }
};

export const config = { path: '/.netlify/functions/demo', method: 'POST' };
