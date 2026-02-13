const fs = require('fs');
const path = require('path');

const microservicesDir = path.join(__dirname, '..', 'microservices');
const requiredSections = ['Overview', 'Key Features'];

const microservices = [
  'frontend', 'cartservice', 'productcatalogservice', 'currencyservice',
  'paymentservice', 'shippingservice', 'emailservice', 'checkoutservice',
  'recommendationservice', 'adservice', 'loadgenerator', 'shoppingassistantservice'
];

let allValid = true;

microservices.forEach(service => {
  const filePath = path.join(microservicesDir, `${service}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Missing file: ${service}.mdx`);
    allValid = false;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for frontmatter
  if (!content.startsWith('---')) {
    console.error(`❌ ${service}.mdx: Missing frontmatter`);
    allValid = false;
  }
  
  // Check for required sections
  const missingSections = requiredSections.filter(section => 
    !content.includes(`## ${section}`)
  );
  
  if (missingSections.length > 0) {
    console.error(`❌ ${service}.mdx: Missing sections: ${missingSections.join(', ')}`);
    allValid = false;
  } else {
    console.log(`✅ ${service}.mdx: All required sections present`);
  }
});

if (allValid) {
  console.log('\n✅ All microservice documentation is complete!');
  process.exit(0);
} else {
  console.log('\n❌ Some microservice documentation is incomplete');
  process.exit(1);
}
