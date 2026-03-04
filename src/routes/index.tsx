import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="min-h-screen p-8 flex items-center justify-center">
      <div className="flex flex-col gap-4 items-center text-center">
        <h1 className="text-5xl font-bold">Chak Chak</h1>
        <p className="text-lg text-gray-600">a minimal todolist</p>
        <Link to="/tasks" className="text-blue-600 underline hover:no-underline">
          Open tasks
        </Link>
      </div>
    </main>
  )
}
