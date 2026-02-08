#!/usr/bin/env node

/**
 * Setup Verification Script
 * Checks if all required dependencies and environment variables are configured
 */

const fs = require('fs');
const path = require('path');

const requiredEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY',
  'CLERK_SECRET_KEY',
  'GEMINI_API_KEY',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
];

const optionalEnvVars = [
  'TAVILY_API_KEY',
  'PERPLEXITY_API_KEY',
  'JINA_API_KEY',
  'STRIPE_SECRET_KEY',
];

console.log('🔍 Verifying Agentic Outreach Researcher Setup...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('   Please copy .env.example to .env and fill in your API keys.\n');
  process.exit(1);
}

console.log('✅ .env file found');

// Load environment variables
require('dotenv').config();

// Check required environment variables
let missingRequired = [];
let missingOptional = [];

console.log('\n📋 Checking required environment variables:');
requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value === 'xxxxx' || value.includes('placeholder')) {
    console.log(`   ❌ ${varName} - Missing or placeholder`);
    missingRequired.push(varName);
  } else {
    console.log(`   ✅ ${varName}`);
  }
});

console.log('\n📋 Checking optional environment variables:');
optionalEnvVars.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value === 'xxxxx') {
    console.log(`   ⚠️  ${varName} - Not configured (optional)`);
    missingOptional.push(varName);
  } else {
    console.log(`   ✅ ${varName}`);
  }
});

// Check if Prisma client is generated
const prismaClientPath = path.join(process.cwd(), 'node_modules', '@prisma', 'client');
if (!fs.existsSync(prismaClientPath)) {
  console.log('\n❌ Prisma client not generated');
  console.log('   Run: pnpm db:generate\n');
  process.exit(1);
}
console.log('\n✅ Prisma client generated');

// Summary
console.log('\n' + '='.repeat(50));
if (missingRequired.length > 0) {
  console.log('\n❌ Setup incomplete!');
  console.log('\nMissing required environment variables:');
  missingRequired.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
  console.log('\nPlease update your .env file with the required values.');
  console.log('See .env.example for reference.\n');
  process.exit(1);
} else {
  console.log('\n✅ All required environment variables are configured!');
  
  if (missingOptional.length > 0) {
    console.log('\n⚠️  Optional services not configured:');
    missingOptional.forEach((varName) => {
      console.log(`   - ${varName}`);
    });
    console.log('\nThese are optional but recommended for full functionality.');
  }
  
  console.log('\n🚀 Setup complete! You can now run:');
  console.log('   pnpm dev - Start development server');
  console.log('   pnpm db:push - Push schema to database');
  console.log('   pnpm test - Run tests\n');
}
