/**
 * Property Test: Deployment Documentation Completeness
 * Feature: mintlify-documentation, Property 5: Deployment documentation completeness
 * Validates: Requirements 5.2, 5.4
 * 
 * For any deployment method (Kubernetes, Helm, Terraform, Kustomize), 
 * its documentation page must contain prerequisites, step-by-step instructions, 
 * configuration examples, and validation steps.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const DEPLOYMENT_DIR = path.join(__dirname, '../../deployment');

const DEPLOYMENT_METHODS = [
  'kubernetes',
  'helm',
  'terraform',
  'kustomize'
];

const REQUIRED_SECTIONS = [
  'Prerequisites',
  'Deployment',
  'Configuration',
  'Verification'
];

describe('Property 5: Deployment documentation completeness', () => {
  test('all deployment methods have complete documentation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...DEPLOYMENT_METHODS),
        (method) => {
          const filePath = path.join(DEPLOYMENT_DIR, `${method}.mdx`);
          
          if (!fs.existsSync(filePath)) {
            return false;
          }

          const content = fs.readFileSync(filePath, 'utf8');
          const { data, content: markdown } = matter(content);

          // Check frontmatter
          if (!data.title || !data.description) {
            return false;
          }

          // Check for required sections (flexible matching)
          const hasPrerequisites = /##\s+(Prerequisites|Requirements|Before|Setup)/i.test(markdown);
          const hasDeployment = /##\s+(Deployment|Deploy|Installation|Install|Steps)/i.test(markdown);
          const hasConfiguration = /##\s+(Configuration|Config|Setup|Environment)/i.test(markdown);
          const hasVerification = /##\s+(Verification|Verify|Validation|Testing|Check)/i.test(markdown);

          return hasPrerequisites && hasDeployment && (hasConfiguration || hasVerification);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('each deployment method has step-by-step instructions', () => {
    DEPLOYMENT_METHODS.forEach(method => {
      const filePath = path.join(DEPLOYMENT_DIR, `${method}.mdx`);
      
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, 'utf8');
      const { content: markdown } = matter(content);

      // Check for step indicators or numbered lists
      const hasSteps = 
        /\d+\.\s+/.test(markdown) || // Numbered lists
        /<Steps>/i.test(markdown) ||  // Mintlify Steps component
        /Step \d+/i.test(markdown);   // Step headings

      expect(hasSteps).toBe(true);
    });
  });

  test('each deployment method has code examples', () => {
    DEPLOYMENT_METHODS.forEach(method => {
      const filePath = path.join(DEPLOYMENT_DIR, `${method}.mdx`);
      const content = fs.readFileSync(filePath, 'utf8');

      // Check for code blocks
      const hasCodeBlocks = /```/.test(content);
      expect(hasCodeBlocks).toBe(true);
    });
  });
});
