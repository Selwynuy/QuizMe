import { GlobalNavbar } from '@/components/global-navbar'
import { Footer } from '@/components/footer'
import { ProfileSettings } from '@/components/profile-settings'
import { getMyProfile } from '@/lib/actions/profile'
export default async function ProfilePage() {
  const { data: profile } = await getMyProfile()
  return (
    <>
      <GlobalNavbar />
      <main className="mx-auto max-w-2xl px-6 py-10 grid gap-6">
        <h1 className="text-2xl font-semibold">Your Profile</h1>
        <ProfileSettings
          initial={{
            full_name: profile?.full_name ?? '',
            email_notifications: profile?.email_notifications ?? true,
            push_notifications: profile?.push_notifications ?? false,
          }}
        />
      </main>
      <Footer />
    </>
  )
}
