//Interface para actualizar un usuario
export interface ActualizarUsuario {
    id: number;
  email: string;
  state_id: number;
  name: string;
  last_name: string;
  password?: string;    
  roles: number[];         
}
