interface LinkButtonProps {
  label: string;
  url: string;
  rotation?: number;
}

export default function LinkButton({ label, url, rotation = 0 }: LinkButtonProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="torn-edge block w-full max-w-md bg-paper px-6 py-4 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-center font-heading text-lg text-ink"
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      {label}
    </a>
  );
}
