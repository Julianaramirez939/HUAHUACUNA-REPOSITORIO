import { State } from './state-interface';

/**
 * Interfaz que representa a un usuario dentro del sistema.
 * Contiene información personal, identificadores y su estado actual.
 */
export interface User {
  /** Identificador único del usuario */
  id: number;

  /** Identificador del estado del usuario (relación con State) */
  state_id: number;

  /** Nombre del usuario */
  name: string;

  /** Apellido del usuario */
  last_name: string;

  /** Correo electrónico del usuario */
  email: string;

  /** Identificador único universal (UUID) del usuario */
  uuid: string;

  /** Fecha de creación del registro */
  created_at: string;

  /** Fecha de la última actualización del registro */
  updated_at: string;

  /** Nombre completo del usuario (ej. concatenación de name + last_name) */
  full_name: string;

  /** Estado completo del usuario, basado en la interfaz State */
  state: State;
}
