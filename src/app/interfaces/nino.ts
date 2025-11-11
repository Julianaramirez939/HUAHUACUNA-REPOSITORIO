export interface Nino {
  state_id: number;
  name: string;
  last_name: string;
  birth_date: string; // formato YYYY-MM-DD
  fathers_name?: string;
  mothers_name?: string;
  school_grade: number; // según SchoolGradeEnum en backend
  likings: string;
  additional_information?: string;
  attachment: File; // imagen obligatoria al crear

}
