/**
 * Unit Tests: Required Pages
 * Validates: Requirements 2.1, 2.2, 2.5, 5.1
 * 
 * Tests that all required documentation pages exist
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const DOCS_DIR = path.join(__dirname, '../..');

describe('Required Pages', () => {
  describe('microservice pages', () => {
    const microservices = [
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

    test('all 12 microservice pages exist', () => {
      microservices.forEach(service => {
        const servicePath = path.join(DOCS_DIR, 'microservices', `${service}.mdx`);
        expect(fs.existsSync(servicePath)).toBe(true);
      });
    });

    test('microservices overview page exists', () => {
      const overviewPath = path.join(DOCS_DIR, 'microservices/overview.mdx');
      expect(fs.existsSync(overviewPath)).toBe(true);
    });

    test('each microservice page has valid frontmatter', () => {
      microservices.forEach(service => {
        const servicePath = path.join(DOCS_DIR, 'microservices', `${service}.mdx`);
        const content = fs.readFileSync(servicePath, 'utf8');
        const { data } = matter(content);
        
        expect(data.title).toBeDefined();
        expect(data.description).toBeDefined();
      });
    });
  });

  describe('navigation groups', () => {
    let mintConfig;

    beforeAll(() => {
      const mintPath = path.join(DOCS_DIR, 'mint.json');
      const content = fs.readFileSync(mintPath, 'utf8');
      mintConfig = JSON.parse(content);
    });

    test('has 6 main navigation groups', () => {
      expect(mintConfig.navigation.length).toBe(6);
    });

    test('navigation groups have correct names', () => {
      const expectedGroups = [
        'Getting Started',
        'Architecture',
        'Microservices',
        'Deployment',
        'Development',
        'API Reference'
      ];

      const actualGroups = mintConfig.navigation.map(g => g.group);
      expectedGroups.forEach(expected => {
        expect(actualGroups).toContain(expected);
      });
    });

    test('each navigation group has pages', () => {
      mintConfig.navigation.forEach(group => {
        expect(group.pages).toBeDefined();
        expect(Array.isArray(group.pages)).toBe(true);
        expect(group.pages.length).toBeGreaterThan(0);
      });
    });
  });

  describe('homepage', () => {
    test('introduction page exists', () => {
      const introPath = path.join(DOCS_DIR, 'introduction.mdx');
      expect(fs.existsSync(introPath)).toBe(true);
    });

    test('homepage has required content', () => {
      const introPath = path.join(DOCS_DIR, 'introduction.mdx');
      const content = fs.readFileSync(introPath, 'utf8');
      const { data, content: markdown } = matter(content);
      
      expect(data.title).toBeDefined();
      expect(data.description).toBeDefined();
      expect(markdown.length).toBeGreaterThan(100);
    });

    test('homepage contains overview', () => {
      const introPath = path.join(DOCS_DIR, 'introduction.mdx');
      const content = fs.readFileSync(introPath, 'utf8');
      
      expect(content).toMatch(/Online Boutique/i);
      expect(content).toMatch(/microservice/i);
    });
  });

  describe('deployment method pages', () => {
    const deploymentMethods = ['kubernetes', 'helm', 'terraform', 'kustomize'];

    test('all 4 deployment method pages exist', () => {
      deploymentMethods.forEach(method => {
        const methodPath = path.join(DOCS_DIR, 'deployment', `${method}.mdx`);
        expect(fs.existsSync(methodPath)).toBe(true);
      });
    });

    test('deployment overview page exists', () => {
      const overviewPath = path.join(DOCS_DIR, 'deployment/overview.mdx');
      expect(fs.existsSync(overviewPath)).toBe(true);
    });

    test('each deployment page has valid frontmatter', () => {
      deploymentMethods.forEach(method => {
        const methodPath = path.join(DOCS_DIR, 'deployment', `${method}.mdx`);
        const content = fs.readFileSync(methodPath, 'utf8');
        const { data } = matter(content);
        
        expect(data.title).toBeDefined();
        expect(data.description).toBeDefined();
      });
    });

    test('optional components page exists', () => {
      const optionalPath = path.join(DOCS_DIR, 'deployment/optional-components.mdx');
      expect(fs.existsSync(optionalPath)).toBe(true);
    });
  });

  describe('essential documentation sections', () => {
    test('getting started section is complete', () => {
      const pages = ['quickstart', 'prerequisites', 'local-setup'];
      pages.forEach(page => {
        const pagePath = path.join(DOCS_DIR, 'getting-started', `${page}.mdx`);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    test('architecture section is complete', () => {
      const pages = ['overview', 'communication', 'data-flow', 'user-journeys'];
      pages.forEach(page => {
        const pagePath = path.join(DOCS_DIR, 'architecture', `${page}.mdx`);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    test('development section is complete', () => {
      const pages = ['setup', 'building', 'testing', 'adding-service', 'contributing'];
      pages.forEach(page => {
        const pagePath = path.join(DOCS_DIR, 'development', `${page}.mdx`);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });

    test('API reference section is complete', () => {
      const pages = ['overview', 'proto-definitions', 'grpc-services'];
      pages.forEach(page => {
        const pagePath = path.join(DOCS_DIR, 'api-reference', `${page}.mdx`);
        expect(fs.existsSync(pagePath)).toBe(true);
      });
    });
  });
});
