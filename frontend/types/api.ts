import { UsersType } from "./supabase";

export interface AuthenticateResponse {
  success: boolean;
  token?: string;
  user?: UsersType;
  error?: string;
}

export type UpdateUserResponse =
  | {
      success: true;
      username: string;
      error?: never;
    }
  | {
      success: false;
      username?: never;
      error: string;
    };

export type UpdateUserInput = { username: string; id: number };
