export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
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
