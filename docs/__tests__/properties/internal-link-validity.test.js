/**
 * Property Test: Internal Link Validity
 * Feature: mintlify-documentation, Property 10: Internal link validity
 * Validates: Requirements 11.1
 * 
 * For any internal link in the documentation (links starting with / or relative paths), 
 * the target file must exist in the documentation structure.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const DOCS_DIR = path.join(__dirname, '../..');

function extractLinks(content) {
  const links = [];
  
  // Markdown links: [text](url)
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    links.push(match[2]);
  }
  
  // JSX href attributes
  const jsxLinkRegex = /href=["']([^"']+)["']/g;
  while ((match = jsxLinkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }
  
  return links;
}

function isInternalLink(link) {
  return !link.startsWith('http://') && 
         !link.startsWith('https://') && 
         !link.startsWith('mailto:') &&
         !link.startsWith('#');
}

function checkLinkExists(link, sourceFile) {
  const cleanLink = link.split('?')[0].split('#')[0];
  
  let targetPath;
  if (cleanLink.startsWith('/')) {
    targetPath = path.join(DOCS_DIR, cleanLink.substring(1));
  } else {
    const sourceDir = path.dirname(sourceFile);
    targetPath = path.join(sourceDir, cleanLink);
  }
  
  return fs.existsSync(targetPath) ||
         fs.existsSync(targetPath + '.mdx') ||
         fs.existsSync(targetPath + '.md') ||
         fs.existsSync(path.join(targetPath, 'index.mdx'));
}

describe('Property 10: Internal link validity', () => {
  let mdxFiles;
  let allInternalLinks;

  beforeAll(() => {
    mdxFiles = glob.sync('**/*.mdx', {
      cwd: DOCS_DIR,
      ignore: ['node_modules/**', '__tests__/**']
    });

    allInternalLinks = [];

    mdxFiles.forEach(filePath => {
      const fullPath = path.join(DOCS_DIR, filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const links = extractLinks(content);
      
      links.filter(isInternalLink).forEach(link => {
        allInternalLinks.push({
          file: filePath,
          link: link,
          sourceFile: fullPath
        });
      });
    });
  });

  test('all internal links point to existing files', () => {
    if (allInternalLinks.length === 0) {
      expect(true).toBe(true);
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...allInternalLinks),
        (linkInfo) => {
          return checkLinkExists(linkInfo.link, linkInfo.sourceFile);
        }
      ),
      { numRuns: Math.min(100, allInternalLinks.length) }
    );
  });

  test('each internal link resolves correctly', () => {
    allInternalLinks.forEach(linkInfo => {
      const exists = checkLinkExists(linkInfo.link, linkInfo.sourceFile);
      expect(exists).toBe(true);
    });
  });
});
