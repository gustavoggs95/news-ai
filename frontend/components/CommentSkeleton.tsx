export default function CommentSkeleton() {
  return (
    <div className="rounded-lg border border-slate-700 p-3 animate-pulse">
      <div className="flex items-center">
        <div className="h-16 w-16 rounded-full bg-slate-700 flex-none self-start"></div>
        <div className="flex flex-col ml-3 space-y-6 w-full">
          <div className="flex space-x-2 leading-none">
            <div className="h-5 w-24 bg-slate-700 rounded"></div>
            <div className="h-4 w-16 bg-slate-800 rounded"></div>
          </div>
          <div className="h-5 w-full bg-slate-700 rounded"></div>
          <div className="text-gray-300 flex space-x-5">
            <div className="h-5 w-10 bg-slate-700 rounded"></div>
            <div className="h-5 w-12 bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
