export function LoadingIndicator({ label, className = "" }: { label: string; className?: string }) {
  return (
    <span role="status" className={`inline-flex items-center gap-3 ${className}`}>
      <span aria-hidden="true" className="inline-flex items-center gap-1">
        <span className="loading-dot bg-orange-500" />
        <span className="loading-dot bg-pink-500" />
        <span className="loading-dot bg-sky-500" />
      </span>
      <span>{label}</span>
    </span>
  );
}
