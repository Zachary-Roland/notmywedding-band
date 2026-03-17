interface LinkButtonProps {
  label: string;
  url: string;
  rotation?: number;
  className?: string;
}

export default function LinkButton({ label, url, rotation = 0, className = "" }: LinkButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`torn-paper block w-full max-w-md bg-paper px-6 py-4 text-center font-heading text-lg text-ink transition-all duration-200 ${className}`}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {label}
    </a>
  );
}
