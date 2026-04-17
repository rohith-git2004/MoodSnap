"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { loginUser } from "@/services/api"
import { getStoredUser, setStoredUser } from "@/utils/auth"

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [role, setRole] = useState("user")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = getStoredUser()
    if (user) router.replace("/dashboard")
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const trimmedUsername = username.trim()

    if (!trimmedUsername) {
      setError("Please enter your username")
      return
    }

    try {
      setLoading(true)

      const data = await loginUser({
        username: trimmedUsername,
        role,
      })

      setStoredUser(data)
      router.push("/dashboard")
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          "Login failed. Please check if backend is running."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(99,102,241,0.18),transparent_30%),linear-gradient(to_bottom_right,#020617,#0f172a,#111827)]" />

      <div className="absolute left-[-80px] top-[-80px] h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-[-100px] right-[-60px] h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />

      <div className="relative w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-white/8 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
        <div className="grid min-h-[640px] grid-cols-1 lg:grid-cols-2">
          <div className="relative hidden lg:flex flex-col justify-between overflow-hidden border-r border-white/10 bg-white/5 p-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80 backdrop-blur-md">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Mood Tracking System
              </div>

              <div className="mt-16 max-w-md">
                <h1 className="text-5xl font-bold leading-tight text-white">
                  Welcome to
                  <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-indigo-400 bg-clip-text text-transparent">
                    MoodSnap
                  </span>
                </h1>

                <p className="mt-6 text-lg leading-8 text-slate-300">
                  Track moods, view insights, and manage entries with a clean
                  role-based dashboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition duration-300 hover:-translate-y-1">
                <div className="text-2xl">😊</div>
                <p className="mt-3 text-sm text-slate-300">Happy</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition duration-300 hover:-translate-y-1">
                <div className="text-2xl">😐</div>
                <p className="mt-3 text-sm text-slate-300">Neutral</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-md transition duration-300 hover:-translate-y-1">
                <div className="text-2xl">😢</div>
                <p className="mt-3 text-sm text-slate-300">Reflect</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-5 sm:p-8 lg:p-10">
            <div className="w-full max-w-md animate-[fadeUp_.6s_ease-out]">
              <div className="rounded-[28px] border border-white/10 bg-white p-6 shadow-2xl sm:p-8">
                <div className="flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-900 to-slate-700 text-3xl text-white shadow-lg shadow-slate-900/30 transition duration-300 hover:scale-105">
                    😊
                  </div>

                  <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    Sign in
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500 sm:text-base">
                    Enter your username and choose your role to continue
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Username
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. john"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition duration-200 focus:border-sky-500 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>

                  {error ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-[shake_.25s_ease-in-out_2]">
                      {error}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-3.5 text-base font-semibold text-white shadow-lg shadow-sky-500/20 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
      `}</style>
    </main>
  )
}