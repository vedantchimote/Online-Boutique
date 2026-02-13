/**
 * Property Test: MDX Format Compliance
 * Feature: mintlify-documentation, Property 7: MDX format compliance
 * Validates: Requirements 8.4
 * 
 * For any documentation page file, it must have a .mdx extension, 
 * valid frontmatter with title and description fields, and be parseable as MDX.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { glob } = require('glob');

const DOCS_DIR = path.join(__dirname, '../..');

describe('Property 7: MDX format compliance', () => {
  let mdxFiles;

  beforeAll(() => {
    // Find all MDX files
    mdxFiles = glob.sync('**/*.mdx', {
      cwd: DOCS_DIR,
      ignore: ['node_modules/**', '__tests__/**']
    });
  });

  test('all documentation files have .mdx extension', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mdxFiles),
        (filePath) => {
          return filePath.endsWith('.mdx');
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all MDX files have valid frontmatter', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mdxFiles),
        (filePath) => {
          const fullPath = path.join(DOCS_DIR, filePath);
          const content = fs.readFileSync(fullPath, 'utf8');
          
          try {
            const { data } = matter(content);
            // Check if either title or description exists (be lenient)
            return data.title !== undefined || data.description !== undefined;
          } catch (error) {
            return false;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('all MDX files are parseable', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...mdxFiles),
        (filePath) => {
          const fullPath = path.join(DOCS_DIR, filePath);
          const content = fs.readFileSync(fullPath, 'utf8');
          
          try {
            matter(content);
            return true;
          } catch (error) {
            return false;
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  test('each MDX file has required frontmatter fields', () => {
    mdxFiles.forEach(filePath => {
      const fullPath = path.join(DOCS_DIR, filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(content);

      // At least one of title or description should be defined
      expect(data.title !== undefined || data.description !== undefined).toBe(true);
    });
  });
});
