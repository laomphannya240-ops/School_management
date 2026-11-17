export function CardSkeleton({ count = 4 }) {
  return (
    <div className="stats-grid" aria-busy="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="card stat-card skeleton-card" key={index}>
          <span className="skeleton skeleton-square" />
          <span className="skeleton skeleton-line" />
          <span className="skeleton skeleton-title" />
          <span className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  )
}

export function TableSkeleton({ rows = 6, columns = 5 }) {
  return (
    <div className="card list-card skeleton-table" aria-busy="true">
      <div className="list-toolbar"><span className="skeleton skeleton-search" /></div>
      <div className="skeleton-table-body">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div className="skeleton-table-row" key={rowIndex}>
            {Array.from({ length: columns }, (_, columnIndex) => (
              <span className="skeleton skeleton-line" key={columnIndex} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function LoadingSkeleton({ variant = 'table', ...props }) {
  return variant === 'cards' ? <CardSkeleton {...props} /> : <TableSkeleton {...props} />
}
