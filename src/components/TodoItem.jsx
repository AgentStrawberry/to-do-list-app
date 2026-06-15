export default function TodoItem({ task, onToggle, onDelete }) {
  return (
    <li className={`task-row${task.completed ? ' task-row--done' : ''}`}>
      <button
        className={`checkbox${task.completed ? ' checkbox--checked' : ''}`}
        onClick={() => onToggle(task.id)}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      />
      <span className="task-text">{task.text}</span>
      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
        aria-label="Delete task"
      >
        ×
      </button>
    </li>
  )
}
