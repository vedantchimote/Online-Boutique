/**
 * Unit Tests: Content Migration
 * Validates: Requirements 8.1, 8.3, 8.5
 * 
 * Tests that all existing docs files are accounted for and content is preserved
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../..');
const IMAGES_DIR = path.join(DOCS_DIR, 'images');
const OLD_IMG_DIR = path.join(DOCS_DIR, 'img');

describe('Content Migration', () => {
  describe('documentation files', () => {
    test('introduction page exists', () => {
      const introPath = path.join(DOCS_DIR, 'introduction.mdx');
      expect(fs.existsSync(introPath)).toBe(true);
    });

    test('getting started pages exist', () => {
      const pages = ['quickstart', 'prerequisites', 'local-setup'];
      pages.forEach(page => {
        const pagePath = path.join(DOCS_DIR, 'getting-started', `${page}.mdx`);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    test('architecture pages exist', () => {
      const pages = ['overview', 'communication', 'data-flow', 'user-journeys'];
      pages.forEach(page => {
        const pagePath = path.join(DOCS_DIR, 'architecture', `${page}.mdx`);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    test('deployment pages exist', () => {
      const pages = ['overview', 'kubernetes', 'helm', 'terraform', 'kustomize', 'optional-components'];
      pages.forEach(page => {
        const pagePath = path.join(DOCS_DIR, 'deployment', `${page}.mdx`);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    test('development pages exist', () => {
      const pages = ['setup', 'building', 'testing', 'adding-service', 'contributing'];
      pages.forEach(page => {
        const pagePath = path.join(DOCS_DIR, 'development', `${page}.mdx`);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    test('API reference pages exist', () => {
      const pages = ['overview', 'proto-definitions', 'grpc-services'];
      pages.forEach(page => {
        const pagePath = path.join(DOCS_DIR, 'api-reference', `${page}.mdx`);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });
  });

  describe('image migration', () => {
    test('images directory exists', () => {
      expect(fs.existsSync(IMAGES_DIR)).toBe(true);
    });

    test('required images are present', () => {
      const requiredImages = [
        'architecture-diagram.png',
        'online-boutique-frontend-1.png',
        'online-boutique-frontend-2.png',
        'memorystore.png'
      ];

      requiredImages.forEach(image => {
        const imagePath = path.join(IMAGES_DIR, image);
        expect(fs.existsSync(imagePath)).toBe(true);
      });
    });

    test('images are copied from original location', () => {
      if (fs.existsSync(OLD_IMG_DIR)) {
        const oldImages = fs.readdirSync(OLD_IMG_DIR);
        oldImages.forEach(image => {
          const newImagePath = path.join(IMAGES_DIR, image);
          expect(fs.existsSync(newImagePath)).toBe(true);
        });
      }
    });
  });

  describe('content preservation', () => {
    test('introduction contains overview content', () => {
      const introPath = path.join(DOCS_DIR, 'introduction.mdx');
      const content = fs.readFileSync(introPath, 'utf8');
      
      expect(content).toContain('Online Boutique');
      expect(content.length).toBeGreaterThan(100);
    });

    test('microservice pages contain service information', () => {
      const services = ['frontend', 'cartservice', 'productcatalogservice'];
      
      services.forEach(service => {
        const servicePath = path.join(DOCS_DIR, 'microservices', `${service}.mdx`);
        const content = fs.readFileSync(servicePath, 'utf8');
        
        expect(content.length).toBeGreaterThan(200);
        expect(content).toMatch(/##\s+Overview/i);
      });
    });

    test('deployment pages contain deployment instructions', () => {
      const methods = ['kubernetes', 'helm'];
      
      methods.forEach(method => {
        const methodPath = path.join(DOCS_DIR, 'deployment', `${method}.mdx`);
        const content = fs.readFileSync(methodPath, 'utf8');
        
        expect(content.length).toBeGreaterThan(200);
        expect(content).toMatch(/deploy/i);
      });
    });
  });
});
