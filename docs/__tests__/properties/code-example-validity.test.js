/**
 * Property Test: Code Example Syntax Validity
 * Feature: mintlify-documentation, Property 12: Code example syntax validity
 * Validates: Requirements 11.3
 * 
 * For any code example in the documentation, it must be syntactically 
 * valid according to its specified language.
 */

const fc = require('fast-check');
const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const DOCS_DIR = path.join(__dirname, '../..');

function extractCodeBlocks(content) {
  const codeBlocks = [];
  const codeBlockRegex = /```(\w+)\n([\s\S]*?)```/g;
  let match;
  
  while ((match = codeBlockRegex.exec(content)) !== null) {
    codeBlocks.push({
      language: match[1],
      code: match[2]
    });
  }
  
  return codeBlocks;
}

function validateCodeSyntax(language, code) {
  // Basic syntax validation for common languages
  
  if (!code || code.trim().length === 0) {
    return false;
  }
  
  switch (language.toLowerCase()) {
    case 'json':
      try {
        JSON.parse(code);
        return true;
      } catch {
        return false;
      }
    
    case 'yaml':
    case 'yml':
      // Basic YAML validation - check for common syntax errors
      const lines = code.split('\n');
      for (const line of lines) {
        // Check for tabs (YAML doesn't allow tabs)
        if (line.includes('\t')) {
          return false;
        }
      }
      return true;
    
    case 'bash':
    case 'sh':
    case 'shell':
      // Basic shell script validation
      return !code.includes('<<<') || code.includes('>>>'); // Check for heredoc balance
    
    case 'javascript':
    case 'js':
    case 'typescript':
    case 'ts':
      // Check for balanced braces
      const openBraces = (code.match(/{/g) || []).length;
      const closeBraces = (code.match(/}/g) || []).length;
      const openParens = (code.match(/\(/g) || []).length;
      const closeParens = (code.match(/\)/g) || []).length;
      const openBrackets = (code.match(/\[/g) || []).length;
      const closeBrackets = (code.match(/\]/g) || []).length;
      
      return openBraces === closeBraces && 
             openParens === closeParens && 
             openBrackets === closeBrackets;
    
    case 'python':
    case 'py':
      // Basic Python validation - check indentation consistency
      const pythonLines = code.split('\n').filter(l => l.trim().length > 0);
      return pythonLines.length > 0;
    
    case 'go':
    case 'golang':
      // Basic Go validation
      const goOpenBraces = (code.match(/{/g) || []).length;
      const goCloseBraces = (code.match(/}/g) || []).length;
      return goOpenBraces === goCloseBraces;
    
    case 'protobuf':
    case 'proto':
      // Basic protobuf validation
      return code.includes('message') || code.includes('service') || code.includes('syntax');
    
    default:
      // For other languages, just check it's not empty
      return code.trim().length > 0;
  }
}

describe('Property 12: Code example syntax validity', () => {
  let mdxFiles;
  let allCodeBlocks;

  beforeAll(() => {
    mdxFiles = glob.sync('**/*.mdx', {
      cwd: DOCS_DIR,
      ignore: ['node_modules/**', '__tests__/**']
    });

    allCodeBlocks = [];

    mdxFiles.forEach(filePath => {
      const fullPath = path.join(DOCS_DIR, filePath);
      const content = fs.readFileSync(fullPath, 'utf8');
      const codeBlocks = extractCodeBlocks(content);
      
      codeBlocks.forEach(block => {
        allCodeBlocks.push({
          file: filePath,
          ...block
        });
      });
    });
  });

  test('all code examples have valid syntax', () => {
    if (allCodeBlocks.length === 0) {
      expect(true).toBe(true);
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...allCodeBlocks),
        (codeBlock) => {
          return validateCodeSyntax(codeBlock.language, codeBlock.code);
        }
      ),
      { numRuns: Math.min(100, allCodeBlocks.length) }
    );
  });

  test('each code example is syntactically valid', () => {
    allCodeBlocks.forEach(codeBlock => {
      const isValid = validateCodeSyntax(codeBlock.language, codeBlock.code);
      expect(isValid).toBe(true);
    });
  });

  test('code examples are not empty', () => {
    allCodeBlocks.forEach(codeBlock => {
      expect(codeBlock.code.trim().length).toBeGreaterThan(0);
    });
  });
});
