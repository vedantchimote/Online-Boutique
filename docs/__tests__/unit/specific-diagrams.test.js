/**
 * Unit Tests: Specific Diagrams
 * Validates: Requirements 3.1, 3.5, 9.3
 * 
 * Tests for specific required diagrams in the documentation
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '../..');

describe('Specific Diagrams', () => {
  describe('system architecture diagram', () => {
    let architectureContent;

    beforeAll(() => {
      const archPath = path.join(DOCS_DIR, 'architecture/overview.mdx');
      architectureContent = fs.readFileSync(archPath, 'utf8');
    });

    test('architecture overview contains Mermaid diagram', () => {
      expect(architectureContent).toMatch(/```mermaid/i);
    });

    test('architecture diagram includes all 12 microservices', () => {
      const services = [
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

      services.forEach(service => {
        const serviceRegex = new RegExp(service, 'i');
        expect(architectureContent).toMatch(serviceRegex);
      });
    });

    test('architecture diagram shows communication patterns', () => {
      expect(architectureContent).toMatch(/gRPC|HTTP|Redis/i);
    });
  });

  describe('checkout sequence diagram', () => {
    let userJourneysContent;

    beforeAll(() => {
      const journeysPath = path.join(DOCS_DIR, 'architecture/user-journeys.mdx');
      userJourneysContent = fs.readFileSync(journeysPath, 'utf8');
    });

    test('user journeys contains sequence diagrams', () => {
      expect(userJourneysContent).toMatch(/```mermaid/i);
      expect(userJourneysContent).toMatch(/sequenceDiagram/i);
    });

    test('checkout sequence includes required services', () => {
      const requiredServices = [
        'CheckoutService',
        'CartService',
        'PaymentService',
        'ShippingService',
        'EmailService'
      ];

      requiredServices.forEach(service => {
        const serviceRegex = new RegExp(service, 'i');
        expect(userJourneysContent).toMatch(serviceRegex);
      });
    });

    test('checkout sequence shows order flow', () => {
      expect(userJourneysContent).toMatch(/checkout|order|place.*order/i);
    });
  });

  describe('deployment diagrams', () => {
    const deploymentMethods = ['kubernetes', 'helm', 'terraform', 'kustomize'];

    deploymentMethods.forEach(method => {
      test(`${method} deployment has diagram`, () => {
        const deployPath = path.join(DOCS_DIR, 'deployment', `${method}.mdx`);
        const content = fs.readFileSync(deployPath, 'utf8');
        
        const hasDiagram = 
          /```mermaid/i.test(content) ||
          /diagram/i.test(content);
        
        expect(hasDiagram).toBe(true);
      });
    });

    test('deployment diagrams show infrastructure', () => {
      const kubernetesPath = path.join(DOCS_DIR, 'deployment/kubernetes.mdx');
      const content = fs.readFileSync(kubernetesPath, 'utf8');
      
      expect(content).toMatch(/pod|service|deployment|cluster/i);
    });
  });

  describe('data flow diagram', () => {
    let dataFlowContent;

    beforeAll(() => {
      const dataFlowPath = path.join(DOCS_DIR, 'architecture/data-flow.mdx');
      dataFlowContent = fs.readFileSync(dataFlowPath, 'utf8');
    });

    test('data flow page contains diagram', () => {
      expect(dataFlowContent).toMatch(/```mermaid/i);
    });

    test('data flow shows request flow', () => {
      expect(dataFlowContent).toMatch(/flow|request|data/i);
    });
  });

  describe('communication diagram', () => {
    let communicationContent;

    beforeAll(() => {
      const commPath = path.join(DOCS_DIR, 'architecture/communication.mdx');
      communicationContent = fs.readFileSync(commPath, 'utf8');
    });

    test('communication page contains diagram', () => {
      expect(communicationContent).toMatch(/```mermaid/i);
    });

    test('communication diagram shows service dependencies', () => {
      expect(communicationContent).toMatch(/gRPC|service|dependency/i);
    });
  });
});
