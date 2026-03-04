import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
})

function TasksPage() {
  const tasks = useQuery(api.tasks.list, {}) ?? []
  const createTask = useMutation(api.tasks.create)
  const setCompleted = useMutation(api.tasks.setCompleted)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const pendingTasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks],
  )
  const completedTasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks],
  )

  return (
    <main className="p-8 flex flex-col gap-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold">Tasks</h1>
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
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Task description..."
          className="border rounded-md px-3 py-2"
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
          <ul className="flex flex-col gap-2">
            {pendingTasks.map((task) => (
              <li key={task._id}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(event) => {
                      void setCompleted({
                        id: task._id,
                        completed: event.target.checked,
                      })
                    }}
                  />
                  <span>{task.title}</span>
                  {task.description ? (
                    <span className="text-sm text-gray-600">({task.description})</span>
                  ) : null}
                </label>
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
          <ul className="flex flex-col gap-2">
            {completedTasks.map((task) => (
              <li key={task._id}>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={(event) => {
                      void setCompleted({
                        id: task._id,
                        completed: event.target.checked,
                      })
                    }}
                  />
                  <span className="line-through text-gray-600">{task.title}</span>
                  {task.description ? (
                    <span className="text-sm text-gray-500">({task.description})</span>
                  ) : null}
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
