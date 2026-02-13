#!/usr/bin/env node

/**
 * Validates MDX files for proper frontmatter and syntax
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..');

let hasErrors = false;
let fileCount = 0;

function error(file, message) {
  console.error(`❌ ${file}: ${message}`);
  hasErrors = true;
}

function warn(file, message) {
  console.warn(`⚠️  ${file}: ${message}`);
}

function success(message) {
  console.log(`✅ ${message}`);
}

// Find all MDX files
function findMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and hidden directories
      if (!file.startsWith('.') && file !== 'node_modules') {
        findMdxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Parse frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }
  
  const frontmatter = {};
  const lines = match[1].split('\n');
  
  lines.forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes
      if ((value.startsWith("'") && value.endsWith("'")) ||
          (value.startsWith('"') && value.endsWith('"'))) {
        value = value.slice(1, -1);
      }
      
      frontmatter[key] = value;
    }
  });
  
  return frontmatter;
}

// Validate a single MDX file
function validateMdxFile(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  fileCount++;
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check for frontmatter
    if (!content.startsWith('---')) {
      error(relativePath, 'Missing frontmatter');
      return;
    }
    
    const frontmatter = parseFrontmatter(content);
    
    if (!frontmatter) {
      error(relativePath, 'Invalid frontmatter format');
      return;
    }
    
    // Check required frontmatter fields
    if (!frontmatter.title) {
      error(relativePath, 'Missing required field: title');
    }
    
    if (!frontmatter.description) {
      warn(relativePath, 'Missing recommended field: description');
    }
    
    // Check for empty content
    const contentWithoutFrontmatter = content.replace(/^---\n[\s\S]*?\n---\n/, '');
    if (contentWithoutFrontmatter.trim().length === 0) {
      warn(relativePath, 'File has no content');
    }
    
    // Basic MDX syntax checks
    const openBraces = (content.match(/{/g) || []).length;
    const closeBraces = (content.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      warn(relativePath, 'Mismatched braces - possible JSX syntax error');
    }
    
  } catch (err) {
    error(relativePath, `Failed to read file: ${err.message}`);
  }
}

// Main validation
function main() {
  console.log('🔍 Validating MDX files...\n');
  
  const mdxFiles = findMdxFiles(DOCS_DIR);
  
  if (mdxFiles.length === 0) {
    error('', 'No MDX files found');
    process.exit(1);
  }
  
  console.log(`Found ${mdxFiles.length} MDX files\n`);
  
  mdxFiles.forEach(validateMdxFile);
  
  console.log('\n' + '='.repeat(50));
  
  if (hasErrors) {
    console.log(`❌ Validation failed - checked ${fileCount} files`);
    process.exit(1);
  } else {
    console.log(`✅ All ${fileCount} MDX files are valid!`);
    process.exit(0);
  }
}

main();
