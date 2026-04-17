export function getStoredUser() {
  if (typeof window === "undefined") return null

  const data = localStorage.getItem("user")
  if (!data) return null

  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function setStoredUser(user) {
  if (typeof window === "undefined") return
  localStorage.setItem("user", JSON.stringify(user))
}

export function clearStoredUser() {
  if (typeof window === "undefined") return
  localStorage.removeItem("user")
}