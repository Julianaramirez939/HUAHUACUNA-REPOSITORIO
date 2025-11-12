import { Estado } from "./estados";
import { ProgramType } from "./program-type";

export interface Actividad {
  id?: number;
  state: Estado;
  state_id?: number;
  name: string;
  description: string;
  datetime?: string | null;
  date?: string;     // ✅ Fecha separada (ej: "12/11/2025")
  hour?: string;     // ✅ Hora separada (ej: "12:55")
  location?: string | null;
  program_type: ProgramType;
  program_type_name?:string;
  price?: number | null;
  observation?: string | null;
  attachment?: File | string | null;
  showMenu?: boolean;
media_file_url?: string;
}
