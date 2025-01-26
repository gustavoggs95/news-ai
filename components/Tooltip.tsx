export default function Tooltip({ children, text }: { children: React.ReactNode; text?: string }) {
  return (
    <div className="relative group w-fit">
      {children}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden w-max whitespace-nowrap rounded bg-black/30 backdrop-blur-sm text-white text-sm px-3 py-2 shadow-lg group-hover:block">
        {text}
      </div>
    </div>
  );
}
