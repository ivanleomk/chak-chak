import { Link, Navigate, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useConvexAuth, useMutation, useQuery } from 'convex/react'
import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
})

function TasksPage() {
  const { isAuthenticated, isLoading } = useConvexAuth()
  const { signOut } = useAuthActions()
  const navigate = useNavigate()
  const tasks = useQuery(api.tasks.list, isAuthenticated ? {} : 'skip') ?? []
  const createTask = useMutation(api.tasks.create)
  const setCompleted = useMutation(api.tasks.setCompleted)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [commentDrafts, setCommentDrafts] = useState<Record<string, string>>({})
  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks],
  )
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks],
  )

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
          const trimmedTitle = title.trim()
          const trimmedDescription = description.trim()
          if (!trimmedTitle || !trimmedDescription) return

          void createTask({
            title: trimmedTitle,
            description: trimmedDescription,
          }).then(() => {
            setTitle('')
            setDescription('')
          })
        }}
        className="flex flex-col gap-2"
      >
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Task title..."
          className="border rounded-md px-3 py-2"
        />
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Task description..."
          rows={3}
          className="border rounded-md px-3 py-2 resize-y"
        />
        <button type="submit" className="border rounded-md px-4 py-2 self-start">
          Add
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
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(event) => {
                      const nextCompleted = event.target.checked
                      if (!nextCompleted) {
                        void setCompleted({
                          id: task._id,
                          completed: false,
                        })
                        return
                      }

                      const comments = (commentDrafts[task._id] ?? '').trim()
                      void setCompleted({
                        id: task._id,
                        completed: true,
                        comments,
                      }).then(() => {
                        setCommentDrafts((current) => ({ ...current, [task._id]: '' }))
                      })
                    }}
                    className="mt-1"
                  />
                  <span className="flex flex-col gap-2 flex-1">
                    <span>{task.title}</span>
                    {task.description ? (
                      <span className="text-sm text-gray-600">{task.description}</span>
                    ) : null}
                    <textarea
                      value={commentDrafts[task._id] ?? ''}
                      onChange={(event) => {
                        const nextValue = event.target.value
                        setCommentDrafts((current) => ({
                          ...current,
                          [task._id]: nextValue,
                        }))
                      }}
                      placeholder="Comments when checking off..."
                      rows={2}
                      className="border rounded-md px-2 py-1 text-sm resize-y"
                    />
                  </span>
                </div>
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
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(event) => {
                      void setCompleted({
                        id: task._id,
                        completed: event.target.checked,
                      })
                    }}
                    className="mt-1"
                  />
                  <span className="flex flex-col">
                    <span className="line-through text-gray-600">{task.title}</span>
                    {task.description ? (
                      <span className="text-sm text-gray-500">{task.description}</span>
                    ) : null}
                    {task.comments ? (
                      <span className="text-sm text-gray-500">Comments: {task.comments}</span>
                    ) : null}
                  </span>
                </label>
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
