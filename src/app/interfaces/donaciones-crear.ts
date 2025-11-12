export interface DonacionesCrear {
  money_amount: number;
  date: string;
  donor_id: number;
  donation_method: number;
  observation?: string;
}
