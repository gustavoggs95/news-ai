import { twMerge } from "tailwind-merge";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  optional?: boolean;
  wrapperClassName?: string;
}

export default function Input({
  label,
  optional,
  className,
  wrapperClassName = "flex flex-col space-y-2",
  ...props
}: InputProps) {
  const defaultClasses =
    "rounded-md cursor-text placeholder:opacity-25 border-gray-300 shadow-sm focus:outline-none px-2 py-2 text-white bg-flux-input-500 hover:bg-flux-input-400 placeholder:text-white/50 caret-white transition-colors";
  const mergedClasses = twMerge(defaultClasses, className);

  return (
    <div className={wrapperClassName}>
      {label && (
        <label htmlFor="title" className="font-medium text-gray-300">
          {label} {optional && <span className="font-thin text-gray-400">(Optional)</span>}
        </label>
      )}
      <input {...props} className={mergedClasses} />
    </div>
  );
}
