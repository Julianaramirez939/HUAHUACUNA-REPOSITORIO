import { State } from './state-interface';

export interface User {
  id: number;
  state_id: number;
  name: string;
  last_name: string;
  email: string;
  uuid: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  state: State;
}
