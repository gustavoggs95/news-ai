export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      comments: {
        Row: {
          content: string;
          created_at: string | null;
          id: number;
          news_id: number | null;
          user_id: number | null;
        };
        Insert: {
          content: string;
          created_at?: string | null;
          id?: never;
          news_id?: number | null;
          user_id?: number | null;
        };
        Update: {
          content?: string;
          created_at?: string | null;
          id?: never;
          news_id?: number | null;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "comments_news_id_fkey";
            columns: ["news_id"];
            isOneToOne: false;
            referencedRelation: "news";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "comments_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      news: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: number;
          locked: boolean | null;
          rank: string;
          thumbnail_url: string | null;
          title: string;
          url: string | null;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: never;
          locked?: boolean | null;
          rank?: string;
          thumbnail_url?: string | null;
          title: string;
          url?: string | null;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: never;
          locked?: boolean | null;
          rank?: string;
          thumbnail_url?: string | null;
          title?: string;
          url?: string | null;
        };
        Relationships: [];
      };
      transactions: {
        Row: {
          amount: number;
          id: number;
          news_id: number | null;
          transaction_date: string | null;
          user_id: number | null;
        };
        Insert: {
          amount: number;
          id?: never;
          news_id?: number | null;
          transaction_date?: string | null;
          user_id?: number | null;
        };
        Update: {
          amount?: number;
          id?: never;
          news_id?: number | null;
          transaction_date?: string | null;
          user_id?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "transactions_news_id_fkey";
            columns: ["news_id"];
            isOneToOne: false;
            referencedRelation: "news";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      users: {
        Row: {
          created_at: string | null;
          id: number;
          public_key: string | null;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          created_at?: string | null;
          id?: never;
          public_key?: string | null;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          created_at?: string | null;
          id?: never;
          public_key?: string | null;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      votes: {
        Row: {
          created_at: string | null;
          id: number;
          news_id: number | null;
          user_id: number | null;
          vote_type: string;
        };
        Insert: {
          created_at?: string | null;
          id?: never;
          news_id?: number | null;
          user_id?: number | null;
          vote_type: string;
        };
        Update: {
          created_at?: string | null;
          id?: never;
          news_id?: number | null;
          user_id?: number | null;
          vote_type?: string;
        };
        Relationships: [
          {
            foreignKeyName: "votes_news_id_fkey";
            columns: ["news_id"];
            isOneToOne: false;
            referencedRelation: "news";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "votes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      binary_quantize:
        | {
            Args: {
              "": string;
            };
            Returns: unknown;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: unknown;
          };
      halfvec_avg: {
        Args: {
          "": number[];
        };
        Returns: unknown;
      };
      halfvec_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      halfvec_send: {
        Args: {
          "": unknown;
        };
        Returns: string;
      };
      halfvec_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
      hnsw_bit_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      hnsw_halfvec_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      hnsw_sparsevec_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      hnswhandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflat_bit_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflat_halfvec_support: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      ivfflathandler: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      l2_norm:
        | {
            Args: {
              "": unknown;
            };
            Returns: number;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: number;
          };
      l2_normalize:
        | {
            Args: {
              "": string;
            };
            Returns: string;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: unknown;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: unknown;
          };
      sparsevec_out: {
        Args: {
          "": unknown;
        };
        Returns: unknown;
      };
      sparsevec_send: {
        Args: {
          "": unknown;
        };
        Returns: string;
      };
      sparsevec_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
      vector_avg: {
        Args: {
          "": number[];
        };
        Returns: string;
      };
      vector_dims:
        | {
            Args: {
              "": string;
            };
            Returns: number;
          }
        | {
            Args: {
              "": unknown;
            };
            Returns: number;
          };
      vector_norm: {
        Args: {
          "": string;
        };
        Returns: number;
      };
      vector_out: {
        Args: {
          "": string;
        };
        Returns: unknown;
      };
      vector_send: {
        Args: {
          "": string;
        };
        Returns: string;
      };
      vector_typmod_in: {
        Args: {
          "": unknown[];
        };
        Returns: number;
      };
    };
    Enums: {
      enum_news_rank: "Basic" | "Intermediate" | "Advanced" | "Elite" | "Legendary";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"]) | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    ? (PublicSchema["Tables"] & PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends keyof PublicSchema["Tables"] | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends keyof PublicSchema["Enums"] | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"] | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export type NewsType = Database["public"]["Tables"]["news"]["Row"];
export type UsersType = Database["public"]["Tables"]["users"]["Row"];
export type CommentsType = Database["public"]["Tables"]["comments"]["Row"];
export type TransactionsType = Database["public"]["Tables"]["transactions"]["Row"];
export type VotesType = Database["public"]["Tables"]["votes"]["Row"];
