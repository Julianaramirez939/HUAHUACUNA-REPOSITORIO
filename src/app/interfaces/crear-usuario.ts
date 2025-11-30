//Interface para crear un usuario
export interface CrearUsuario {
  email: string;
  state_id: number;
  name: string;
  last_name: string;
  password: string;
  roles: number[];       
}
