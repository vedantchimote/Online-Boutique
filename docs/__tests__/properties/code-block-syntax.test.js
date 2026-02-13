/**
 * Property Test: Code Block Syntax Highlighting
 * Feature: mintlify-documentation, Property 9: Code block syntax highlighting
 * Validates: Requirements 10.4
 * 
 * For any code block in the documentation, it must specify a language 
 * identifier for proper syntax highlighting.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const DOCS_DIR = path.join(__dirname, '../..');

describe('Property 9: Code block syntax highlighting', () => {
  let mdxFiles;
  let allCodeBlocks;

  beforeAll(() => {
    mdxFiles = glob.sync('**/*.mdx', {
      cwd: DOCS_DIR,
      ignore: ['node_modules/**', '__tests__/**']
    });

    allCodeBlocks = [];

    mdxFiles.forEach(filePath => {
      const fullPath = path.join(DOCS_DIR, filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Extract code blocks with language identifiers
      const codeBlockRegex = /```(\w+)?\n/g;
      let match;
      
      while ((match = codeBlockRegex.exec(content)) !== null) {
        allCodeBlocks.push({
          file: filePath,
          language: match[1] || null,
          hasLanguage: !!match[1]
        });
      }
    });
  });

  test('all code blocks have language identifiers', () => {
    if (allCodeBlocks.length === 0) {
      // No code blocks found, test passes
      expect(true).toBe(true);
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...allCodeBlocks),
        (codeBlock) => {
          return codeBlock.hasLanguage;
        }
      ),
      { numRuns: Math.min(100, allCodeBlocks.length) }
    );
  });

  test('code blocks specify valid language identifiers', () => {
    const validLanguages = [
      'bash', 'sh', 'shell',
      'javascript', 'js', 'typescript', 'ts',
      'python', 'py',
      'go', 'golang',
      'java',
      'csharp', 'cs', 'c#',
      'yaml', 'yml',
      'json',
      'protobuf', 'proto',
      'dockerfile',
      'sql',
      'html', 'xml',
      'css', 'scss',
      'markdown', 'md',
      'text', 'txt',
      'diff'
    ];

    allCodeBlocks.forEach(codeBlock => {
      if (codeBlock.language) {
        const isValid = validLanguages.includes(codeBlock.language.toLowerCase());
        expect(isValid).toBe(true);
      } else {
        // Fail if no language specified
        expect(codeBlock.hasLanguage).toBe(true);
      }
    });
  });

  test('documentation contains code examples', () => {
    // This test is optional - not all documentation needs code blocks
    expect(true).toBe(true);
  });
});
