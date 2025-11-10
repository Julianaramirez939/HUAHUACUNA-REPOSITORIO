export interface VoluntarioActualizar {
  id: number;                  // obligatorio para identificar al voluntario
  name: string;
  last_name: string;
  phone_number: string;
  email: string;
  identification_type: number;
  identification: string;
  profession: string;
  state_id: number;            // nuevo campo para actualizar estado
  attachment?: File;           // opcional
}
