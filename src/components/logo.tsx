export function LogoMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M15.5 8.5L13 13L8.5 15.5L11 11L15.5 8.5Z"
        fill="currentColor"
      />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function Logo({
  className = "",
  markClassName = "h-6 w-6 text-brand-600",
  textClassName = "text-lg font-semibold tracking-tight text-zinc-900",
}: {
  className?: string;
  markClassName?: string;
  textClassName?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark className={markClassName} />
      <span className={textClassName}>
        Werk<span className="text-brand-600">lotse</span>
      </span>
    </span>
  );
}
