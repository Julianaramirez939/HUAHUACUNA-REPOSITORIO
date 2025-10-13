import { User } from './user-interface';

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}
