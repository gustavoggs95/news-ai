// export interface NewsCardProps {
//   index?: number | string;
//   newsData: NewsData;
// }
import { GetNewsData } from "types/api";

export interface NewsCardProps {
  index?: number | string;
  newsData: GetNewsData;
  updateNews: (news: GetNewsData) => void;
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
