/**
 * Unit Tests: Configuration Validation
 * Validates: Requirements 1.1
 * 
 * Tests for mint.json parsing and validation
 */

const fs = require('fs');
const path = require('path');

const MINT_JSON_PATH = path.join(__dirname, '../../mint.json');

describe('Configuration Validation', () => {
  describe('mint.json parsing', () => {
    test('mint.json file exists', () => {
      expect(fs.existsSync(MINT_JSON_PATH)).toBe(true);
    });

    test('mint.json contains valid JSON', () => {
      const content = fs.readFileSync(MINT_JSON_PATH, 'utf8');
      expect(() => JSON.parse(content)).not.toThrow();
    });

    test('parsed configuration is an object', () => {
      const content = fs.readFileSync(MINT_JSON_PATH, 'utf8');
      const config = JSON.parse(content);
      expect(typeof config).toBe('object');
      expect(config).not.toBeNull();
    });
  });

  describe('required fields', () => {
    let config;

    beforeAll(() => {
      const content = fs.readFileSync(MINT_JSON_PATH, 'utf8');
      config = JSON.parse(content);
    });

    test('has name field', () => {
      expect(config.name).toBeDefined();
      expect(typeof config.name).toBe('string');
      expect(config.name.length).toBeGreaterThan(0);
    });

    test('has navigation field', () => {
      expect(config.navigation).toBeDefined();
      expect(Array.isArray(config.navigation)).toBe(true);
    });

    test('navigation is not empty', () => {
      expect(config.navigation.length).toBeGreaterThan(0);
    });

    test('has colors configuration', () => {
      expect(config.colors).toBeDefined();
      expect(typeof config.colors).toBe('object');
    });
  });

  describe('error handling', () => {
    test('handles invalid JSON gracefully', () => {
      const invalidJson = '{ "name": "test", invalid }';
      expect(() => JSON.parse(invalidJson)).toThrow(SyntaxError);
    });

    test('handles missing required fields', () => {
      const incompleteConfig = { name: 'Test' };
      expect(incompleteConfig.navigation).toBeUndefined();
    });

    test('validates navigation structure', () => {
      const content = fs.readFileSync(MINT_JSON_PATH, 'utf8');
      const config = JSON.parse(content);
      
      config.navigation.forEach(group => {
        expect(group.group).toBeDefined();
        expect(group.pages).toBeDefined();
        expect(Array.isArray(group.pages)).toBe(true);
      });
    });
  });

  describe('navigation structure', () => {
    let config;

    beforeAll(() => {
      const content = fs.readFileSync(MINT_JSON_PATH, 'utf8');
      config = JSON.parse(content);
    });

    test('has expected navigation groups', () => {
      const expectedGroups = [
        'Getting Started',
        'Architecture',
        'Microservices',
        'Deployment',
        'Development',
        'API Reference'
      ];

      const actualGroups = config.navigation.map(g => g.group);
      expectedGroups.forEach(expected => {
        expect(actualGroups).toContain(expected);
      });
    });

    test('all navigation groups have pages', () => {
      config.navigation.forEach(group => {
        expect(group.pages.length).toBeGreaterThan(0);
      });
    });

    test('microservices group has 13 pages', () => {
      const microservicesGroup = config.navigation.find(g => g.group === 'Microservices');
      expect(microservicesGroup).toBeDefined();
      expect(microservicesGroup.pages.length).toBe(13); // overview + 12 services
    });
  });
});
