//Interface para crear una noticia del progreso de un niño
export interface CrearNinosNoticias {
  title: string;
  description: string;
  children_ids: number[];
  attachment?: File | null;
}
