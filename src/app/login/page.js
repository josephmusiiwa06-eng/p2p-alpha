import { login, signup } from './actions'

export default function LoginPage({ searchParams }) {
  const message = searchParams?.message

  return (
    <div className="flex items-center justify-center min-h-screen bg-base">
      <div className="card w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-primary font-bold">P2P Alpha</h1>
          <p>Zimbabwe ECD Quality Intelligence</p>
        </div>

        {message && (
          <div className="badge badge-danger mb-4 w-full justify-center p-2">
            {message}
          </div>
        )}

        <form className="flex-col gap-4">
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              className="form-input"
              id="email"
              name="email"
              type="email"
              placeholder="you@school.ac.zw"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              className="form-input"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex flex-col gap-2 mt-6">
            <button
              formAction={login}
              className="btn btn-primary w-full"
            >
              Log In
            </button>
            <button
              formAction={signup}
              className="btn btn-outline w-full"
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
