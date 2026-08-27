import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'

export function AppLayout({ children, user }) {
  const role = user?.user_metadata?.role || 'school_head'

  return (
    <div className="app-layout">
      <Sidebar role={role} />
      <div className="app-main">
        <Topbar user={user} />
        <main className="app-content bg-base">
          <div className="container">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
