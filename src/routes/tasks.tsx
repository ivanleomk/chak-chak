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
    <main className="min-h-screen bg-gray-100/60 p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-8">
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={() => {
              void signOut().then(() => navigate({ to: '/' }))
            }}
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
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
          className="relative"
        >
          <div className="flex items-center bg-white rounded-2xl shadow-sm border border-gray-200/60 px-5 py-4">
            {isCreating ? (
              <svg className="animate-spin h-5 w-5 text-gray-300 mr-4 shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <span className="text-gray-300 mr-4 text-xl font-light shrink-0">+</span>
            )}
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Quickly add a task..."
              className="flex-1 bg-transparent outline-none text-gray-600 placeholder:text-gray-300"
              disabled={isCreating}
            />
          </div>
        </form>

        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-300">Pending</h2>
          {pendingTasks.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-12 flex items-center justify-center">
              <p className="text-gray-300">No pending tasks. Enjoy your day!</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {pendingTasks.map((task) => (
                <li key={task._id}>
                  <TaskCard {...task} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-violet-300">Completed</h2>
          {completedTasks.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-2xl py-12 flex items-center justify-center">
              <p className="text-gray-300">No completed tasks yet.</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {completedTasks.map((task) => (
                <li key={task._id}>
                  <TaskCard {...task} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  )
}
