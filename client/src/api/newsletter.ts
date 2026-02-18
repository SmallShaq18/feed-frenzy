import client from './client';
import type { SubscribePayload, Subscriber } from '../types/index';

export async function subscribeToNewsletter(
  payload: SubscribePayload
): Promise<Subscriber> {
  const { data } = await client.post('/newsletter/subscribe', payload);
  return data.data;
}

export async function unsubscribeFromNewsletter(token: string): Promise<void> {
  await client.get(`/newsletter/unsubscribe/${token}`);
}

export async function sendTestNewsletter(email: string): Promise<void> {
  await client.post('/newsletter/test', { email });
}

// NEW
export async function getSubscribers(): Promise<{
  subscribers: Subscriber[];
  total: number;
  active: number;
  unsubscribed: number;
}> {
  const { data } = await client.get('/newsletter/subscribers');
  return data.data;
}