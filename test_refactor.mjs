import { getFormattedResponse } from './src/utils/searchEngine.js';

console.log('🧪 TESTING REFACTORED CHATBOT SYSTEM\n');

const testCases = [
  {
    name: 'Exact Match - Engineering',
    query: 'What programs does School of Engineering offer?',
    expectedSuccess: true,
    expectedConfidence: 1.0
  },
  {
    name: 'Alias Match - BBA',
    query: 'bba',
    expectedSuccess: true,
    expectedConfidence: 1.0
  },
  {
    name: 'Location Query',
    query: 'Where is Rai University located?',
    expectedSuccess: true,
    expectedConfidence: 1.0
  },
  {
    name: 'No Match - Weather',
    query: 'what is the weather today?',
    expectedSuccess: false,
    expectedConfidence: 0
  },
  {
    name: 'Fuzzy Match - About',
    query: 'tell me about rai university',
    expectedSuccess: true
  }
];

let passed = 0;
let failed = 0;

testCases.forEach((test, idx) => {
  console.log(`\n[Test ${idx + 1}] ${test.name}`);
  console.log(`Query: "${test.query}"`);
  
  const result = getFormattedResponse(test.query);
  
  console.log(`Success: ${result.success}`);
  console.log(`Confidence: ${result.confidence}`);
  console.log(`Match Type: ${result.matchType || 'none'}`);
  
  if (result.success) {
    console.log(`Title: ${result.title || 'N/A'}`);
    console.log(`Has Answer Object: ${!!result.answer}`);
    
    if (result.answer) {
      console.log(`Answer Structure:`);
      console.log(`  - title: ${!!result.answer.title}`);
      console.log(`  - description: ${!!result.answer.description}`);
      console.log(`  - details: ${result.answer.details?.length || 0} items`);
      console.log(`  - specializations: ${result.answer.specializations?.length || 0} items`);
      console.log(`  - source: ${!!result.answer.source}`);
    }
  } else {
    console.log(`Message: ${result.message}`);
  }
  
  // Validate
  let testPassed = true;
  if (test.expectedSuccess !== undefined && result.success !== test.expectedSuccess) {
    console.log(`❌ FAILED: Expected success=${test.expectedSuccess}, got ${result.success}`);
    testPassed = false;
  }
  
  if (test.expectedConfidence !== undefined && result.confidence !== test.expectedConfidence) {
    console.log(`⚠️  WARNING: Expected confidence=${test.expectedConfidence}, got ${result.confidence}`);
  }
  
  if (testPassed && result.success && !result.answer) {
    console.log(`❌ FAILED: No answer object returned for successful match`);
    testPassed = false;
  }
  
  if (testPassed) {
    console.log(`✅ PASSED`);
    passed++;
  } else {
    failed++;
  }
});

console.log(`\n\n${'='.repeat(50)}`);
console.log(`RESULTS: ${passed}/${testCases.length} tests passed`);
console.log(`${'='.repeat(50)}\n`);

if (failed === 0) {
  console.log('🎉 ALL TESTS PASSED! System is working correctly.');
} else {
  console.log(`⚠️  ${failed} test(s) failed. Please review the output above.`);
}
