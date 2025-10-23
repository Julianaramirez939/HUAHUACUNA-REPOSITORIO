/**
 * Interfaz para las credenciales de inicio de sesión.
 * Se usa para enviar email y contraseña al backend.
 */
export interface CredencialesLogin {
  /** Correo electrónico del usuario */
  email: string;

  /** Contraseña del usuario */
  password: string;
}
