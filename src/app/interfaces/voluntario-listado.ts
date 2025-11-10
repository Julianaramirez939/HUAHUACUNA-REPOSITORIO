
export interface VoluntarioListado {
  id: number;
  name: string;
  last_name: string;
  phone_number: string;
  email: string;
  identification_type: number;
  identification: string;
  profession: string;
  state: {
    id: number;
    model_type: string;
    name: string;
    slug: string;
    color: string;
    description: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
  };
  identification_type_name: string;
  media_file_url: string;
}
