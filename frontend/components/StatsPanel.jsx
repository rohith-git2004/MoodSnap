"use client"

const moodOrder = ["happy", "neutral", "angry", "sad"]

function getMoodEmoji(mood) {
  switch (mood) {
    case "happy":
      return "😊"
    case "neutral":
      return "😐"
    case "angry":
      return "😡"
    case "sad":
      return "😢"
    default:
      return "🙂"
  }
}

export default function StatsPanel({ title, stats = {} }) {
  const items = moodOrder.map((mood) => ({
    mood,
    count: Number(stats[mood] || 0),
  }))

  const total = items.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <div className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
          Total Entries: {total}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.mood}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
          >
            <div className="text-3xl">{getMoodEmoji(item.mood)}</div>
            <p className="mt-3 text-sm capitalize text-slate-500">{item.mood}</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">{item.count}</p>
          </div>
        ))}
      </div>
    </div>
  )
}