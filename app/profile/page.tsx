import { Footer } from '@/components/footer'
import { ProfileSettings } from '@/components/profile-settings'
import { getMyProfile } from '@/lib/actions/profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AvatarUpload } from '@/components/avatar-upload'
export default async function ProfilePage() {
  const { data: profile } = await getMyProfile()
  return (
    <>
      <main className="mx-auto max-w-2xl px-6 py-10 grid gap-6">
        <h1 className="text-2xl font-semibold">Your Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5">
            <div className="flex items-center gap-4">
              <AvatarUpload name={profile?.full_name} email={profile?.email ?? null} />
              <div>
                <div className="text-2xl font-semibold">{profile?.full_name || 'Your Name'}</div>
                <div className="text-sm text-[--color-text-secondary]">{profile?.email}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                className="rounded-md bg-[--color-accent] px-3 py-2 text-white text-sm text-center"
                href="/auth/update-password"
              >
                Change Password
              </a>
            </div>
          </CardContent>
        </Card>

        <ProfileSettings
          initial={{
            full_name: profile?.full_name ?? '',
            email_notifications: profile?.email_notifications ?? true,
            push_notifications: profile?.push_notifications ?? false,
          }}
        />

        <Card>
          <CardHeader>
            <CardTitle>Legal & Support</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <a className="underline" href="#">
                Privacy
              </a>
              <a className="underline" href="#">
                Terms
              </a>
              <a className="underline" href="#">
                Cookies
              </a>
              <a className="underline" href="#">
                Help
              </a>
              <a className="underline" href="#">
                Contact
              </a>
              <a className="underline" href="#">
                Docs
              </a>
            </div>
            <div className="mt-4 pt-4 border-t">
              <a
                className="rounded-md border px-3 py-2 text-sm text-[--color-text-secondary] hover:bg-gray-50"
                href="/auth/login"
              >
                Logout
              </a>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  )
}
