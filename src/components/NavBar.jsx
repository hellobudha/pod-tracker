const TABS = [
  { id: 'collection', label: 'Collection', icon: '☕' },
  { id: 'reorder',    label: 'Reorder',    icon: '↻' },
  { id: 'settings',   label: 'Settings',   icon: '⚙' },
]

export default function NavBar({ active, onChange }) {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 flex z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(tab => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors
            ${active === tab.id ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <span className="text-xl leading-none">{tab.icon}</span>
          <span className="text-[10px] font-medium">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
