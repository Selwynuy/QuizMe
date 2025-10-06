export function UserGreeting({ name }: { name?: string | null }) {
  return (
    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border p-5">
      <div className="text-sm text-[--color-text-secondary]">Welcome back</div>
      <div className="text-xl font-semibold">{name || 'Friend'}</div>
      <p className="mt-1 text-sm text-[--color-text-secondary]">
        Keep your streak alive and review today’s cards.
      </p>
    </div>
  )
}
