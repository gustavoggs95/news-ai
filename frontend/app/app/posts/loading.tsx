import { PurchaseSkeleton } from "components/PurchaseSkeleton";

export default function Loading() {
  return (
    <div className="text-gray-100">
      <div className="container mx-auto py-10 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">My Posts</h1>
          <p className="text-gray-400 mt-2">View your created news posts and details.</p>
        </div>
        <PurchaseSkeleton />
      </div>
    </div>
  );
}
