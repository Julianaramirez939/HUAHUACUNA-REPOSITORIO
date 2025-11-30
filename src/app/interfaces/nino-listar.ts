import { EstadoNino } from './estado-nino';
//Interface del niño (listar)
export interface NinoListar {
  id: number;
  name: string;
  last_name: string;
  full_name?: string;
  birth_date: string;
  fathers_name?: string;
  mothers_name?: string;
  school_grade: number;
  school_grade_name?: string;
  likings: string;
  additional_information?: string;
  media_file_url?: string;
  state: EstadoNino; 
  created_at?: string;
  updated_at?: string;
  showMenu?: boolean;
}
