import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface TaskFields {
  _id: Id<'tasks'>
  title: string
  description: string
  comments?: string
}

export function useTaskEditor() {
  const updateTask = useMutation(api.tasks.update)
  const [editingId, setEditingId] = useState<Id<'tasks'> | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editComments, setEditComments] = useState('')

  const startEditing = (task: TaskFields) => {
    setEditingId(task._id)
    setEditTitle(task.title)
    setEditDescription(task.description)
    setEditComments(task.comments ?? '')
  }

  const cancelEditing = () => setEditingId(null)

  const saveEdit = () => {
    if (!editingId || !editTitle.trim() || !editDescription.trim()) return
    void updateTask({
      id: editingId,
      title: editTitle,
      description: editDescription,
      comments: editComments || undefined,
    }).then(() => setEditingId(null))
  }

  return {
    editingId,
    editTitle,
    setEditTitle,
    editDescription,
    setEditDescription,
    editComments,
    setEditComments,
    startEditing,
    cancelEditing,
    saveEdit,
  }
}
