export function SocialIcon({ path, className }: { path: string; className: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className={`${className} fill-current`}>
      <path d={path} />
    </svg>
  );
}
