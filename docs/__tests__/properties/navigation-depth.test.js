/**
 * Property Test: Navigation Depth Constraint
 * Feature: mintlify-documentation, Property 2: Navigation depth constraint
 * Validates: Requirements 2.3
 * 
 * For any navigation group in the documentation system, 
 * the maximum depth of nested pages must not exceed 3 levels.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

const MINT_JSON_PATH = path.join(__dirname, '../../mint.json');
const MAX_DEPTH = 3;

describe('Property 2: Navigation depth constraint', () => {
  let mintConfig;

  beforeAll(() => {
    const content = fs.readFileSync(MINT_JSON_PATH, 'utf8');
    mintConfig = JSON.parse(content);
  });

  test('all navigation pages have depth <= 3', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mintConfig.navigation),
        (navigationGroup) => {
          if (!navigationGroup.pages || !Array.isArray(navigationGroup.pages)) {
            return true;
          }

          return navigationGroup.pages.every(page => {
            const depth = page.split('/').length;
            return depth <= MAX_DEPTH;
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('navigation structure maintains depth constraint across all groups', () => {
    const allPages = mintConfig.navigation.flatMap(group => 
      group.pages || []
    );

    allPages.forEach(page => {
      const depth = page.split('/').length;
      expect(depth).toBeLessThanOrEqual(MAX_DEPTH);
    });
  });
});
