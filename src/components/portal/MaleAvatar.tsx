export const MaleAvatar = ({ size = 'h-10 w-10' }: { size?: string }) => (
  <span
    className={`${size} inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-700`}
    aria-label="Student profile avatar"
  >
    <svg viewBox="0 0 48 48" className="h-full w-full" role="img" aria-label="Male student avatar">
      <circle cx="24" cy="24" r="24" fill="#dbeafe" />
      <path d="M12 43c1.9-8.1 6.4-12 12-12s10.1 3.9 12 12" fill="#1e40af" />
      <circle cx="24" cy="21" r="8" fill="#f4c7a1" />
      <path
        d="M16 20c.4-8.5 4.2-11.5 9.4-11.5 5.1 0 8.2 3.8 7.5 9.2-3.3-2.7-7.7-3.6-12.9-2.2z"
        fill="#334155"
      />
      <path
        d="M21 24.5c2 1.4 4 1.4 6 0"
        fill="none"
        stroke="#9a5d43"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  </span>
);
