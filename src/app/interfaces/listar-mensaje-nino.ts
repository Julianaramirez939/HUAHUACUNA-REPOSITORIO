export interface ListarMensajeNino {
  id: number;
  subject: string;
  content: string;
  created_at: string;
  godparent: {
    full_name: string;
  };
  children: {
    full_name: string;
  };
}
