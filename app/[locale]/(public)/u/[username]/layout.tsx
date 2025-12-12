import type { ReactNode } from "react"

export default function UserProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0" />
      </div>

      <main className="relative z-10">
        {children}
      </main>
    </div>
  )
}