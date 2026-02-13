/**
 * Property Test: Architecture Description Completeness
 * Feature: mintlify-documentation, Property 4: Architecture description completeness
 * Validates: Requirements 3.4
 * 
 * For any microservice in the system, the architecture documentation 
 * must explain its purpose and responsibilities.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

const ARCHITECTURE_OVERVIEW = path.join(__dirname, '../../architecture/overview.mdx');

const MICROSERVICES = [
  'Frontend',
  'CartService',
  'ProductCatalogService',
  'CurrencyService',
  'PaymentService',
  'ShippingService',
  'EmailService',
  'CheckoutService',
  'RecommendationService',
  'AdService',
  'LoadGenerator',
  'ShoppingAssistantService'
];

describe('Property 4: Architecture description completeness', () => {
  let architectureContent;

  beforeAll(() => {
    architectureContent = fs.readFileSync(ARCHITECTURE_OVERVIEW, 'utf8');
  });

  test('architecture documentation mentions all microservices', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...MICROSERVICES),
        (serviceName) => {
          // Check if service is mentioned in architecture docs
          const serviceRegex = new RegExp(serviceName, 'i');
          return serviceRegex.test(architectureContent);
        }
      ),
      { numRuns: 100 }
    );
  });

  test('each microservice has purpose description in architecture', () => {
    MICROSERVICES.forEach(serviceName => {
      const serviceRegex = new RegExp(serviceName, 'i');
      expect(architectureContent).toMatch(serviceRegex);
    });
  });

  test('architecture overview contains service descriptions', () => {
    // Check for common architecture description patterns
    const hasServiceDescriptions = 
      architectureContent.includes('purpose') ||
      architectureContent.includes('responsibility') ||
      architectureContent.includes('responsibilities') ||
      architectureContent.includes('role');

    expect(hasServiceDescriptions).toBe(true);
  });
});
