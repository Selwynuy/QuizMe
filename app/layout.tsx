import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/toast-provider'
import { GlobalNavbar } from '@/components/global-navbar'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'QuizMe - AI-Powered Learning Platform',
  description:
    'Study smarter, not harder. Transform any content into intelligent flashcards with AI. Smart spaced repetition system adapts to your learning pace.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased font-sans`}>
        <GlobalNavbar />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  )
}
