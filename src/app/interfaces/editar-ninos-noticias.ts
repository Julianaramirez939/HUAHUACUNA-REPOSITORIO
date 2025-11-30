//Interface para editar las noticias de los niños
export interface EditarNinosNoticias {
  id: number;
  title: string;
  description: string;
  children_ids: number[];   
  attachment?: File | null; 
  media_file_url?: string;
  created_at: string;
  updated_at: string;
}