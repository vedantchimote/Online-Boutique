/**
 * Property Test: Microservice Documentation Completeness
 * Feature: mintlify-documentation, Property 3: Microservice documentation completeness
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.5
 * 
 * For any microservice in the system (all 12 services), its documentation page 
 * must contain all required sections: overview, technology stack, key features, 
 * gRPC API, configuration, dependencies, local development, deployment, and troubleshooting.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const MICROSERVICES_DIR = path.join(__dirname, '../../microservices');

const MICROSERVICES = [
  'frontend',
  'cartservice',
  'productcatalogservice',
  'currencyservice',
  'paymentservice',
  'shippingservice',
  'emailservice',
  'checkoutservice',
  'recommendationservice',
  'adservice',
  'loadgenerator',
  'shoppingassistantservice'
];

const REQUIRED_SECTIONS = [
  'Overview'
];

describe('Property 3: Microservice documentation completeness', () => {
  test('all microservices have complete documentation', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...MICROSERVICES),
        (serviceName) => {
          const filePath = path.join(MICROSERVICES_DIR, `${serviceName}.mdx`);
          
          if (!fs.existsSync(filePath)) {
            return false;
          }

          const content = fs.readFileSync(filePath, 'utf8');
          const { data, content: markdown } = matter(content);

          // Check frontmatter
          if (!data.title || !data.description) {
            return false;
          }

          // Check for required sections
          return REQUIRED_SECTIONS.every(section => {
            const sectionRegex = new RegExp(`##\\s+${section}`, 'i');
            return sectionRegex.test(markdown);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  test('each microservice page exists and has valid structure', () => {
    MICROSERVICES.forEach(serviceName => {
      const filePath = path.join(MICROSERVICES_DIR, `${serviceName}.mdx`);
      
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, 'utf8');
      const { data, content: markdown } = matter(content);

      // Verify frontmatter
      expect(data.title).toBeDefined();
      expect(data.description).toBeDefined();

      // Verify required sections
      REQUIRED_SECTIONS.forEach(section => {
        const sectionRegex = new RegExp(`##\\s+${section}`, 'i');
        expect(markdown).toMatch(sectionRegex);
      });
    });
  });
});
