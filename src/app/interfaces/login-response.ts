import { User } from './user-interface';

/**
 * Interfaz para la respuesta del login.
 * Contiene el mensaje del servidor, token de sesión y datos del usuario.
 */
export interface LoginResponse {
  /** Mensaje de éxito o información del login */
  message: string;

  /** Token JWT devuelto por el servidor */
  token: string;

  /** Datos del usuario que inició sesión */
  user: User;
}
