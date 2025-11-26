export interface CrearNinosNoticias {
  title: string;
  description: string;
  children_ids: number[];   // IDs de los niños seleccionados
  attachment?: File | null; // imagen opcional (jpg, jpeg, png)
}
