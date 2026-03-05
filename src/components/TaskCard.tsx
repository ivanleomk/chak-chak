import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'
import { useTaskEditor } from '../hooks/useTaskEditor'

interface TaskCardProps {
  _id: Id<'tasks'>
  title: string
  description: string
  comments?: string
  completed: boolean
}

export function TaskCard({ _id, title, description, comments, completed }: TaskCardProps) {
  const setCompleted = useMutation(api.tasks.setCompleted)
  const {
    editingId,
    editTitle, setEditTitle,
    editDescription, setEditDescription,
    editComments, setEditComments,
    startEditing, cancelEditing, saveEdit,
  } = useTaskEditor()
  const [commentDraft, setCommentDraft] = useState('')

  const isEditing = editingId === _id

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2 border rounded-md p-3">
        <input
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="border rounded-md px-3 py-2"
          placeholder="Title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          className="border rounded-md px-3 py-2 resize-y"
          placeholder="Description"
          rows={2}
        />
        <textarea
          value={editComments}
          onChange={(e) => setEditComments(e.target.value)}
          className="border rounded-md px-3 py-2 resize-y"
          placeholder="Comments"
          rows={2}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={saveEdit}
            className="border rounded-md px-4 py-1 text-sm"
          >
            Save
          </button>
          <button
            type="button"
            onClick={cancelEditing}
            className="border rounded-md px-4 py-1 text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked
          onChange={(event) => {
            void setCompleted({
              id: _id,
              completed: event.target.checked,
            })
          }}
          className="mt-1"
        />
        <span className="flex flex-col">
          <span className="line-through text-gray-600">{title}</span>
          {description ? (
            <span className="text-sm text-gray-500">{description}</span>
          ) : null}
          {comments ? (
            <span className="text-sm text-gray-500">Comments: {comments}</span>
          ) : null}
        </span>
        <button
          type="button"
          onClick={() => startEditing({ _id, title, description, comments })}
          className="text-sm text-blue-600 underline hover:no-underline shrink-0 ml-auto"
        >
          Edit
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={false}
        onChange={(event) => {
          const nextCompleted = event.target.checked
          if (!nextCompleted) return

          const trimmedComment = commentDraft.trim()
          void setCompleted({
            id: _id,
            completed: true,
            comments: trimmedComment,
          }).then(() => setCommentDraft(''))
        }}
        className="mt-1"
      />
      <span className="flex flex-col gap-2 flex-1">
        <span>{title}</span>
        {description ? (
          <span className="text-sm text-gray-600">{description}</span>
        ) : null}
        <textarea
          value={commentDraft}
          onChange={(event) => setCommentDraft(event.target.value)}
          placeholder="Comments when checking off..."
          rows={2}
          className="border rounded-md px-2 py-1 text-sm resize-y"
        />
      </span>
      <button
        type="button"
        onClick={() => startEditing({ _id, title, description, comments })}
        className="text-sm text-blue-600 underline hover:no-underline shrink-0"
      >
        Edit
      </button>
    </div>
  )
}
