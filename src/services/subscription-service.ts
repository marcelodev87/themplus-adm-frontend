import { api } from 'boot/axios';
import type { Subscription } from 'src/ts/interfaces/models/subscriptions';

const baseUrl = 'subscription';

export const getSubscriptionsService = (): Promise<{
  status: number;
  data: {
    subscriptions: Subscription[];
    message: string;
  };
}> => api.get(`/${baseUrl}`);

export const updateSubscriptionService = (
  id: string,
  price: number,
): Promise<{
  status: number;
  data: {
    subscriptions: Subscription[];
    message: string;
  };
}> =>
  api.put(`/${baseUrl}`, {
    id,
    price,
  });
