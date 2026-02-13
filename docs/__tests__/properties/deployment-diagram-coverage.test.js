/**
 * Property Test: Deployment Diagram Coverage
 * Feature: mintlify-documentation, Property 8: Deployment diagram coverage
 * Validates: Requirements 9.3
 * 
 * For any deployment method (Kubernetes, Helm, Terraform, Kustomize), 
 * there must exist a corresponding deployment architecture diagram.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');

const DEPLOYMENT_DIR = path.join(__dirname, '../../deployment');

const DEPLOYMENT_METHODS = [
  'kubernetes',
  'helm',
  'terraform',
  'kustomize'
];

describe('Property 8: Deployment diagram coverage', () => {
  test('all deployment methods have diagrams', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...DEPLOYMENT_METHODS),
        (method) => {
          const filePath = path.join(DEPLOYMENT_DIR, `${method}.mdx`);
          
          if (!fs.existsSync(filePath)) {
            return false;
          }

          const content = fs.readFileSync(filePath, 'utf8');
          
          // Check for Mermaid diagram
          const hasMermaidDiagram = /```mermaid/i.test(content);
          
          return hasMermaidDiagram;
        }
      ),
      { numRuns: 100 }
    );
  });

  test('each deployment method contains architecture visualization', () => {
    DEPLOYMENT_METHODS.forEach(method => {
      const filePath = path.join(DEPLOYMENT_DIR, `${method}.mdx`);
      
      expect(fs.existsSync(filePath)).toBe(true);

      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check for diagram indicators
      const hasDiagram = 
        /```mermaid/i.test(content) ||
        /diagram/i.test(content) ||
        /architecture/i.test(content);

      expect(hasDiagram).toBe(true);
    });
  });

  test('deployment diagrams contain deployment-related keywords', () => {
    DEPLOYMENT_METHODS.forEach(method => {
      const filePath = path.join(DEPLOYMENT_DIR, `${method}.mdx`);
      const content = fs.readFileSync(filePath, 'utf8');

      // Extract Mermaid diagrams
      const mermaidMatch = content.match(/```mermaid([\s\S]*?)```/i);
      
      if (mermaidMatch) {
        const diagramContent = mermaidMatch[1];
        
        // Check for deployment-related terms
        const hasDeploymentTerms = 
          /pod|service|deployment|cluster|namespace/i.test(diagramContent) ||
          /kubernetes|k8s|helm|terraform|kustomize/i.test(diagramContent);

        expect(hasDeploymentTerms).toBe(true);
      }
    });
  });
});
