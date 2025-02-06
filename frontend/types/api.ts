import { NextApiRequest, NextApiResponse } from "next";
import { CommentsType, NewsType, UsersType } from "./supabase";

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

export type OneNewsResponse =
  | {
      success: true;
      news: NewsType;
      error?: never;
    }
  | {
      success: false;
      news?: never;
      error: string;
    };

export type ListCommentsResponse =
  | {
      success: true;
      comments: CommentsType[];
      error?: never;
    }
  | {
      success: false;
      comments?: CommentsType[];
      error: string;
    };

export type UpdateUserInput = { username: string; id: number };
export type AddCommentInput = { user_id: number; news_id: number; content: string; parent_id?: number };

export interface AuthVerifierType {
  req: NextApiRequest;
  res: NextApiResponse;
}

export interface DecodedAuthJwt {
  publicKey: string;
  iat: number;
  exp: number;
  user_id: number;
}
