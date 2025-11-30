import { User } from './user-interface';

/**
 * Interfaz para la respuesta del login.
 * Contiene el mensaje del servidor, token de sesión y datos del usuario.
 */
export interface LoginResponse {
  message: string;
  token: string;
  user: User;
  godparent_id: string;
}
