export interface Voluntario {

  name: string;
  last_name: string;
  phone_number: string;
  email: string;
  identification_type: number;
  identification: string;
  profession: string;
  attachment: File; // el archivo directamente
}
