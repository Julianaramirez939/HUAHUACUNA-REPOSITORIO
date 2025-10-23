/**
 * Interfaz para enviar los datos de registro de un usuario.
 */
export interface RegisterUser {
  /** Nombre del usuario */
  name: string;

  /** Apellido del usuario */
  last_name: string;

  /** Correo electrónico del usuario */
  email: string;

  /** Contraseña elegida por el usuario */
  password: string;

  /** Confirmación de la contraseña */
  password_confirmation: string;
}
