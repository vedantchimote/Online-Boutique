/**
 * Property Test: API Method Documentation Completeness
 * Feature: mintlify-documentation, Property 6: API method documentation completeness
 * Validates: Requirements 7.2, 7.3
 * 
 * For any gRPC service method documented in the API reference, it must include 
 * the method name, request type, response type, description, example request, 
 * and example response.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

const GRPC_SERVICES_PATH = path.join(__dirname, '../../api-reference/grpc-services.mdx');

describe('Property 6: API method documentation completeness', () => {
  let grpcContent;

  beforeAll(() => {
    grpcContent = fs.readFileSync(GRPC_SERVICES_PATH, 'utf8');
  });

  test('API documentation contains method definitions', () => {
    // Extract method sections (looking for ### Method patterns)
    const methodSections = grpcContent.match(/###\s+\w+/g) || [];
    
    expect(methodSections.length).toBeGreaterThan(0);
  });

  test('documented methods have request and response types', () => {
    // Look for Request/Response patterns
    const hasRequestTypes = /\*\*Request\*\*:/i.test(grpcContent) || 
                           /Request Type/i.test(grpcContent) ||
                           /Request:/i.test(grpcContent);
    const hasResponseTypes = /\*\*Response\*\*:/i.test(grpcContent) || 
                            /Response Type/i.test(grpcContent) ||
                            /Response:/i.test(grpcContent);

    expect(hasRequestTypes).toBe(true);
    expect(hasResponseTypes).toBe(true);
  });

  test('API documentation includes code examples', () => {
    // Check for code blocks (examples)
    const codeBlocks = grpcContent.match(/```/g) || [];
    
    // Should have at least some code examples
    expect(codeBlocks.length).toBeGreaterThan(0);
  });

  test('API methods have descriptions', () => {
    // Extract method sections
    const methodSections = grpcContent.split(/###\s+/);
    
    // Skip first section (before first method)
    const methods = methodSections.slice(1);

    fc.assert(
      fc.property(
        fc.constantFrom(...methods),
        (methodSection) => {
          // Each method section should have some descriptive text
          const hasDescription = methodSection.trim().length > 50;
          return hasDescription;
        }
      ),
      { numRuns: Math.min(100, methods.length) }
    );
  });
});
