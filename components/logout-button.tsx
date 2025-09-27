'use client'

import { AuthClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export function LogoutButton() {
  const router = useRouter()

  const logout = async () => {
    const authClient = AuthClient.getInstance()
    await authClient.signOut()
    router.push('/auth/login')
  }

  return <Button onClick={logout}>Logout</Button>
}
