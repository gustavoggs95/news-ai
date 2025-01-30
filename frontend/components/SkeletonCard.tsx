export default function SkeletonCard() {
  return (
    <div className="rounded-md bg-slate-800 p-3 flex flex-col animate-pulse">
      <div className="flex justify-between items-center">
        <div className="rounded-md w-20 h-6 bg-slate-700"></div>
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
          <div className="w-6 h-6 bg-slate-700 rounded-full"></div>
        </div>
      </div>
      <div className="h-6 bg-slate-700 rounded-md my-3"></div>
      <div className="relative w-full h-48 bg-slate-700 rounded-md"></div>
      <div className="flex mt-3 justify-between items-center">
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-slate-700 rounded-md"></div>
          <div className="w-8 h-8 bg-slate-700 rounded-md"></div>
        </div>
        <div className="w-16 h-6 bg-slate-700 rounded-md"></div>
      </div>
    </div>
  );
}
