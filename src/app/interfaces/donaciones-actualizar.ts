import { Donaciones } from "./donaciones";

export interface DonacionesActualizar extends Donaciones {
  id: number;           // obligatorio al actualizar
}