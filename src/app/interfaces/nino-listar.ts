import { EstadoNino } from './estado-nino';

export interface NinoListar {
  id: number;
  name: string;
  last_name: string;
  birth_date: string;
  fathers_name?: string;
  mothers_name?: string;
  school_grade: number;
  school_grade_name?: string;
  likings: string;
  additional_information?: string;
  media_file_url?: string;
  state: EstadoNino;  // 👈 ahora tiene el color, slug, etc.
  created_at?: string;
  updated_at?: string;
  showMenu?: boolean;
}
