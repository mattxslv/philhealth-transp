import { test, expect } from '@playwright/test';

test.describe('Navigation Tests', () => {
  test('should navigate to Financial Information page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Financial Information link
    await page.getByRole('link', { name: 'Financial Information' }).click();
    
    // Wait for navigation
    await page.waitForURL('/financials');
    
    // Check if we're on the right page
    await expect(page).toHaveURL('/financials');
    
    // Check for page heading
    const heading = page.getByRole('heading', { name: /Financial Information/i });
    await expect(heading).toBeVisible();
  });

  test('should navigate to Claims page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Claims link
    await page.getByRole('link', { name: 'Claims' }).first().click();
    
    // Wait for navigation
    await page.waitForURL('/claims');
    
    // Check if we're on the right page
    await expect(page).toHaveURL('/claims');
  });

  test('should navigate to Coverage page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Coverage link
    await page.getByRole('link', { name: 'Coverage' }).first().click();
    
    // Wait for navigation
    await page.waitForURL('/coverage');
    
    // Check if we're on the right page
    await expect(page).toHaveURL('/coverage');
  });

  test('should navigate to Facilities page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Facilities link
    await page.getByRole('link', { name: 'Facilities' }).first().click();
    
    // Wait for navigation
    await page.waitForURL('/facilities');
    
    // Check if we're on the right page
    await expect(page).toHaveURL('/facilities');
  });

  test('should navigate to Governance page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Governance link
    await page.getByRole('link', { name: /Governance/i }).first().click();
    
    // Wait for navigation
    await page.waitForURL('/governance');
    
    // Check if we're on the right page
    await expect(page).toHaveURL('/governance');
  });

  test('should navigate to Public Engagement page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Public Engagement link
    await page.getByRole('link', { name: 'Public Engagement' }).first().click();
    
    // Wait for navigation
    await page.waitForURL('/engagement');
    
    // Check if we're on the right page
    await expect(page).toHaveURL('/engagement');
  });

  test('should navigate to Procurement page', async ({ page }) => {
    await page.goto('/');
    
    // Click on Procurement link
    await page.getByRole('link', { name: 'Procurement' }).first().click();
    
    // Wait for navigation
    await page.waitForURL('/procurement');
    
    // Check if we're on the right page
    await expect(page).toHaveURL('/procurement');
  });

  test('should toggle sidebar on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Click hamburger menu to open sidebar
    const menuButton = page.getByRole('button', { name: /Open sidebar/i });
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    
    // Wait for sidebar to open
    await page.waitForTimeout(300);
    
    // Check if menu items are visible
    const homeLink = page.getByRole('link', { name: 'Home' });
    await expect(homeLink).toBeVisible();
  });
});
