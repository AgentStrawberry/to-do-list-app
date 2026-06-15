import { useState, useEffect } from 'react'
import TodoInput from './components/TodoInput.jsx'
import TodoItem from './components/TodoItem.jsx'
import TodoFooter from './components/TodoFooter.jsx'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tasks')) ?? []
    } catch {
      return []
    }
  })
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(text) {
    const trimmed = text.trim()
    if (!trimmed) return
    setTasks(prev => [...prev, { id: crypto.randomUUID(), text: trimmed, completed: false }])
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function clearCompleted() {
    setTasks(prev => prev.filter(t => !t.completed))
  }

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed
    if (filter === 'completed') return t.completed
    return true
  })

  const activeCount = tasks.filter(t => !t.completed).length

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">todos</h1>
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
              <TodoItem
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </ul>
        )}
      </main>

      <TodoFooter
        activeCount={activeCount}
        filter={filter}
        onFilterChange={setFilter}
        onClearCompleted={clearCompleted}
        hasCompleted={tasks.some(t => t.completed)}
      />
    </div>
  )
}
