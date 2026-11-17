import { ListFilter } from 'lucide-react'

/** Reusable filter control. `options` is an array of { value, label }. */
export default function FilterDropdown({ label, value, onChange, options, icon: Icon = ListFilter }) {
  return (
    <label className="filter-select-wrap">
      {Icon && <Icon size={15} />}
      <select aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{label}</option>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}
