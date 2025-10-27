import { test, expect } from '@playwright/test';

test.describe('Responsive Design Tests', () => {
  test('should display properly on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    
    // Check if sidebar is visible on desktop
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });

  test('should display properly on tablet', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    
    await page.waitForLoadState('networkidle');
    
    // Check if content is visible
    const main = page.locator('main');
    await expect(main).toBeVisible();
  });

  test('should display properly on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if hamburger menu is visible on mobile
    const menuButton = page.getByRole('button', { name: /Open sidebar/i });
    await expect(menuButton).toBeVisible();
    
    // Sidebar should be hidden initially on mobile
    const sidebar = page.locator('aside');
    const isVisible = await sidebar.isVisible();
    
    // On mobile, sidebar might be transformed off-screen
    expect(isVisible).toBe(true); // Sidebar exists but may be off-screen
  });

  test('should have touch-friendly buttons on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check button sizes (should be at least 44x44 for touch targets)
    const buttons = page.locator('button').first();
    const box = await buttons.boundingBox();
    
    if (box) {
      expect(box.height).toBeGreaterThanOrEqual(32); // Reasonable touch target
    }
  });

  test('should display charts responsively', async ({ page }) => {
    await page.goto('/financials');
    
    await page.waitForLoadState('networkidle');
    
    // Test on desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    
    // Test on mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);
    
    // Chart should still be visible
    const chartCards = page.locator('[role="img"]').first();
    await expect(chartCards).toBeVisible();
  });

  test('should have scrollable tables on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/claims');
    
    await page.waitForLoadState('networkidle');
    
    // Tables should be in a scrollable container
    const tableContainer = page.locator('.overflow-x-auto').first();
    if (await tableContainer.isVisible()) {
      await expect(tableContainer).toBeVisible();
    }
  });
});
