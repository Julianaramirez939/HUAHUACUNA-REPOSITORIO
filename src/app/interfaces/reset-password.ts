/**
 * Interfaz para enviar los datos necesarios para restablecer la contraseña de un usuario.
 */
export interface ResetPassword {
  /** Correo electrónico del usuario */
  email: string;

  /** Nueva contraseña */
  password: string;

  /** Confirmación de la nueva contraseña */
  password_confirmation: string;

  /** Token recibido para autorizar el restablecimiento */
  token: string;
}

