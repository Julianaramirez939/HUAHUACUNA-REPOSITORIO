
export interface DonacionesActualizar {
  id: number;
  name: string;
  email: string;
  identification_type: number;
   identification_type_name?: string;
  identification: string;
  date: string;          
  money_amount: number;
}