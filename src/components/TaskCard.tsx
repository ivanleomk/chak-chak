import { useState, useRef, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import type { Id } from '../../convex/_generated/dataModel'

interface TaskCardProps {
  _id: Id<'tasks'>
  title: string
  description?: string
  comments?: string
  completed: boolean
}

export function TaskCard({ _id, title, description, comments, completed }: TaskCardProps) {
  const setCompleted = useMutation(api.tasks.setCompleted)
  const updateTask = useMutation(api.tasks.update)
  const removeTask = useMutation(api.tasks.remove)

  const [isEditing, setIsEditing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [commentDraft, setCommentDraft] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  useEffect(() => {
    if (!isExpanded) return
    const handler = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setIsExpanded(false)
        setCommentDraft('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isExpanded])

  const startEditing = () => {
    setEditTitle(title)
    setEditDescription(description)
    setIsEditing(true)
    setMenuOpen(false)
  }

  const cancelEditing = () => setIsEditing(false)

  const saveEdit = () => {
    if (!editTitle.trim()) return
    void updateTask({
      id: _id,
      title: editTitle,
      description: editDescription || "",
      comments,
    }).then(() => setIsEditing(false))
  }

  const handleDelete = () => {
    setMenuOpen(false)
    void removeTask({ id: _id })
  }

  // Editing state - inline expanded card
  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 p-5">
        <div className="flex items-start gap-4">
          <div className="shrink-0 w-7 h-7 mt-0.5 rounded-full border-2 border-violet-300 bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center">
            {completed && (
              <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-lg text-gray-700 dark:text-gray-200 bg-transparent outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 pb-2 border-b border-gray-200 dark:border-gray-700"
              placeholder="Task title..."
              autoFocus
            />
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="text-sm text-gray-500 dark:text-gray-400 bg-transparent outline-none placeholder:text-gray-300 dark:placeholder:text-gray-600 resize-none mt-1"
              placeholder="Add a description..."
              rows={3}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={cancelEditing}
            className="text-gray-400 text-sm hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveEdit}
            className="bg-violet-400 text-white rounded-full px-5 py-1.5 text-sm font-medium hover:bg-violet-500 transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    )
  }

  // Completed task - default & hover states
  if (completed) {
    return (
      <div className="flex items-center gap-4 bg-white/80 dark:bg-gray-900/80 rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-700/40 px-5 py-4 group">
        <button
          type="button"
          onClick={() => void setCompleted({ id: _id, completed: false })}
          className="shrink-0 w-7 h-7 rounded-full border-2 border-violet-300 bg-violet-50 dark:bg-violet-900/30 flex items-center justify-center hover:bg-violet-100 dark:hover:bg-violet-900/50 transition-colors"
        >
          <svg className="w-3.5 h-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </button>
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-gray-400 dark:text-gray-500 line-through">{title}</span>
          {description ? (
            <span className="text-sm text-gray-300 dark:text-gray-600">{description}</span>
          ) : null}
        </div>
        {/* Hover actions */}
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors p-1"
            title="More"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[120px]">
              <button
                type="button"
                onClick={startEditing}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Pending task – minimized by default, expands on click
  if (!isExpanded) {
    return (
      <div
        className="flex items-center gap-4 px-5 py-3 cursor-pointer group rounded-2xl hover:bg-white/60 dark:hover:bg-gray-800/60 transition-colors"
        onClick={() => setIsExpanded(true)}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            void setCompleted({ id: _id, completed: true })
          }}
          className="shrink-0 w-7 h-7 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-violet-400 transition-colors"
        />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-gray-700 dark:text-gray-200">{title}</span>
          {description ? (
            <span className="text-sm text-gray-400 dark:text-gray-500 truncate">{description}</span>
          ) : null}
        </div>
        {/* Hover actions */}
        <div className="relative opacity-0 group-hover:opacity-100 transition-opacity shrink-0" ref={menuRef}>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setMenuOpen(!menuOpen) }}
            className="text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 transition-colors p-1"
            title="More"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-10 min-w-[120px]">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); startEditing() }}
                className="w-full text-left px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleDelete() }}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Pending task – expanded
  return (
    <div ref={cardRef} className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 px-5 py-4">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={() => {
            const trimmedComment = commentDraft.trim()
            void setCompleted({
              id: _id,
              completed: true,
              comments: trimmedComment || undefined,
            }).then(() => {
              setCommentDraft('')
              setIsExpanded(false)
            })
          }}
          className="shrink-0 w-7 h-7 mt-0.5 rounded-full border-2 border-gray-300 dark:border-gray-600 hover:border-violet-400 transition-colors"
        />
        <div className="flex flex-col flex-1 min-w-0 gap-1">
          <span className="text-gray-700 dark:text-gray-200 font-medium">{title}</span>
          {description ? (
            <span className="text-sm text-gray-400 dark:text-gray-500">{description}</span>
          ) : null}
          <textarea
            value={commentDraft}
            onChange={(e) => setCommentDraft(e.target.value)}
            placeholder="Add a comment..."
            rows={1}
            className="border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-1.5 text-sm resize-none outline-none focus:border-violet-300 dark:focus:border-violet-500 transition-colors text-gray-500 dark:text-gray-400 placeholder:text-gray-300 dark:placeholder:text-gray-600 mt-1 field-sizing-content bg-transparent"
          />
        </div>
      </div>
    </div>
  )
}
