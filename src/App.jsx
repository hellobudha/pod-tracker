import { useState } from 'react'
import { usePods } from './hooks/usePods'
import { useTheme } from './hooks/useTheme'
import { usePrices } from './hooks/usePrices'
import PodCard from './components/PodCard'
import PodSheet from './components/PodSheet'
import CommandBar from './components/CommandBar'
import ReorderList from './components/ReorderList'
import NavBar from './components/NavBar'

const CATEGORY_LABELS = {
  espresso: 'Espresso',
  double_espresso: 'Double Espresso',
  gran_lungo: 'Gran Lungo',
  coffee: 'Coffee',
}

function CollectionView({ pods, onPodTap, onQuickUpdate }) {
  const categories = ['espresso', 'double_espresso', 'gran_lungo', 'coffee']

  if (pods.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500 px-8 text-center">
        <p className="text-4xl mb-3">☕</p>
        <p className="text-sm">No pods yet.</p>
        <p className="text-xs mt-1">Tap the ✨ button to add one by voice or text.</p>
      </div>
    )
  }

  return (
    <div className="px-4 pt-2 pb-4 space-y-5">
      {categories.map(cat => {
        const catPods = pods.filter(p => p.category === cat)
        if (catPods.length === 0) return null
        const tried = catPods.filter(p => p.status !== 'yet_to_try')
        const untried = catPods.filter(p => p.status === 'yet_to_try')
        return (
          <section key={cat}>
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              {CATEGORY_LABELS[cat]}
            </h2>

            {tried.length > 0 && (
              <div className="space-y-2 mb-2">
                {tried.map(pod => (
                  <PodCard key={pod.id} pod={pod} onClick={() => onPodTap(pod)} onQuickUpdate={onQuickUpdate} />
                ))}
              </div>
            )}

            {untried.length > 0 && (
              <>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-1.5 mt-3">
                  Yet to Try
                </p>
                <div className="space-y-2">
                  {untried.map(pod => (
                    <PodCard key={pod.id} pod={pod} onClick={() => onPodTap(pod)} onQuickUpdate={onQuickUpdate} />
                  ))}
                </div>
              </>
            )}
          </section>
        )
      })}
    </div>
  )
}

function StatsHeader({ pods }) {
  const tried = pods.filter(p => p.status !== 'yet_to_try').length
  const liked = pods.filter(p => p.status === 'liked').length
  const toTry = pods.filter(p => p.status === 'yet_to_try').length
  const stats = [
    { label: 'Tried', value: tried },
    { label: 'Liked', value: liked },
    { label: 'To Try', value: toTry },
  ]
  if (pods.length === 0) return null
  return (
    <div className="px-4 pt-3">
      <div className="grid grid-cols-3 gap-2">
        {stats.map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-800 rounded-2xl py-2.5 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 leading-none">{s.value}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

const THEMES = [
  { value: 'light',  label: 'Light' },
  { value: 'dark',   label: 'Dark' },
  { value: 'system', label: 'System' },
]

function SettingsView({ theme, setTheme, prices }) {
  const { state, summary, refreshPrices } = prices

  function resetData() {
    if (confirm('Reset all pod data to defaults?')) {
      localStorage.removeItem('pod-tracker-pods')
      window.location.reload()
    }
  }

  return (
    <div className="px-4 pt-4 pb-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Your Baseline</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-100">Black · Monkfruit powder · No milk · No sugar</p>
      </div>

      {/* Prices */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Nespresso Prices (US · USD)</p>
        <button
          type="button"
          onClick={refreshPrices}
          disabled={state === 'loading'}
          className="w-full bg-emerald-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-xl text-sm active:bg-emerald-600 transition-colors"
        >
          {state === 'loading' ? 'Matching…' : 'Match Nespresso prices'}
        </button>
        {state === 'done' && summary && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Priced {summary.matched} of {summary.total} pods from the catalog.
            {summary.matched < summary.total ? ' Unmatched pods can be priced manually.' : ''}
          </p>
        )}
        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
          Prices from the Nespresso US Vertuo catalog (per sleeve). Manual prices are kept.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 shadow-sm mb-4">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Appearance</p>
        <div className="flex gap-2">
          {THEMES.map(t => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTheme(t.value)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border-2 transition-all
                ${theme === t.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={resetData}
          className="w-full text-left px-4 py-3.5 text-sm text-red-500 font-medium active:bg-gray-50 dark:active:bg-gray-700"
        >
          Reset all data
        </button>
      </div>

      <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-6">Coffee Pod Tracker · Nespresso Vertuo</p>
    </div>
  )
}

export default function App() {
  const { pods, addPod, updatePod, deletePod } = usePods()
  const { theme, setTheme } = useTheme()
  const prices = usePrices({ pods, updatePod })
  const [tab, setTab] = useState('collection')
  const [sheet, setSheet] = useState(null)        // null | { pod } | { draft }
  const [commandOpen, setCommandOpen] = useState(false)

  function handleSave(form) {
    if (sheet?.pod) updatePod(sheet.pod.id, form)
    else addPod(form)
  }

  const tabTitles = { collection: 'My Pods', reorder: 'Reorder List', settings: 'Settings' }

  return (
    <div className="min-h-dvh flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-20">
        <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">{tabTitles[tab]}</h1>
        {tab === 'collection' && (
          <span className="text-xs text-gray-400 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
            Black · Monkfruit
          </span>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {tab === 'collection' && (
          <>
            <StatsHeader pods={pods} />
            <CollectionView
              pods={pods}
              onPodTap={pod => setSheet({ pod })}
              onQuickUpdate={updatePod}
            />
          </>
        )}
        {tab === 'reorder' && <ReorderList pods={pods} onUpdate={updatePod} />}
        {tab === 'settings' && <SettingsView theme={theme} setTheme={setTheme} prices={prices} />}
      </main>

      {/* FAB — command entry point */}
      {tab === 'collection' && (
        <button
          type="button"
          onClick={() => setCommandOpen(true)}
          aria-label="Quick command"
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] right-4 w-14 h-14 bg-emerald-500 text-white rounded-full shadow-lg text-2xl flex items-center justify-center active:scale-95 transition-transform z-30"
        >
          ✨
        </button>
      )}

      <NavBar active={tab} onChange={setTab} />

      {commandOpen && (
        <CommandBar
          pods={pods}
          addPod={addPod}
          updatePod={updatePod}
          onClose={() => setCommandOpen(false)}
          onAddManually={() => { setCommandOpen(false); setSheet({ draft: {} }) }}
          onEditPod={({ pod, draft }) => { setCommandOpen(false); setSheet(pod ? { pod } : { draft }) }}
        />
      )}

      {sheet !== null && (
        <PodSheet
          pod={sheet.pod}
          draft={sheet.draft}
          onSave={handleSave}
          onDelete={deletePod}
          onClose={() => setSheet(null)}
        />
      )}
    </div>
  )
}
