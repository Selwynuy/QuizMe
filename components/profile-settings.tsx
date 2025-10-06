'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
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
      <CardContent className="grid gap-5">
        {msg && (
          <div
            className={`rounded-md p-3 text-sm ${msg === 'Saved' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
          >
            {msg === 'Saved' ? 'Profile updated!' : msg}
          </div>
        )}
        <div className="grid gap-2">
          <label className="text-sm font-medium">Full name</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div className="grid gap-3">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="font-medium">Email notifications</div>
              <div className="text-[--color-text-secondary]">Receive updates via email</div>
            </div>
            <Switch checked={emailN} onCheckedChange={(v) => setEmailN(v)} />
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="font-medium">Push notifications</div>
              <div className="text-[--color-text-secondary]">Get reminders on your device</div>
            </div>
            <Switch checked={pushN} onCheckedChange={(v) => setPushN(v)} />
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
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
        </div>
      </CardContent>
    </Card>
  )
}
