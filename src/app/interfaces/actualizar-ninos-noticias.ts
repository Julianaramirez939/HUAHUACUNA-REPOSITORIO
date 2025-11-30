//Interface para actualizar la noticia de los niños
export interface ActualizarNinosNoticias {
  title: string;
  description: string;
  children_ids: number[];
  attachment?: File | null;
}
