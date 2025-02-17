import SkeletonCard from "components/SkeletonCard";

export default function Loading() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xxl:grid-cols-4 gap-6 pb-10">
      {Array.from({ length: 16 }).map((_, index) => (
        <SkeletonCard key={index} />
      ))}
    </div>
  );
}
