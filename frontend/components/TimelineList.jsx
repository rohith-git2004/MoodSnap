"use client"

function formatDate(value) {
  if (!value) return "No date"

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Invalid date"

  return date.toLocaleString()
}

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

export default function TimelineList({
  title,
  entries = [],
  loading = false,
  showDelete = false,
  onDelete,
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>

      {loading ? (
        <p className="mt-4 text-slate-500">Loading entries...</p>
      ) : entries.length === 0 ? (
        <p className="mt-4 text-slate-500">No mood entries found</p>
      ) : (
        <div className="mt-5 space-y-4">
          {entries.map((entry) => (
            <div
              key={entry._id || entry.id}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getMoodEmoji(entry.mood)}</span>
                    <div>
                      <p className="font-semibold capitalize text-slate-900">
                        {entry.mood}
                      </p>
                      <p className="text-sm text-slate-500">
                        {formatDate(entry.createdAt)}
                      </p>
                    </div>
                  </div>

                  {entry.username ? (
                    <p className="mt-3 text-sm text-slate-600">
                      User: <span className="font-medium">{entry.username}</span>
                    </p>
                  ) : null}

                  {entry.note ? (
                    <p className="mt-3 text-slate-700">{entry.note}</p>
                  ) : (
                    <p className="mt-3 italic text-slate-400">No note added</p>
                  )}
                </div>

                {showDelete ? (
                  <button
                    onClick={() => onDelete?.(entry._id || entry.id)}
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Delete
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}