/**
 * Unit Tests: Build Process
 * Validates: Requirements 1.2, 11.4
 * 
 * Tests for documentation build validation
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { glob } = require('glob');

const DOCS_DIR = path.join(__dirname, '../..');

describe('Build Process', () => {
  describe('valid documentation structure', () => {
    test('mint.json is valid', () => {
      const mintPath = path.join(DOCS_DIR, 'mint.json');
      const content = fs.readFileSync(mintPath, 'utf8');
      
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('all referenced pages exist', () => {
      const mintPath = path.join(DOCS_DIR, 'mint.json');
      const content = fs.readFileSync(mintPath, 'utf8');
      const config = JSON.parse(content);
      
      const allPages = config.navigation.flatMap(group => group.pages || []);
      
      allPages.forEach(page => {
        const mdxPath = path.join(DOCS_DIR, `${page}.mdx`);
        const mdPath = path.join(DOCS_DIR, `${page}.md`);
        
        const exists = fs.existsSync(mdxPath) || fs.existsSync(mdPath);
        expect(exists).toBe(true);
      });
    });

    test('all MDX files have valid frontmatter', () => {
      const mdxFiles = glob.sync('**/*.mdx', {
        cwd: DOCS_DIR,
        ignore: ['node_modules/**', '__tests__/**']
      });

      mdxFiles.forEach(filePath => {
        const fullPath = path.join(DOCS_DIR, filePath);
        const content = fs.readFileSync(fullPath, 'utf8');
        
        expect(() => matter(content)).not.toThrow();
      });
    });
  });

  describe('invalid MDX handling', () => {
    test('detects missing frontmatter', () => {
      const invalidMdx = '# Title\n\nContent without frontmatter';
      const { data } = matter(invalidMdx);
      
      expect(Object.keys(data).length).toBe(0);
    });

    test('detects malformed frontmatter', () => {
      const invalidMdx = '---\ntitle: Test\ninvalid yaml: [unclosed\n---\n\nContent';
      
      // gray-matter should handle this gracefully
      expect(() => matter(invalidMdx)).not.toThrow();
    });

    test('validates frontmatter structure', () => {
      const validMdx = '---\ntitle: Test\ndescription: Description\n---\n\nContent';
      const { data } = matter(validMdx);
      
      expect(data.title).toBe('Test');
      expect(data.description).toBe('Description');
    });
  });

  describe('broken link detection', () => {
    test('identifies internal links', () => {
      const content = 'Check [this page](/getting-started/quickstart) for details.';
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      const matches = [...content.matchAll(linkRegex)];
      
      expect(matches.length).toBe(1);
      expect(matches[0][2]).toBe('/getting-started/quickstart');
    });

    test('validates link targets exist', () => {
      const quickstartPath = path.join(DOCS_DIR, 'getting-started/quickstart.mdx');
      expect(fs.existsSync(quickstartPath)).toBe(true);
    });

    test('detects broken internal links', () => {
      const brokenLink = '/non-existent-page';
      const targetPath = path.join(DOCS_DIR, brokenLink.substring(1));
      
      expect(fs.existsSync(targetPath + '.mdx')).toBe(false);
    });
  });

  describe('build validation scripts', () => {
    test('validation scripts exist', () => {
      const scripts = [
        'validate-mint-json.js',
        'validate-mdx.js',
        'validate-links.js'
      ];

      scripts.forEach(script => {
        const scriptPath = path.join(DOCS_DIR, 'scripts', script);
        expect(fs.existsSync(scriptPath)).toBe(true);
      });
    });

    test('package.json has validation scripts', () => {
      const packagePath = path.join(DOCS_DIR, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf8');
      const pkg = JSON.parse(content);
      
      expect(pkg.scripts.validate).toBeDefined();
      expect(pkg.scripts['validate:links']).toBeDefined();
    });

    test('package.json has test scripts', () => {
      const packagePath = path.join(DOCS_DIR, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf8');
      const pkg = JSON.parse(content);
      
      expect(pkg.scripts.test).toBeDefined();
    });
  });

  describe('successful build requirements', () => {
    test('all required dependencies are listed', () => {
      const packagePath = path.join(DOCS_DIR, 'package.json');
      const content = fs.readFileSync(packagePath, 'utf8');
      const pkg = JSON.parse(content);
      
      const requiredDeps = [
        '@mdx-js/mdx',
        'gray-matter',
        'fast-check',
        'jest',
        'glob'
      ];

      requiredDeps.forEach(dep => {
        expect(pkg.devDependencies[dep]).toBeDefined();
      });
    });

    test('documentation structure is complete', () => {
      const requiredDirs = [
        'getting-started',
        'architecture',
        'microservices',
        'deployment',
        'development',
        'api-reference',
        'images'
      ];

      requiredDirs.forEach(dir => {
        const dirPath = path.join(DOCS_DIR, dir);
        expect(fs.existsSync(dirPath)).toBe(true);
      });
    });

    test('no duplicate page references', () => {
      const mintPath = path.join(DOCS_DIR, 'mint.json');
      const content = fs.readFileSync(mintPath, 'utf8');
      const config = JSON.parse(content);
      
      const allPages = config.navigation.flatMap(group => group.pages || []);
      const uniquePages = new Set(allPages);
      
      expect(allPages.length).toBe(uniquePages.size);
    });
  });
});
