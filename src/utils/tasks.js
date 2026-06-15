export function findTask(tasks, id) {
  for (const t of tasks) {
    if (t.id === id) return t
    const r = findTask(t.children, id)
    if (r) return r
  }
  return null
}

export function getSubtreeDepth(task) {
  if (!task.children?.length) return 0
  return 1 + Math.max(...task.children.map(getSubtreeDepth))
}

// true if targetId is the task with rootId, or any descendant of it
export function isInSubtree(tasks, rootId, targetId) {
  const root = findTask(tasks, rootId)
  if (!root) return false
  return !!findTask([root], targetId)
}

export function removeTask(tasks, id) {
  let removed = null
  const filtered = tasks.filter(t => { if (t.id === id) { removed = t; return false } return true })
  if (removed) return [filtered, removed]
  const mapped = filtered.map(t => {
    const [c, r] = removeTask(t.children, id)
    if (r) { removed = r; return { ...t, children: c } }
    return t
  })
  return [mapped, removed]
}

export function insertTask(tasks, task, targetId, pos) {
  if (pos === 'child') {
    return tasks.map(t =>
      t.id === targetId
        ? { ...t, children: [...t.children, task] }
        : { ...t, children: insertTask(t.children, task, targetId, pos) }
    )
  }
  const idx = tasks.findIndex(t => t.id === targetId)
  if (idx !== -1) {
    const copy = [...tasks]
    copy.splice(pos === 'before' ? idx : idx + 1, 0, task)
    return copy
  }
  return tasks.map(t => ({ ...t, children: insertTask(t.children, task, targetId, pos) }))
}

// Sort at every level: active first (stable), then completed newest-first
export function sortForDisplay(tasks) {
  const active = tasks.filter(t => !t.completed)
  const done = [...tasks.filter(t => t.completed)]
    .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0))
  return [...active, ...done].map(t => ({ ...t, children: sortForDisplay(t.children) }))
}

export function migrate(tasks) {
  return (tasks || []).map(t => ({
    ...t,
    completedAt: t.completed ? (t.completedAt ?? Date.now()) : null,
    children: migrate(t.children ?? []),
  }))
}
