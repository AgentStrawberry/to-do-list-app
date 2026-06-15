import { useDrag } from '../context/DragContext.jsx'

export default function TodoItem({ task, depth, onToggle, onDelete }) {
  const { drag, onDragStart, onDragOver, onDrop, onDragEnd } = useDrag()

  const isDragging = drag.id === task.id
  const dropPos = drag.overId === task.id ? drag.pos : null
  const indent = 20 + depth * 22

  const rowClass = [
    'task-row',
    task.completed ? 'task-row--done' : '',
    isDragging ? 'task-row--dragging' : '',
    dropPos === 'before' ? 'drop-before' : '',
    dropPos === 'after' ? 'drop-after' : '',
    dropPos === 'child' ? 'drop-child' : '',
  ].filter(Boolean).join(' ')

  return (
    <li className="task-item">
      <div
        className={rowClass}
        style={{ paddingLeft: `${indent}px`, '--child-indent': `${indent + 22}px` }}
        draggable
        onDragStart={e => { e.stopPropagation(); onDragStart(task.id) }}
        onDragOver={e => onDragOver(e, task.id, depth)}
        onDrop={e => onDrop(e, task.id)}
        onDragEnd={onDragEnd}
      >
        <button
          className={`checkbox${task.completed ? ' checkbox--checked' : ''}`}
          onClick={() => onToggle(task.id)}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        />
        <span className="task-text">{task.text}</span>
        <button className="delete-btn" onClick={() => onDelete(task.id)} aria-label="Delete">×</button>
      </div>

      {task.children?.length > 0 && (
        <ul className="task-children" style={{ '--child-line-left': `${indent + 7}px` }}>
          {task.children.map(child => (
            <TodoItem key={child.id} task={child} depth={depth + 1} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </li>
  )
}
