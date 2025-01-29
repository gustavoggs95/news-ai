// export interface NewsCardProps {
//   index?: number | string;
//   newsData: NewsData;
// }
import { NewsType } from "types/supabase";

export interface NewsCardProps {
  index?: number | string;
  newsData: NewsType;
}

export interface NewsData {
  title: string;
  src: string;
  rank: CardRank;
  publishedAt: Date;
  locked?: boolean;
}

export enum CardRank {
  Basic = "Basic",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Elite = "Elite",
  Legendary = "Legendary",
}
