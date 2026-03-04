import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useAuthActions } from '@convex-dev/auth/react'
import { useConvexAuth } from 'convex/react'
import { useState } from 'react'

export const Route = createFileRoute('/signin')({
  component: SignInPage,
})

function SignInPage() {
  const { signIn } = useAuthActions()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const [isSigningIn, setIsSigningIn] = useState(false)

  if (isLoading) {
    return (
      <main className="min-h-screen grid place-items-center bg-slate-50 p-8">
        <p className="text-sm text-slate-600">Loading...</p>
      </main>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/tasks" />
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-100 p-8">
      <div className="pointer-events-none absolute -top-20 -left-20 h-72 w-72 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-amber-200/50 blur-3xl" />

      <section className="mx-auto grid min-h-[80vh] max-w-md place-items-center">
        <div className="w-full rounded-2xl border border-slate-200/80 bg-white/85 p-7 shadow-xl shadow-slate-300/20 backdrop-blur">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Sign in to manage your tasks.
          </p>

          <button
            type="button"
            onClick={() => {
              setIsSigningIn(true)
              void signIn('github', { redirectTo: '/tasks' }).catch(() => {
                setIsSigningIn(false)
              })
            }}
            disabled={isSigningIn}
            className="mt-6 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSigningIn ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing in...
              </>
            ) : (
              'Sign in with GitHub'
            )}
          </button>
        </div>
      </section>
    </main>
  )
}
