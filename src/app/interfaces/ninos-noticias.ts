import { NinoListar } from "./nino-listar";

export interface NinosNoticias {
  id: number;
  title: string;
  description: string;
  children: NinoListar[];
  attachment_url?: string | null;
  created_at: string;
  media_file_url?: string;
  updated_at: string;
}
