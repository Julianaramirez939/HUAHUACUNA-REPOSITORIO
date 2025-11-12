// src/app/interfaces/donor-actualizar.ts
export interface DonanteActualizar {
  id: number;                   // obligatorio
  name: string;                 // obligatorio
  last_name?: string;           // opcional
  email?: string;               // opcional
  identification_type: number;  // obligatorio
  identification: string;       // obligatorio
  state_id: number;
  showMenu?: boolean;           // obligatorio
}
