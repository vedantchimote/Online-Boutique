#!/usr/bin/env node

/**
 * Validates mint.json configuration file
 * Checks for required fields, valid structure, and referenced pages
 */

const fs = require('fs');
const path = require('path');

const MINT_JSON_PATH = path.join(__dirname, '..', 'mint.json');
const DOCS_DIR = path.join(__dirname, '..');

let hasErrors = false;

function error(message) {
  console.error(`❌ ERROR: ${message}`);
  hasErrors = true;
}

function warn(message) {
  console.warn(`⚠️  WARNING: ${message}`);
}

function success(message) {
  console.log(`✅ ${message}`);
}

// Read and parse mint.json
function readMintJson() {
  try {
    const content = fs.readFileSync(MINT_JSON_PATH, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      error('mint.json file not found');
    } else if (err instanceof SyntaxError) {
      error(`Invalid JSON in mint.json: ${err.message}`);
    } else {
      error(`Failed to read mint.json: ${err.message}`);
    }
    process.exit(1);
  }
}

// Validate required fields
function validateRequiredFields(config) {
  const requiredFields = ['name', 'navigation'];
  const missingFields = requiredFields.filter(field => !config[field]);
  
  if (missingFields.length > 0) {
    error(`Missing required fields: ${missingFields.join(', ')}`);
  } else {
    success('All required fields present');
  }
}

// Validate navigation structure
function validateNavigation(navigation) {
  if (!Array.isArray(navigation)) {
    error('navigation must be an array');
    return;
  }
  
  if (navigation.length === 0) {
    error('navigation array is empty');
    return;
  }
  
  success(`Found ${navigation.length} navigation groups`);
  
  navigation.forEach((group, index) => {
    if (!group.group) {
      error(`Navigation group at index ${index} missing 'group' field`);
    }
    
    if (!group.pages || !Array.isArray(group.pages)) {
      error(`Navigation group '${group.group}' missing or invalid 'pages' array`);
      return;
    }
    
    if (group.pages.length === 0) {
      warn(`Navigation group '${group.group}' has no pages`);
    }
    
    // Check for duplicate pages
    const pageCounts = {};
    group.pages.forEach(page => {
      pageCounts[page] = (pageCounts[page] || 0) + 1;
    });
    
    Object.entries(pageCounts).forEach(([page, count]) => {
      if (count > 1) {
        warn(`Page '${page}' appears ${count} times in group '${group.group}'`);
      }
    });
  });
}

// Check if referenced pages exist
function validatePageReferences(navigation) {
  const allPages = [];
  
  navigation.forEach(group => {
    if (group.pages && Array.isArray(group.pages)) {
      allPages.push(...group.pages);
    }
  });
  
  let missingCount = 0;
  let foundCount = 0;
  
  allPages.forEach(page => {
    const mdxPath = path.join(DOCS_DIR, `${page}.mdx`);
    const mdPath = path.join(DOCS_DIR, `${page}.md`);
    
    if (fs.existsSync(mdxPath) || fs.existsSync(mdPath)) {
      foundCount++;
    } else {
      error(`Referenced page not found: ${page}.mdx`);
      missingCount++;
    }
  });
  
  if (missingCount === 0) {
    success(`All ${foundCount} referenced pages exist`);
  } else {
    error(`${missingCount} referenced pages are missing`);
  }
}

// Validate colors configuration
function validateColors(config) {
  if (!config.colors) {
    warn('No colors configuration found');
    return;
  }
  
  const recommendedColors = ['primary', 'light', 'dark'];
  const missingColors = recommendedColors.filter(color => !config.colors[color]);
  
  if (missingColors.length > 0) {
    warn(`Missing recommended colors: ${missingColors.join(', ')}`);
  } else {
    success('Color configuration complete');
  }
}

// Validate logo configuration
function validateLogo(config) {
  if (!config.logo) {
    warn('No logo configuration found');
    return;
  }
  
  if (typeof config.logo === 'string') {
    const logoPath = path.join(DOCS_DIR, config.logo);
    if (!fs.existsSync(logoPath)) {
      warn(`Logo file not found: ${config.logo}`);
    } else {
      success('Logo file exists');
    }
  } else if (typeof config.logo === 'object') {
    if (config.logo.light) {
      const lightPath = path.join(DOCS_DIR, config.logo.light);
      if (!fs.existsSync(lightPath)) {
        warn(`Light logo file not found: ${config.logo.light}`);
      }
    }
    if (config.logo.dark) {
      const darkPath = path.join(DOCS_DIR, config.logo.dark);
      if (!fs.existsSync(darkPath)) {
        warn(`Dark logo file not found: ${config.logo.dark}`);
      }
    }
    if (config.logo.light || config.logo.dark) {
      success('Logo configuration present');
    }
  }
}

// Check navigation depth
function validateNavigationDepth(navigation) {
  const maxDepth = 3;
  let exceedsDepth = false;
  
  navigation.forEach(group => {
    if (group.pages && Array.isArray(group.pages)) {
      group.pages.forEach(page => {
        const depth = page.split('/').length;
        if (depth > maxDepth) {
          warn(`Page '${page}' exceeds recommended depth of ${maxDepth} (depth: ${depth})`);
          exceedsDepth = true;
        }
      });
    }
  });
  
  if (!exceedsDepth) {
    success('All pages within recommended navigation depth');
  }
}

// Main validation
function main() {
  console.log('🔍 Validating mint.json...\n');
  
  const config = readMintJson();
  
  validateRequiredFields(config);
  validateNavigation(config.navigation);
  validatePageReferences(config.navigation);
  validateColors(config);
  validateLogo(config);
  validateNavigationDepth(config.navigation);
  
  console.log('\n' + '='.repeat(50));
  
  if (hasErrors) {
    console.log('❌ Validation failed with errors');
    process.exit(1);
  } else {
    console.log('✅ Validation passed!');
    process.exit(0);
  }
}

main();
