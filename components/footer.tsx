export function Footer() {
  return (
    <footer className="border-t bg-white/70">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-[--color-text-secondary] flex items-center justify-between">
        <span>© {new Date().getFullYear()} AI Flashcard Study App</span>
        <div className="flex gap-4">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  )
}
