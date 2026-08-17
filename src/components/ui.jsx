import { cn } from '../lib/utils'

export function Button({ className, variant = 'default', ...props }) {
  return <button className={cn('button', `button-${variant}`, className)} {...props} />
}

export function Card({ className, ...props }) {
  return <section className={cn('card', className)} {...props} />
}

export function Badge({ className, ...props }) {
  return <span className={cn('badge', className)} {...props} />
}

export function Tabs({ tabs, value, onChange }) {
  return <div className="tabs" role="tablist">{tabs.map(tab => <Button key={tab} variant={value === tab ? 'default' : 'outline'} onClick={() => onChange(tab)} role="tab" aria-selected={value === tab}>{tab}</Button>)}</div>
}
