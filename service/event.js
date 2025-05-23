import ifetch from '@/utils/ifetch';

export async function createServerEvent(events) {
  return await ifetch('/e', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(events),
  });
}
