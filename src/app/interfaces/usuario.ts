import { Estado } from '../interfaces/estados';
import { Rol } from '../interfaces/rol';

export interface Usuario {
  id: number;
  email: string;
  state_id: number;
  name: string;
  last_name: string;
  roles: Rol[];     // vienen como objetos [{id, name, pivot},{...}]
  created_at: string;
  updated_at?: string;

  // Datos extra que sí llegan en tu JSON
  uuid?: string;
  full_name?: string;
  state?: Estado;
}
