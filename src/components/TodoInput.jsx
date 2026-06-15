import { useState } from 'react'

export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState('')

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      onAdd(value)
      setValue('')
    }
  }

  return (
    <div className="input-row">
      <input
        className="task-input"
        type="text"
        placeholder="what needs to be done?"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  )
}
