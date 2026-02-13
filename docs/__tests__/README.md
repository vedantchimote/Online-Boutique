# Documentation Tests

This directory contains comprehensive tests for the Mintlify documentation system.

## Test Structure

### Property-Based Tests (`properties/`)

Property-based tests validate universal correctness properties across all documentation content. Each test runs a minimum of 100 iterations using the `fast-check` library.

- **navigation-depth.test.js** - Validates navigation depth constraint (≤3 levels)
- **microservice-completeness.test.js** - Validates all microservices have complete documentation
- **architecture-completeness.test.js** - Validates architecture documentation completeness
- **deployment-completeness.test.js** - Validates deployment documentation completeness
- **api-method-completeness.test.js** - Validates API method documentation completeness
- **mdx-format-compliance.test.js** - Validates MDX format compliance
- **deployment-diagram-coverage.test.js** - Validates deployment diagram coverage
- **code-block-syntax.test.js** - Validates code block syntax highlighting
- **internal-link-validity.test.js** - Validates internal link validity
- **mermaid-diagram-validity.test.js** - Validates Mermaid diagram validity
- **code-example-validity.test.js** - Validates code example syntax validity

### Unit Tests (`unit/`)

Unit tests focus on specific scenarios and requirements.

- **config-validation.test.js** - Tests mint.json parsing and validation
- **content-migration.test.js** - Tests content migration and preservation
- **specific-diagrams.test.js** - Tests specific required diagrams
- **required-pages.test.js** - Tests all required pages exist
- **build-process.test.js** - Tests build validation

## Running Tests

### Run all tests
```bash
npm test
```

### Run only unit tests
```bash
npm run test:unit
```

### Run only property-based tests
```bash
npm run test:properties
```

### Run tests in watch mode
```bash
npm run test:watch
```

### Run tests with coverage
```bash
npm run test:coverage
```

### Run validation and tests together
```bash
npm run test:all
```

## Test Status

The test suite includes:
- **11 property-based tests** validating universal correctness properties
- **5 unit test suites** validating specific scenarios
- **100+ test cases** total

Current test status: Most tests passing. Some tests may fail if documentation structure varies from expected patterns. Tests are designed to be flexible and validate essential requirements rather than enforce rigid structure.

## Test Requirements

- Node.js >= 18.0.0
- All dependencies installed (`npm install`)

## Dependencies

- **jest** - Test framework
- **fast-check** - Property-based testing library
- **gray-matter** - Frontmatter parser
- **glob** - File pattern matching

## Writing New Tests

### Property-Based Tests

Property-based tests should:
1. Run minimum 100 iterations
2. Use `fc.assert()` with `fc.property()`
3. Include feature tag in comments
4. Validate universal properties

Example:
```javascript
test('property description', () => {
  fc.assert(
    fc.property(
      fc.constantFrom(...items),
      (item) => {
        // Test logic
        return condition;
      }
    ),
    { numRuns: 100 }
  );
});
```

### Unit Tests

Unit tests should:
1. Test specific scenarios
2. Use descriptive test names
3. Group related tests with `describe()`
4. Include clear assertions

Example:
```javascript
describe('Feature', () => {
  test('specific behavior', () => {
    expect(actual).toBe(expected);
  });
});
```

## Continuous Integration

Tests are automatically run in CI/CD pipeline on:
- Pull requests
- Merges to main branch

All tests must pass before merging.
