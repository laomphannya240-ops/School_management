import {Search} from 'lucide-react'
export default function EmptyState({title,description}){return <div className="empty-state"><Search size={24}/><b>{title}</b><span>{description}</span></div>}
