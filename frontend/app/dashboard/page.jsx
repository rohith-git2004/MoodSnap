"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import MoodForm from "@/components/MoodForm"
import TimelineList from "@/components/TimelineList"
import StatsPanel from "@/components/StatsPanel"
import {
  createMoodEntry,
  deleteMoodEntry,
  getMoodEntries,
  getMoodStats,
  getUsersList,
} from "@/services/api"
import { clearStoredUser, getStoredUser } from "@/utils/auth"

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState({})
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedEntryId, setSelectedEntryId] = useState(null)
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [statusType, setStatusType] = useState("success")

  useEffect(() => {
    const storedUser = getStoredUser()

    if (!storedUser) {
      router.replace("/login")
      return
    }

    setUser(storedUser)
    fetchDashboardData(storedUser)
  }, [router])

  const fetchDashboardData = async (currentUser) => {
    try {
      setLoading(true)
      setError("")

      const [entriesData, statsData] = await Promise.all([
        getMoodEntries({
          userId: currentUser.userId,
          role: currentUser.role,
        }),
        getMoodStats({
          userId: currentUser.userId,
          role: currentUser.role,
        }),
      ])

      setEntries(Array.isArray(entriesData) ? entriesData : [])
      setStats(statsData || {})

      if (currentUser.role === "admin") {
        const usersData = await getUsersList({
          userId: currentUser.userId,
          role: currentUser.role,
        })
        setUsers(Array.isArray(usersData) ? usersData : [])
      } else {
        setUsers([])
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Failed to load dashboard data. Check backend."
      )
      setStatusType("error")
      setStatusModalOpen(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    clearStoredUser()
    router.push("/login")
  }

  const handleMoodSubmit = async ({ mood, note }) => {
    if (!user) return

    try {
      setSubmitting(true)
      setError("")
      setMessage("")

      await createMoodEntry({
        userId: user.userId,
        role: user.role,
        mood,
        note,
      })

      setMessage("Mood saved successfully.")
      setStatusType("success")
      setStatusModalOpen(true)
      await fetchDashboardData(user)
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to save mood entry."
      )
      setStatusType("error")
      setStatusModalOpen(true)
    } finally {
      setSubmitting(false)
    }
  }

  const openDeleteModal = (id) => {
    if (!user || user.role !== "admin") return
    setSelectedEntryId(id)
    setDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    if (deleteLoading) return
    setDeleteModalOpen(false)
    setSelectedEntryId(null)
  }

  const closeStatusModal = () => {
    setStatusModalOpen(false)
    setMessage("")
    setError("")
  }

  const confirmDelete = async () => {
    if (!user || user.role !== "admin" || !selectedEntryId) return

    try {
      setDeleteLoading(true)
      setError("")
      setMessage("")

      await deleteMoodEntry(selectedEntryId, {
        userId: user.userId,
        role: user.role,
      })

      setMessage("Mood entry deleted successfully.")
      setStatusType("success")
      setStatusModalOpen(true)
      setDeleteModalOpen(false)
      setSelectedEntryId(null)
      await fetchDashboardData(user)
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Failed to delete mood entry."
      )
      setStatusType("error")
      setStatusModalOpen(true)
    } finally {
      setDeleteLoading(false)
    }
  }

  if (!user) return null

  const isAdmin = user.role === "admin"

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {isAdmin ? "Admin Dashboard" : "User Dashboard"}
            </h1>
            <p className="text-sm text-slate-600">
              Welcome, <span className="font-semibold">{user.username}</span> (
              <span className="capitalize">{user.role}</span>)
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800"
          >
            Logout
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-8">
        {!isAdmin ? (
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Add Mood Entry
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save your mood with a short note.
                </p>
              </div>

              <MoodForm onSubmitMood={handleMoodSubmit} loading={submitting} />
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Personal Mood Statistics
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Overview of your recent mood activity.
                </p>
              </div>

              <StatsPanel title="" stats={stats} />
            </div>

            <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent Mood Entries
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Your last 10 saved mood records.
                </p>
              </div>

              <TimelineList
                title=""
                entries={entries}
                loading={loading}
                showDelete={false}
              />
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md lg:col-span-2">
                <StatsPanel title="Global Mood Statistics" stats={stats} />
              </div>

              <div className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
                <h2 className="mb-3 text-lg font-bold text-slate-900">
                  Basic User List
                </h2>

                {loading ? (
                  <p className="text-slate-500">Loading users...</p>
                ) : users.length === 0 ? (
                  <p className="text-slate-500">No users found</p>
                ) : (
                  <div className="space-y-2">
                    {users.map((item) => (
                      <div
                        key={item._id || item.userId || `${item.username}-${item.role}`}
                        className="rounded-lg border px-3 py-2 transition hover:bg-slate-50"
                      >
                        <p className="font-medium text-slate-900">{item.username}</p>
                        <p className="text-xs capitalize text-slate-600">{item.role}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md">
              <TimelineList
                title="All Mood Entries"
                entries={entries}
                loading={loading}
                showDelete={true}
                onDelete={openDeleteModal}
              />
            </div>
          </>
        )}
      </section>

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/40 bg-white/90 p-6 shadow-2xl backdrop-blur-xl">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-slate-900">
                Delete Mood Entry
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Are you sure you want to delete this mood entry? This action
                cannot be undone.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                onClick={closeDeleteModal}
                disabled={deleteLoading}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {statusModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 backdrop-blur-sm">
    <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
      <div className="flex flex-col items-center text-center">
        <div
          className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${
            statusType === "success" ? "bg-green-100" : "bg-red-100"
          }`}
        >
          {statusType === "success" ? (
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6l-12 12"
              />
            </svg>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900">
          {statusType === "success" ? "Success" : "Error"}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {statusType === "success" ? message : error}
        </p>

        <button
          onClick={closeStatusModal}
          className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-medium text-white transition ${
            statusType === "success"
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          OK
        </button>
      </div>
    </div>
  </div>
)}
    </main>
  )
}