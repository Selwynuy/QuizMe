import { test, expect } from '@playwright/test'

test('landing loads and auth links exist', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('link', { name: 'Login' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Get started' })).toBeVisible()
})

test('unauthenticated user is redirected to login from dashboard', async ({ page }) => {
  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/auth\/login/)
})
