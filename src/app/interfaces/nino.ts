//Interface del niño (completo)
export interface Nino {
  state_id: number;
  name: string;
  last_name: string;
  birth_date: string; 
  fathers_name?: string;
  mothers_name?: string;
  school_grade: number; 
  likings: string;
  additional_information?: string;
  attachment: File; 

}
