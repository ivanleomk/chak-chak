import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="flex flex-col gap-8 items-center text-center max-w-lg px-6">
        <div className="flex flex-col gap-3 items-center">
          <h1 className="text-6xl font-extrabold tracking-tight text-gray-900">
            Chak Chak
          </h1>
          <p className="text-xl text-gray-500">
            A task manager you can talk to.
          </p>
        </div>

        <ul className="flex flex-col gap-2 text-gray-600 text-sm text-left">
          <li>✦ Use natural language to create, update &amp; delete tasks</li>
          <li>✦ Track unlimited tasks over time</li>
        </ul>

        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-gray-700 active:scale-[0.98]"
        >
          Get started →
        </Link>
      </div>
    </main>
  )
}
