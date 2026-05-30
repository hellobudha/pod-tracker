const STATUS = {
  liked:       { label: 'Liked',       className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' },
  too_mild:    { label: 'Too Mild',    className: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
  too_strong:  { label: 'Too Strong',  className: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' },
  yet_to_try:  { label: 'Yet to Try', className: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300' },
}

export default function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS.yet_to_try
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.className}`}>
      {s.label}
    </span>
  )
}
