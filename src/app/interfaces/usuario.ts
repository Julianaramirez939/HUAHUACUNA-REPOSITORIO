import { Estado } from '../interfaces/estados';
import { Rol } from '../interfaces/rol';
//Interface para el usuario
export interface Usuario {
  id: number;
  email: string;
  state_id: number;
  name: string;
  last_name: string;
  roles: Rol[];
  created_at: string;
  updated_at?: string;
  uuid?: string;
  full_name?: string;
  state?: Estado;
}
