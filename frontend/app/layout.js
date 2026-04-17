import "./globals.css"

export const metadata = {
  title: "MoodSnap",
  description: "Role-Based Mood Tracking System",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}