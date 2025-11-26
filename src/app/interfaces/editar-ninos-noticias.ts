export interface EditarNinosNoticias {
  id: number;
  title: string;
  description: string;
  children_ids: number[];   // IDs de los niños seleccionados
  attachment?: File | null; // archivo opcional para subir
  media_file_url?: string;
  created_at: string;
  updated_at: string;
}