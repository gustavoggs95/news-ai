import { CardRank } from "config/types";

const getRankColor = (rank: CardRank) => {
  const rankColors: Record<CardRank, string> = {
    [CardRank.Basic]: "bg-green-800",
    [CardRank.Intermediate]: "bg-yellow-700",
    [CardRank.Advanced]: "bg-blue-800",
    [CardRank.Elite]: "bg-purple-800",
    [CardRank.Legendary]: "bg-red-800",
  };
  return rankColors[rank] || "bg-gray-800";
};

interface RankTagProps {
  rank: CardRank;
  className?: string; // Add className prop
}

export default function RankTag({ rank, className }: RankTagProps) {
  const baseClasses = "rounded-md w-fit px-2";
  const rankColor = getRankColor(rank);
  const combinedClasses = `${baseClasses} ${rankColor} ${className}`;

  return <div className={`${combinedClasses}`}>{rank}</div>;
}
