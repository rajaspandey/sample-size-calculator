import { test, expect } from '@playwright/test';
import { testsConfig } from '../src/config/testsConfig.js';

const allTests = testsConfig.flatMap(c => c.tests);

test.describe('Dynamic URL Routes & Sample Size Computation', () => {
  for (const t of allTests) {
    test(`Test URL endpoint /test/${t.id} computes correctly`, async ({ page }) => {
      // Initializing WebR Wasm takes a bit of time for the very first test
      test.setTimeout(45000); 

      // Listen to browser console to capture internal WebR evaluation errors
      page.on('console', msg => {
        if (msg.type() === 'error') console.log(`BROWSER ERROR: ${msg.text()}`);
      });

      await page.goto(`http://localhost:3000/test/${t.id}`);
      
      // Wait for WebR Wasm to finish downloading and compiling (can take 15s on first pass)
      await expect(page.locator('.loader')).toBeHidden({ timeout: 60000 });
      
      // Assert the name is correct
      await expect(page.locator('h2').first()).toContainText(t.name);

      // Find and click the calculate button
      const calcBtn = page.locator('button', { hasText: 'Calculate Sample Size' });
      await expect(calcBtn).toBeVisible();
      await calcBtn.click();

      // Wait for the calculation to finish. WebR takes around 1-3s depending on the algorithm.
      // Assert that R did not crash
      const errorBox = page.locator('.error-box');
      await expect(errorBox).toBeHidden({ timeout: 25000 });

      const resultDiv = page.locator('.result-number');
      await expect(resultDiv).toBeVisible({ timeout: 5000 });

      // The result should be a valid sample size > 0
      const outputStr = await resultDiv.textContent();
      const n = parseInt(outputStr, 10);
      
      expect(Number.isNaN(n)).toBe(false);
      expect(n).toBeGreaterThan(0);
    });
  }
});
