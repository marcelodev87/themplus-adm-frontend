export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  department_id: string | null;
  created_by: string | null;
  created_at: string;
}
