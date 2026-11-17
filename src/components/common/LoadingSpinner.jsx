export default function LoadingSpinner({ size = 15, label }) {
  return <span className="loading-spinner-wrap" role="status" aria-label={label}>
    <span className="loading-spinner" style={{ width: size, height: size }} />
    {label && <span>{label}</span>}
  </span>
}
