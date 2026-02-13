#!/usr/bin/env node

/**
 * Validates internal links in MDX files
 */

const fs = require('fs');
const path = require('path');

const DOCS_DIR = path.join(__dirname, '..');

let hasErrors = false;
let brokenLinks = [];

function error(file, link, message) {
  console.error(`❌ ${file}: ${link} - ${message}`);
  brokenLinks.push({ file, link, message });
  hasErrors = true;
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
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findMdxFiles(filePath, fileList);
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Extract links from content
function extractLinks(content) {
  const links = [];
  
  // Markdown links: [text](url)
  const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  while ((match = mdLinkRegex.exec(content)) !== null) {
    links.push(match[2]);
  }
  
  // JSX href attributes: href="/path"
  const jsxLinkRegex = /href=["']([^"']+)["']/g;
  while ((match = jsxLinkRegex.exec(content)) !== null) {
    links.push(match[1]);
  }
  
  return links;
}

// Check if link target exists
function checkLink(link, sourceFile) {
  // Skip external links
  if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:')) {
    return true;
  }
  
  // Skip anchors
  if (link.startsWith('#')) {
    return true;
  }
  
  // Remove query params and anchors
  const cleanLink = link.split('?')[0].split('#')[0];
  
  // Handle absolute paths from docs root
  let targetPath;
  if (cleanLink.startsWith('/')) {
    targetPath = path.join(DOCS_DIR, cleanLink.substring(1));
  } else {
    // Relative path
    const sourceDir = path.dirname(sourceFile);
    targetPath = path.join(sourceDir, cleanLink);
  }
  
  // Check if file exists (with or without .mdx extension)
  if (fs.existsSync(targetPath)) {
    return true;
  }
  if (fs.existsSync(targetPath + '.mdx')) {
    return true;
  }
  if (fs.existsSync(targetPath + '.md')) {
    return true;
  }
  
  // Check if it's a directory with index file
  if (fs.existsSync(path.join(targetPath, 'index.mdx'))) {
    return true;
  }
  
  return false;
}

// Validate links in a file
function validateFile(filePath) {
  const relativePath = path.relative(DOCS_DIR, filePath);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const links = extractLinks(content);
    
    links.forEach(link => {
      if (!checkLink(link, filePath)) {
        error(relativePath, link, 'Target not found');
      }
    });
    
  } catch (err) {
    error(relativePath, '', `Failed to read file: ${err.message}`);
  }
}

// Main validation
function main() {
  console.log('🔍 Validating internal links...\n');
  
  const files = findMdxFiles(DOCS_DIR);
  
  console.log(`Checking links in ${files.length} files\n`);
  
  files.forEach(validateFile);
  
  console.log('\n' + '='.repeat(50));
  
  if (hasErrors) {
    console.log(`❌ Found ${brokenLinks.length} broken links`);
    process.exit(1);
  } else {
    console.log('✅ All internal links are valid!');
    process.exit(0);
  }
}

main();
