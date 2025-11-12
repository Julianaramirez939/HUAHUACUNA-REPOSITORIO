import { Estado } from "./estados";

// src/app/interfaces/donor.ts
export interface Donante {
id?:number;
  name: string;                 // obligatorio
  last_name?: string;           // opcional
  email?: string;               // opcional
  identification_type: number;
   identification_type_name: string;
  identification: string;       // obligatorio
  state_id: number;
  showMenu?: boolean;
  state?: Estado;      // obligatorio
}

