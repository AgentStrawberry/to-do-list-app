import { useState, useEffect, useRef } from 'react'
import TodoInput from './components/TodoInput.jsx'
import TodoItem from './components/TodoItem.jsx'
import TodoFooter from './components/TodoFooter.jsx'
import { getGreeting, getCompletionPhrase } from './utils/greeting.js'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem('tasks')) ?? [] } catch { return [] }
  })
  const [filter, setFilter] = useState('all')
  const [completionPhrase, setCompletionPhrase] = useState('')
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark')
  const phraseTimer = useRef(null)
  const greeting = useRef(getGreeting()).current

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    document.body.classList.toggle('dark', dark)
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  function addTask(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks(prev => [...prev, { id: crypto.randomUUID(), text: trimmed, completed: false }])
  }

  function toggleTask(id) {
    setTasks(prev => {
      const next = prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
      const toggled = next.find(t => t.id === id)
      if (toggled.completed) {
        clearTimeout(phraseTimer.current)
        setCompletionPhrase(getCompletionPhrase())
        phraseTimer.current = setTimeout(() => setCompletionPhrase(''), 1800)
      }
      return next
    })
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.completed))
  }

  const filtered = tasks
    .filter(t => {
      if (filter === 'active') return !t.completed
      if (filter === 'completed') return t.completed
      return true
    })
    .sort((a, b) => a.completed - b.completed)

  const activeCount = tasks.filter(t => !t.completed).length
  const hasCompleted = tasks.some(t => t.completed)

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-title-row">
          <h1 className="app-title">todos</h1>
          <span className={`completion-phrase${completionPhrase ? ' completion-phrase--visible' : ''}`}>
            {completionPhrase}
          </span>
          <button className="theme-toggle" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
            {dark ? 'light' : 'dark'}
          </button>
        </div>
        <p className="app-greeting">{greeting}</p>
        <TodoInput onAdd={addTask} />
      </header>

      <main className="app-main">
        {filtered.length === 0 ? (
          <p className="empty-state">
            {filter === 'completed' ? 'No completed tasks.' : filter === 'active' ? 'Nothing left to do.' : 'Add a task above.'}
          </p>
        ) : (
          <ul className="task-list">
            {filtered.map(task => (
              <TodoItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
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
  )
}
