export default function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path d="M16 4h16l-4 18h-8z" fill="#c9972b" /><path d="M20 22l-6 20 10-6 10 6-6-20z" fill="#1f8a8a" />
      <circle cx="24" cy="30" r="6" fill="#1b2a4a" />
    </svg>
  );
}
