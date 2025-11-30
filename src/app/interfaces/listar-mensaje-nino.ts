//Interface para los mensajes de los niños (listar)
export interface ListarMensajeNino {
  id: number;
  subject: string;
  content: string;
  created_at: string;
  is_from_admin?: boolean;
  godparent: {
    full_name: string;
  };
  children: {
    full_name: string;
  };
}
