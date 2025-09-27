export function UserGreeting({ name }: { name?: string | null }) {
  return (
    <div className="text-[--color-text]">
      <div className="text-sm text-[--color-text-secondary]">Welcome back</div>
      <div className="text-xl font-medium">{name || 'Friend'}</div>
    </div>
  )
}
