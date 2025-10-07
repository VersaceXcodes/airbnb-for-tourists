#!/usr/bin/env node

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testEndpoint(endpoint, method = 'GET', data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      timeout: 5000,
    };
    
    if (data) {
      config.data = data;
      config.headers = { 'Content-Type': 'application/json' };
    }
    
    const response = await axios(config);
    console.log(`✅ ${method} ${endpoint}: ${response.status} - ${JSON.stringify(response.data).substring(0, 100)}...`);
    return true;
  } catch (error) {
    console.log(`❌ ${method} ${endpoint}: ${error.message}`);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Testing API endpoints...\n');
  
  const tests = [
    () => testEndpoint('/api/health'),
    () => testEndpoint('/api'),
    () => testEndpoint('/api/properties'),
    () => testEndpoint('/api/properties?limit=1'),
    () => testEndpoint('/api/auth/login', 'POST', { email: 'johndoe@example.com', password: 'password123' }),
  ];
  
  let passed = 0;
  for (const test of tests) {
    if (await test()) passed++;
    await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between tests
  }
  
  console.log(`\n📊 Results: ${passed}/${tests.length} tests passed`);
  process.exit(passed === tests.length ? 0 : 1);
}

runTests();