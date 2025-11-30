//Interface para crear un mensaje de un niño
export interface CrearMensajeNino {
  godparent_id: number;
  children_id: number;
  is_from_admin?: boolean | null;
  subject: string;
  content: string;
}
