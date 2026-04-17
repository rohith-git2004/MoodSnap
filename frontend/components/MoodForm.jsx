"use client"

import { useState } from "react"

const moods = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "neutral", emoji: "😐", label: "Neutral" },
  { value: "angry", emoji: "😡", label: "Angry" },
  { value: "sad", emoji: "😢", label: "Sad" },
]

export default function MoodForm({ onSubmitMood, loading = false }) {
  const [selectedMood, setSelectedMood] = useState("happy")
  const [note, setNote] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()

    await onSubmitMood({
      mood: selectedMood,
      note: note.trim(),
    })

    setSelectedMood("happy")
    setNote("")
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Mood Entry Form</h2>
      <p className="mt-1 text-slate-600">
        Select your mood and add an optional note
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label className="mb-3 block text-sm font-medium text-slate-700">
            Choose Mood
          </label>

          <div className="grid grid-cols-2 gap-3">
            {moods.map((item) => {
              const active = selectedMood === item.value

              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setSelectedMood(item.value)}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-300 bg-white text-slate-900 hover:border-slate-500"
                  }`}
                >
                  <div className="text-3xl">{item.emoji}</div>
                  <div className="mt-2 text-sm font-medium">{item.label}</div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Note
          </label>
          <textarea
            rows={4}
            placeholder="Add an optional note..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 outline-none focus:border-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-slate-900 py-3 font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save Entry"}
        </button>
      </form>
    </div>
  )
}