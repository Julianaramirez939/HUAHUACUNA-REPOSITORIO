//Interface para actualizar un voluntario 
export interface VoluntarioActualizar {
  id: number;
  name: string;
  last_name: string;
  phone_number: string;
  email: string;
  identification_type: number;
  identification: string;
  profession: string;
  state_id: number;
  attachment?: File;
}
