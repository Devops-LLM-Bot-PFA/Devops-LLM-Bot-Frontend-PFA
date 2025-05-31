
import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should redirect to auth page when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/auth');
  });

  test('should login with email and navigate to credentials', async ({ page }) => {
    await page.goto('/auth');
    
    // Fill in email/password form
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to credentials page
    await expect(page).toHaveURL('/credentials');
    
    // Should show success toast
    await expect(page.locator('.toast')).toBeVisible();
  });

  test('should logout and redirect to home', async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/credentials');
    
    // Logout
    await page.click('[data-testid="user-menu"]');
    await page.click('text=Logout');
    
    // Should redirect to home
    await expect(page).toHaveURL('/');
  });
});

test.describe('Protected Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/credentials');
  });

  test('should access dashboard and see instance creation', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Should see create instance form if no instance exists
    const createButton = page.locator('button:has-text("Create Instance")');
    if (await createButton.isVisible()) {
      await page.fill('input[placeholder="my-llm-bot"]', 'test-instance');
      await createButton.click();
      
      // Should show success toast
      await expect(page.locator('.toast')).toBeVisible();
    }
  });

  test('should access profile page and update information', async ({ page }) => {
    await page.goto('/profile');
    await expect(page.locator('h1')).toContainText('Profile');
    
    // Update profile
    await page.fill('input[id="name"]', 'Updated Name');
    await page.click('button:has-text("Update Profile")');
    
    // Should show success toast
    await expect(page.locator('.toast')).toBeVisible();
  });

  test('should access subscription page and see plans', async ({ page }) => {
    await page.goto('/subscription');
    await expect(page.locator('h1')).toContainText('Subscription');
    
    // Should see pricing plans
    await expect(page.locator('text=Free')).toBeVisible();
    await expect(page.locator('text=Pro')).toBeVisible();
    await expect(page.locator('text=Enterprise')).toBeVisible();
  });
});

test.describe('Admin Pages', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin user
    await page.goto('/auth');
    await page.fill('input[type="email"]', 'admin@example.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');
  });

  test('should access admin dashboard', async ({ page }) => {
    await page.goto('/admin');
    await expect(page.locator('h1')).toContainText('Admin Dashboard');
    
    // Should see admin stats
    await expect(page.locator('text=Total Instances')).toBeVisible();
    await expect(page.locator('text=Active Users')).toBeVisible();
  });

  test('should access admin users page', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.locator('h1')).toContainText('User Management');
  });

  test('should access admin instances page', async ({ page }) => {
    await page.goto('/admin/instances');
    await expect(page.locator('h1')).toContainText('Instance Management');
  });
});
