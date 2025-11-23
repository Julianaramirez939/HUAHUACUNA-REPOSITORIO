export interface ActualizarUsuario {
    id: number;
  email: string;
  state_id: number;
  name: string;
  last_name: string;
  password?: string;      // opcional en actualización
  roles: number[];         // o string[]
}
