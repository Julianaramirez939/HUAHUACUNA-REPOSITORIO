//Interface para crear donacion
export interface CrearDonaciones {
  name: string;
  email: string;
  identification_type: number;
  identification: string;          
  money_amount: number;
}
