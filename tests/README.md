# Playwright Testing for PhilHealth Transparency Portal

This directory contains automated tests using Playwright for end-to-end testing of the PhilHealth Transparency Portal.

## Test Files

- **`homepage.spec.ts`** - Tests for the homepage functionality
  - Page loading
  - Hero section display
  - Navigation links
  - KPI statistics
  - Theme toggle
  - Did You Know section
  - Savings calculator

- **`navigation.spec.ts`** - Tests for navigation between pages
  - All page navigations (Financial, Claims, Coverage, etc.)
  - Sidebar toggle on mobile
  - Link functionality

- **`accessibility.spec.ts`** - Accessibility compliance tests
  - Heading hierarchy
  - Skip to content link
  - ARIA labels
  - Keyboard navigation
  - Image alt text

- **`responsive.spec.ts`** - Responsive design tests
  - Desktop display
  - Tablet display
  - Mobile display
  - Touch-friendly buttons
  - Responsive charts
  - Scrollable tables on mobile

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with UI mode (interactive)
```bash
npm run test:ui
```

### Run tests with browser visible (headed mode)
```bash
npm run test:headed
```

### View test report
```bash
npm run test:report
```

### Run specific test file
```bash
npx playwright test tests/homepage.spec.ts
```

### Run tests in specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Configuration

Tests are configured in `playwright.config.ts` with:
- Multiple browser support (Chrome, Firefox, Safari)
- Mobile viewport testing (Pixel 5, iPhone 12)
- Automatic dev server startup
- Screenshot on failure
- Trace on retry

## CI/CD Integration

Tests can be integrated into GitHub Actions or other CI/CD pipelines. They will automatically:
- Retry failed tests 2 times
- Run in a single worker for consistency
- Generate HTML reports

## Adding New Tests

1. Create a new `.spec.ts` file in the `tests/` directory
2. Import test utilities: `import { test, expect } from '@playwright/test';`
3. Write your test cases using `test.describe()` and `test()`
4. Run tests to verify

## Best Practices

- Use semantic selectors (role, label, text) over CSS selectors
- Wait for network idle on pages with dynamic content
- Test critical user paths
- Keep tests independent and isolated
- Use meaningful test descriptions

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright API Reference](https://playwright.dev/docs/api/class-test)
