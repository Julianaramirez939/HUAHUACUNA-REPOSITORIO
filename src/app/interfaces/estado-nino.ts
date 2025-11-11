export interface EstadoNino {
  id: number;
  model_type: string; // 'children'
  name: string;       // Ej: 'Activo', 'Inactivo'
  slug: string;       // Ej: 'children_active'
  color: string;      // Ej: 'green', 'red'
  description: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
