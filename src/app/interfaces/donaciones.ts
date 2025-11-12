import { Donante } from "./donante";

export interface Donaciones {
  id?: number;               // optional, if creating
  donor_id: number;
  donor: Donante;
  donation_method: number;
  donation_method_name?: string;
  date: string;
  money_amount: number;
  observation?: string;
  showMenu?: boolean;
}
