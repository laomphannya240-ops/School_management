import { Search } from 'lucide-react'

export default function SearchInput({ value, onChange, placeholder, label }) {
  return (
    <label className="search-box">
      <Search size={17} />
      <input aria-label={label || placeholder} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  )
}
