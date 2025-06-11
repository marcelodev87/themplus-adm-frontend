export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  active: number;
  department_id: string | null;
  view_enterprise_id: string;
  view_enterprise_name: string;
  created_by: string | null;
  created_at: string;
}

export interface UserCeate {
  name: string;
  position: string;
  email: string;
  password: string;
  phone: string | null;
}

export interface UserADM {
  id: string;
  name: string;
  email: string;
  position: string;
  active: number;
  created_by: string | null;
  department_id: string | null;
  created_at: string;
}
