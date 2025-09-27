'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { updateMyProfile } from '@/lib/actions/profile'
import { useToast } from '@/components/toast-provider'

export function ProfileSettings({
  initial,
}: {
  initial: { full_name: string | null; email_notifications: boolean; push_notifications: boolean }
}) {
  const [fullName, setFullName] = useState(initial.full_name || '')
  const [emailN, setEmailN] = useState(initial.email_notifications)
  const [pushN, setPushN] = useState(initial.push_notifications)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const pushToast = useToast()

  useEffect(() => {
    setFullName(initial.full_name || '')
    setEmailN(initial.email_notifications)
    setPushN(initial.push_notifications)
  }, [initial])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <label className="text-sm">Full name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={emailN} onChange={(e) => setEmailN(e.target.checked)} />{' '}
          Email notifications
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" checked={pushN} onChange={(e) => setPushN(e.target.checked)} />{' '}
          Push notifications
        </label>
        <div className="flex items-center gap-3">
          <Button
            disabled={saving}
            onClick={async () => {
              setSaving(true)
              setMsg(null)
              const { ok, error } = await updateMyProfile({
                full_name: fullName,
                email_notifications: emailN,
                push_notifications: pushN,
              })
              setSaving(false)
              setMsg(ok ? 'Saved' : error || 'Error')
              pushToast({
                type: ok ? 'success' : 'error',
                message: ok ? 'Profile updated' : error || 'Error',
              })
            }}
          >
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
          {msg && <div className="text-sm text-[--color-text-secondary]">{msg}</div>}
        </div>
      </CardContent>
    </Card>
  )
}
