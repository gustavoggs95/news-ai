import { CardRank } from "config/types";
import { CommentsType, UsersType } from "./supabase";

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
      news: GetNewsData;
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

export interface DecodedAuthJwt {
  publicKey: string;
  iat: number;
  exp: number;
  user_id: number;
}
export type GetNewsData = {
  id: number;
  title: string;
  locked: boolean;
  rank: CardRank;
  thumbnail_url: string;
  icon_url: string;
  content: string;
  created_at: string;
  is_purchased: boolean;
  source: string;
  url: string;
  price?: number;
  views: number;
  author_wallet_address: string;
  is_own: boolean;
  username: string;
  vote_type: string;
};

export type GetNewsResponse =
  | {
      success: true;
      news: GetNewsData[];
      error?: never;
    }
  | {
      success: false;
      news?: GetNewsData[];
      error: string;
    };
