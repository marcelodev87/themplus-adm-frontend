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
  coupon_id: string | null;
  coupon: Coupon;
}

export interface EnterpriseCreate {
  name: string;
  email: string;
  cnpj: string | null;
  cpf: string | null;
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  address: string;
  numberAddress: string;
  complement: string | null;
  phone: string | null;
  codeFinancial: number | null;
}
