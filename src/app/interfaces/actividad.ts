import { Estado } from "./estados";
import { ProgramType } from "./program-type";
//Interface de una actividad (listar)
export interface Actividad {
  id?: number;
  state: Estado;
  state_id?: number;
  name: string;
  description: string;
  datetime?: string | null;
  date?: string;     
  hour?: string;     
  location?: string | null;
  program_type: ProgramType;
  program_type_name?:string;
  price?: number | null;
  observation?: string | null;
  attachment?: File | string | null;
  showMenu?: boolean;
media_file_url?: string;
}
