import { useState, useEffect, useRef } from 'react'
import TodoInput from './components/TodoInput.jsx'
import TodoItem from './components/TodoItem.jsx'
import TodoFooter from './components/TodoFooter.jsx'
import { getGreeting, getCompletionPhrase } from './utils/greeting.js'
import { findTask, getSubtreeDepth, isInSubtree, removeTask, insertTask, sortForDisplay, migrate } from './utils/tasks.js'
import { DragContext } from './context/DragContext.jsx'

const MAX_DEPTH = 2 // 0-indexed: root=0, child=1, grandchild=2

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try { return migrate(JSON.parse(localStorage.getItem('tasks')) ?? []) } catch { return [] }
  })
  const [filter, setFilter] = useState('all')
  const [completionPhrase, setCompletionPhrase] = useState('')
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const [drag, setDrag] = useState({ id: null, overId: null, pos: null })
  const phraseTimer = useRef(null)
  const greeting = useRef(getGreeting()).current

  useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)) }, [tasks])
  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  function addTask(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks(prev => [...prev, { id: crypto.randomUUID(), text: trimmed, completed: false, completedAt: null, children: [] }])
  }

  function toggleTask(id) {
    const task = findTask(tasks, id)
    const willComplete = task && !task.completed
    if (willComplete) {
      clearTimeout(phraseTimer.current)
      setCompletionPhrase(getCompletionPhrase())
      phraseTimer.current = setTimeout(() => setCompletionPhrase(''), 1800)
    }
    function toggle(list) {
      return list.map(t => {
        if (t.id === id) {
          const completed = !t.completed
          return { ...t, completed, completedAt: completed ? Date.now() : null }
        }
        return { ...t, children: toggle(t.children) }
      })
    }
    setTasks(toggle)
  }

  function deleteTask(id) {
    setTasks(prev => { const [next] = removeTask(prev, id); return next })
  }

  function clearCompleted() {
    function strip(list) {
      return list.filter(t => !t.completed).map(t => ({ ...t, children: strip(t.children) }))
    }
    setTasks(strip)
  }

  function onDragStart(id) {
    setDrag({ id, overId: null, pos: null })
  }

  function onDragOver(e, targetId, targetDepth) {
    e.preventDefault()
    const { id: draggingId } = drag
    if (!draggingId || isInSubtree(tasks, draggingId, targetId)) return

    const rect = e.currentTarget.getBoundingClientRect()
    const pct = (e.clientY - rect.top) / rect.height
    const draggingTask = findTask(tasks, draggingId)
    const subDepth = draggingTask ? getSubtreeDepth(draggingTask) : 0
    const canNest = targetDepth + 1 + subDepth <= MAX_DEPTH

    const pos = canNest && pct >= 0.33 && pct <= 0.67 ? 'child'
      : pct < 0.5 ? 'before' : 'after'

    setDrag(s => s.overId === targetId && s.pos === pos ? s : { ...s, overId: targetId, pos })
  }

  function onDrop(e, targetId) {
    e.preventDefault()
    const { id: draggingId, pos } = drag
    if (!draggingId || !pos) { onDragEnd(); return }
    setTasks(prev => {
      const [without, dragged] = removeTask(prev, draggingId)
      if (!dragged) return prev
      return insertTask(without, dragged, targetId, pos)
    })
    onDragEnd()
  }

  function onDragEnd() {
    setDrag({ id: null, overId: null, pos: null })
  }

  const sorted = sortForDisplay(tasks)
  const displayTasks = sorted.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = tasks.filter(t => !t.completed).length
  const hasCompleted = tasks.some(t => t.completed)

  return (
    <DragContext.Provider value={{ drag, onDragStart, onDragOver, onDrop, onDragEnd }}>
      <div className={`app${drag.id ? ' app--dragging' : ''}`}>
        <header className="app-header">
          <div className="app-title-row">
            <h1 className="app-title">todos</h1>
            <span className={`completion-phrase${completionPhrase ? ' completion-phrase--visible' : ''}`}>
              {completionPhrase}
            </span>
            <button className="theme-toggle" onClick={() => setDark(d => !d)}>
              {dark ? 'light' : 'dark'}
            </button>
          </div>
          <p className="app-greeting">{greeting}</p>
          <TodoInput onAdd={addTask} />
        </header>

        <main
          className="app-main"
          onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) onDragEnd() }}
        >
          {displayTasks.length === 0 ? (
            <p className="empty-state">
              {filter === 'completed' ? 'No completed tasks.' : filter === 'active' ? 'Nothing left to do.' : 'Add a task above.'}
            </p>
          ) : (
            <ul className="task-list">
              {displayTasks.map(task => (
                <TodoItem key={task.id} task={task} depth={0} onToggle={toggleTask} onDelete={deleteTask} />
              ))}
            </ul>
          )}
        </main>

        <TodoFooter
          activeCount={activeCount}
          filter={filter}
          onFilterChange={setFilter}
          onClearCompleted={clearCompleted}
          hasCompleted={hasCompleted}
        />
      </div>
    </DragContext.Provider>
  )
}
