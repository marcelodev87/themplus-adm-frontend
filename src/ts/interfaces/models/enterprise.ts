import type { Coupon } from './subscriptions';

export interface Enterprise {
  id: string;
  name: string;
  cnpj: string | null;
  cpf: string | null;
  cep: string | null;
  state: string | null;
  city: string | null;
  neighborhood: string | null;
  address: string | null;
  complement: string | null;
  number_address: string | null;
  email: string | null;
  phone: string | null;
  subscription_id?: string;
  created_by: string | null;
  code_financial: number | null;
  coupon: Coupon;
}
