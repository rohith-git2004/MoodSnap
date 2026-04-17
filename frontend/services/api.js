import axios from "axios"

const api = axios.create({
  baseURL: "https://moodsnap-8thy.onrender.com/api",
})

export async function loginUser(payload) {
  const response = await api.post("/auth/login", payload)
  return response.data
}

export async function createMoodEntry(payload) {
  const response = await api.post("/moods", payload)
  return response.data
}

export async function getMoodEntries({ userId, role }) {
  const response = await api.get("/moods", {
    params: { userId, role },
  })
  return response.data
}

export async function deleteMoodEntry(id, { userId, role }) {
  const response = await api.delete(`/moods/${id}`, {
    params: { userId, role },
  })
  return response.data
}

export async function getMoodStats({ userId, role }) {
  const response = await api.get("/stats", {
    params: { userId, role },
  })
  return response.data
}

export async function getUsersList({ userId, role }) {
  const response = await api.get("/auth/users", {
    params: { userId, role },
  })
  return response.data
}

export default api