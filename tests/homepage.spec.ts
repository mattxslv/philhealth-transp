import { test, expect } from '@playwright/test';

test.describe('Homepage Tests', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page title is correct
    await expect(page).toHaveTitle(/PhilHealth Transparency Portal/);
  });

  test('should display hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check for hero heading
    const heroHeading = page.getByRole('heading', { name: /Transparency for All Filipinos/i });
    await expect(heroHeading).toBeVisible();
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Check if navigation is visible
    const nav = page.locator('nav[aria-label="Global"]');
    await expect(nav).toBeVisible();
    
    // Check if Transparency link exists
    const transparencyLink = page.getByRole('link', { name: 'Transparency' });
    await expect(transparencyLink).toBeVisible();
  });

  test('should display KPI statistics', async ({ page }) => {
    await page.goto('/');
    
    // Wait for content to load
    await page.waitForLoadState('networkidle');
    
    // Check if there are KPI cards displayed
    const kpiSection = page.locator('text=Key Statistics').first();
    await expect(kpiSection).toBeVisible();
  });

  test('should have working theme toggle', async ({ page }) => {
    await page.goto('/');
    
    // Find and click theme toggle button
    const themeToggle = page.getByRole('button', { name: /Toggle theme/i });
    await expect(themeToggle).toBeVisible();
    
    // Click the theme toggle
    await themeToggle.click();
    
    // Wait a bit for theme to change
    await page.waitForTimeout(500);
  });

  test('should display Did You Know section', async ({ page }) => {
    await page.goto('/');
    
    // Check for Did You Know section
    const didYouKnow = page.getByText('Did You Know?');
    await expect(didYouKnow).toBeVisible();
  });

  test('should display savings calculator', async ({ page }) => {
    await page.goto('/');
    
    // Check for savings calculator heading
    const calculator = page.getByRole('heading', { name: /PhilHealth Savings Calculator/i });
    await expect(calculator).toBeVisible();
  });
});
