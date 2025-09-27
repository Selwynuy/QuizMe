'use client'

import { AuthClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'

export function SocialAuthButtons() {
  const handleGoogle = async () => {
    const authClient = AuthClient.getInstance()
    await authClient.signInWithGoogle()
  }

  return (
    <div className="grid gap-3">
      <Button variant="outline" onClick={handleGoogle} className="w-full">
        Continue with Google
      </Button>
    </div>
  )
}
