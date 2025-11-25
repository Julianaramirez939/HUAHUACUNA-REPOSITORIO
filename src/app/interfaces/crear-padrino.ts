export interface CrearPadrino {
  email: string;
  password: string;
  password_confirmation: string;
  state_id?: number | null;
  name: string;
  last_name: string;
  phone_number: string;
  identification_type: number;
  identification: string;
  residence_country: string;
  attachment: File;
}
