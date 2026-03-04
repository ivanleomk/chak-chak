import { Link, createFileRoute } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
})

function TasksPage() {
  const { data: tasks } = useSuspenseQuery(convexQuery(api.tasks.list, {}))

  return (
    <main className="p-8 flex flex-col gap-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold">Tasks</h1>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {tasks.map((task) => (
            <li key={task._id} className="border rounded-md p-4 flex flex-col gap-2">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p>{task.description}</p>
              <p className="text-sm">
                Status: {task.completed ? 'Completed' : 'Not completed'}
              </p>
            </li>
          ))}
        </ul>
      )}

      <Link to="/" className="text-blue-600 underline hover:no-underline">
        Back
      </Link>
    </main>
  )
}
