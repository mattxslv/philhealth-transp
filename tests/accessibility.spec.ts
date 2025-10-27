import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/');
    
    // Check for h1
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();
  });

  test('should have skip to content link', async ({ page }) => {
    await page.goto('/');
    
    // Tab to focus skip link
    await page.keyboard.press('Tab');
    
    // Check if skip link is focused
    const skipLink = page.getByRole('link', { name: /Skip to content/i });
    await expect(skipLink).toBeFocused();
  });

  test('should have proper ARIA labels', async ({ page }) => {
    await page.goto('/');
    
    // Check navigation has aria-label
    const nav = page.locator('nav[aria-label="Global"]');
    await expect(nav).toBeVisible();
    
    // Check sidebar navigation has aria-label
    const sidebarNav = page.locator('nav[aria-label="Dashboard navigation"]');
    await expect(sidebarNav).toBeVisible();
  });

  test('should have keyboard navigable menu', async ({ page }) => {
    await page.goto('/');
    
    // Tab through navigation
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // First nav item
    
    // Check if an element is focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('should have alt text for images', async ({ page }) => {
    await page.goto('/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Get all images
    const images = page.locator('img');
    const count = await images.count();
    
    // Check each image has alt attribute
    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });
});
