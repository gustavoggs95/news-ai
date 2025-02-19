// export interface NewsCardProps {
//   index?: number | string;
//   newsData: NewsData;
// }
import { GetNewsData } from "types/api";

export interface NewsCardProps {
  index?: number | string;
  newsData: GetNewsData;
  updateNews: (news: GetNewsData, parameters: Partial<GetNewsData>) => void;
}

export interface NewsVoteProps {
  newsData: GetNewsData;
  updateNews?: (news: GetNewsData, parameters: Partial<GetNewsData>) => void;
  isModal: boolean;
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
  Rising = "Rising",
  Popular = "Popular",
  Trending = "Trending",
  Elite = "Elite",
}
