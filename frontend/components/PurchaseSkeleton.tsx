"use client";

export function PurchaseSkeleton() {
  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="min-w-full divide-y divide-slate-600 table-fixed">
        <thead className="bg-slate-800">
          <tr>
            <th className="w-1/3 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">
              Article
            </th>
            <th className="w-1/4 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">
              Seller
            </th>
            <th className="w-1/5 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">
              Date
            </th>
            <th className="w-1/4 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">
              Transaction
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700 bg-slate-800">
          {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="animate-pulse">
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col gap-1">
                  <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/4 mt-2"></div>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
