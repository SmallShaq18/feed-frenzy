import type { SubscribePayload, Subscriber } from '../types/index';
import client from './client';

export async function subscribeToNewsletter(
  payload: SubscribePayload
): Promise<Subscriber> {
  const { data } = await client.post('/newsletter/subscribe', payload);
  return data.data;
}

export async function unsubscribeFromNewsletter(token: string): Promise<void> {
  await client.get(`/newsletter/unsubscribe/${token}`);
}