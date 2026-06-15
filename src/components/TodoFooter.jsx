const FILTERS = ['all', 'active', 'completed']

export default function TodoFooter({ activeCount, filter, onFilterChange, onClearCompleted, hasCompleted }) {
  return (
    <footer className="app-footer">
      <div className="footer-top">
        <span className="footer-count">
          {activeCount} {activeCount === 1 ? 'item' : 'items'} left
        </span>

        <nav className="filter-tabs">
          {FILTERS.map(f => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' filter-btn--active' : ''}`}
              onClick={() => onFilterChange(f)}
            >
              {f}
            </button>
          ))}
        </nav>
      </div>

      {hasCompleted && (
        <button className="clear-btn" onClick={onClearCompleted}>
          clear completed
        </button>
      )}
    </footer>
  )
}
