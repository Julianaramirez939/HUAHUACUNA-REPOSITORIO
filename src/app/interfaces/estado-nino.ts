//Interface de los estados de los niños
export interface EstadoNino {
  id: number;
  model_type: string;
  name: string;       
  slug: string;      
  color: string;      
  description: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
