import { api } from 'boot/axios';
import type { QuasarSelect } from 'src/ts/interfaces/quasar/quasar';

const baseUrl = 'service';

export const getResourcesService = (): Promise<{
  status: number;
  data: {
    services: QuasarSelect<string>[];
    message: string;
  };
}> => api.get(`/${baseUrl}`);


