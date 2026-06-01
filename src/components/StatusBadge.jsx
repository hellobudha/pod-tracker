const STATUS = {
  liked:       { label: 'Liked',      display: '👍',         className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
  too_mild:    { label: 'Too Mild',   display: 'Too Mild',   className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
  too_strong:  { label: 'Too Strong', display: 'Too Strong', className: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' },
  yet_to_try:  { label: 'Yet to Try', display: 'Yet to Try', className: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' },
}

export default function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.yet_to_try

  if (status === 'liked') {
    return (
      <span
        className={`inline-flex items-center gap-0.5 text-xs font-medium pl-2 pr-2.5 py-0.5 rounded-full ${s.className}`}
        aria-label="Liked"
        title="Liked"
      >
        <span className="sb-thumb text-sm leading-none">👍</span>
        <span className="sb-sparkle text-[9px] leading-none">✨</span>
        <style>{`
          @keyframes sb-wiggle {
            0%, 70%, 100% { transform: rotate(0deg) scale(1); }
            78% { transform: rotate(-18deg) scale(1.18); }
            86% { transform: rotate(14deg) scale(1.18); }
            94% { transform: rotate(-6deg) scale(1.08); }
          }
          @keyframes sb-twinkle {
            0%, 70%, 100% { opacity: 0.5; transform: scale(0.85); }
            80% { opacity: 1; transform: scale(1.3) rotate(15deg); }
          }
          .sb-thumb {
            display: inline-block;
            transform-origin: 70% 90%;
            animation: sb-wiggle 2.8s ease-in-out infinite;
          }
          .sb-sparkle {
            display: inline-block;
            animation: sb-twinkle 2.8s ease-in-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .sb-thumb, .sb-sparkle { animation: none; }
          }
        `}</style>
      </span>
    )
  }

  return (
    <span
      className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}
      aria-label={s.label}
      title={s.label}
    >
      {s.display}
    </span>
  )
}
