export interface ActualizarNinosNoticias {
  title: string;
  description: string;
  children_ids: number[];
  attachment?: File | null;
}
