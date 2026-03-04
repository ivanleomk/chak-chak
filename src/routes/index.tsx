import { createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { useAuthActions } from '@convex-dev/auth/react'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const { signIn, signOut } = useAuthActions()
  const { data: currentUser } = useSuspenseQuery(convexQuery(api.users.current, {}))

  // const addNumber = useMutation(api.myFunctions.addNumber)

  return (
    <main className="p-8 flex flex-col gap-16">
      <h1 className="text-4xl font-bold text-center">
        Convex + Tanstack Start
      </h1>
      <div className="flex flex-col gap-8 max-w-lg mx-auto">
        {currentUser ? (
          <div className="flex flex-col gap-3">
            <p className="text-center">
              Signed in as{' '}
              {currentUser.name ?? currentUser.email ?? currentUser._id}
              {JSON.stringify(currentUser)}
            </p>
            <button onClick={() => void signOut()}>Sign out</button>
          </div>
        ) : (
          <button onClick={() => void signIn('github')}>
            Sign in with GitHub
          </button>
        )}
      </div>
    </main>
  )
}
