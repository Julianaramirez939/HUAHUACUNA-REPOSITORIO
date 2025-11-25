import { Estado } from "./estados";
import { NinoListar } from "./nino-listar";

export interface Padrino {
  id?: number;
  email: string;
  password?: string | null;
  state_id?: number | null;
  name: string;
  last_name: string;
  phone_number: string;
  identification_type: number;
  identification_type_name?: string;
  identification: string;
  residence_country: string;
  attachment?: File;
  created_at?: string;
  media_file_url?: string;
  children?: NinoListar[];
  updated_at?: string;
}
