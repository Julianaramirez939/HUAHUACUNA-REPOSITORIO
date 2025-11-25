export interface ActualizarPadrino {
  email: string;
  password?: string | null;
  password_confirmation?: string | null;
  state_id: number | null;
  name: string;
  last_name: string;
  phone_number: string;
  identification_type: number;
  identification: string;
  residence_country: string;
  attachment?: File | null;
}
