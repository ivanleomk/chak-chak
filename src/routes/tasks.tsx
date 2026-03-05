import { Link, Navigate, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useAction, useConvexAuth, useQuery } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '../../convex/_generated/api'
import { TaskCard } from '../components/TaskCard'

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
})

function TasksPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const pendingTasks = useQuery(api.tasks.list, isAuthenticated ? { status: 'pending' as const } : 'skip') ?? []
  const completedTasks = useQuery(api.tasks.list, isAuthenticated ? { status: 'completed' as const } : 'skip') ?? []
  const createTask = useAction(api.tasks.create)
  const [input, setInput] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  if (isLoading) {
    return <main className="p-8">Loading...</main>
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" />
  }

  return (
    <main className="p-8 flex flex-col gap-8 max-w-2xl mx-auto">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">Tasks</h1>
        <button
          type="button"
          onClick={() => {
            void signOut().then(() => navigate({ to: '/' }))
          }}
          className="border rounded-md px-4 py-2"
        >
          Log out
        </button>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          const trimmed = input.trim()
          if (!trimmed || isCreating) return

          setIsCreating(true)
          void createTask({ input: trimmed })
            .then(() => setInput(''))
            .finally(() => setIsCreating(false))
        }}
        className="flex gap-2"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Describe your task..."
          className="border rounded-md px-3 py-2 flex-1"
          disabled={isCreating}
        />
        <button type="submit" className="border rounded-md px-4 py-2 disabled:opacity-50" disabled={isCreating}>
          {isCreating ? (
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            'Add'
          )}
        </button>
      </form>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Pending</h2>
        {pendingTasks.length === 0 ? (
          <p className="text-sm text-gray-600">No pending tasks.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {pendingTasks.map((task) => (
              <li key={task._id}>
                <TaskCard {...task} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-semibold">Completed</h2>
        {completedTasks.length === 0 ? (
          <p className="text-sm text-gray-600">No completed tasks.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {completedTasks.map((task) => (
              <li key={task._id}>
                <TaskCard {...task} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <Link to="/" className="text-blue-600 underline hover:no-underline">
        Back
      </Link>
    </main>
  )
}
