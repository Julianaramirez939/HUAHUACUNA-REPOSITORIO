/**
 * Interfaz que representa el estado de un usuario dentro del sistema.
 * Ejemplo: activo, inactivo, suspendido, pendiente de verificación, etc.
 */
export interface State {
  /** Identificador único del estado */
  id: number;

  /** Tipo de modelo al que pertenece (por ejemplo 'User') */
  model_type: string;

  /** Nombre descriptivo del estado (ej. "Activo", "Inactivo") */
  name: string;

  /** Identificador único en formato slug (ej. "activo", "inactivo") */
  slug: string;

  /** Color asociado al estado para UI o etiquetas (ej. "#00FF00") */
  color: string;

  /** Descripción adicional del estado */
  description: string;

  /** Fecha de creación del estado */
  created_at: string;

  /** Fecha de la última actualización del estado */
  updated_at: string;

  /** Fecha de eliminación del estado, o null si no ha sido eliminado */
  deleted_at: string | null;
}
