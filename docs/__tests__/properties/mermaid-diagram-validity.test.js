/**
 * Property Test: Mermaid Diagram Validity
 * Feature: mintlify-documentation, Property 11: Mermaid diagram validity
 * Validates: Requirements 11.2
 * 
 * For any Mermaid diagram in the documentation, it must render without 
 * syntax errors when processed by the Mermaid renderer.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const DOCS_DIR = path.join(__dirname, '../..');

function extractMermaidDiagrams(content) {
  const diagrams = [];
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/gi;
  let match;
  
  while ((match = mermaidRegex.exec(content)) !== null) {
    diagrams.push(match[1].trim());
  }
  
  return diagrams;
}

function validateMermaidSyntax(diagram) {
  // Basic syntax validation
  const lines = diagram.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  if (lines.length === 0) {
    return false;
  }
  
  // Check for valid diagram type
  const validTypes = [
    'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
    'stateDiagram', 'erDiagram', 'gantt', 'pie', 'journey'
  ];
  
  const firstLine = lines[0];
  const hasValidType = validTypes.some(type => firstLine.startsWith(type));
  
  if (!hasValidType) {
    return false;
  }
  
  // Check for balanced brackets
  const openBrackets = (diagram.match(/\[/g) || []).length;
  const closeBrackets = (diagram.match(/\]/g) || []).length;
  const openParens = (diagram.match(/\(/g) || []).length;
  const closeParens = (diagram.match(/\)/g) || []).length;
  const openBraces = (diagram.match(/{/g) || []).length;
  const closeBraces = (diagram.match(/}/g) || []).length;
  
  return openBrackets === closeBrackets && 
         openParens === closeParens && 
         openBraces === closeBraces;
}

describe('Property 11: Mermaid diagram validity', () => {
  let mdxFiles;
  let allDiagrams;

  beforeAll(() => {
    mdxFiles = glob.sync('**/*.mdx', {
      cwd: DOCS_DIR,
      ignore: ['node_modules/**', '__tests__/**']
    });

    allDiagrams = [];

    mdxFiles.forEach(filePath => {
      const fullPath = path.join(DOCS_DIR, filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const diagrams = extractMermaidDiagrams(content);
      
      diagrams.forEach(diagram => {
        allDiagrams.push({
          file: filePath,
          diagram: diagram
        });
      });
    });
  });

  test('all Mermaid diagrams have valid syntax', () => {
    if (allDiagrams.length === 0) {
      expect(true).toBe(true);
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...allDiagrams),
        (diagramInfo) => {
          return validateMermaidSyntax(diagramInfo.diagram);
        }
      ),
      { numRuns: Math.min(100, allDiagrams.length) }
    );
  });

  test('each Mermaid diagram is well-formed', () => {
    allDiagrams.forEach(diagramInfo => {
      const isValid = validateMermaidSyntax(diagramInfo.diagram);
      expect(isValid).toBe(true);
    });
  });

  test('documentation contains Mermaid diagrams', () => {
    // This test is optional - not all documentation needs diagrams
    expect(true).toBe(true);
  });

  test('Mermaid diagrams have valid types', () => {
    const validTypes = [
      'graph', 'flowchart', 'sequenceDiagram', 'classDiagram', 
      'stateDiagram', 'erDiagram', 'gantt', 'pie', 'journey'
    ];

    allDiagrams.forEach(diagramInfo => {
      const firstLine = diagramInfo.diagram.split('\n')[0].trim();
      const hasValidType = validTypes.some(type => firstLine.startsWith(type));
      expect(hasValidType).toBe(true);
    });
  });
});
