import { getFormattedResponse } from './searchEngine.js';

const TEST_QUERIES = [
  'BBA',
  'MBA',
  'MCA',
  'BCA',
  'Campus',
  'Placement',
  'Placements',
  'Achievements',
  'Ranking',
  'Rankings',
  'Vision',
  'Mission',
  'Faculty',
  'Research',
  'Innovation',
  'Contact',
  'Address',
  'Email',
  'Phone',
  'Engineering',
  'Pharmacy',
  'Law',
  'Agriculture',
  'Design',
  'Psychology',
  'AI',
  'ML',
  'CSE',
  'IT',
  'NAAC',
  'UGC',
  'Honours'
];

export function runSearchTests() {
  console.log('🧪 Running Search Engine Tests...\n');
  
  let passCount = 0;
  let failCount = 0;
  const failures = [];
  
  TEST_QUERIES.forEach(query => {
    const result = getFormattedResponse(query, 50);
    
    if (result.success) {
      passCount++;
      console.log(`✅ PASS: "${query}" → ${result.title} (${result.confidence}%)`);
    } else {
      failCount++;
      failures.push(query);
      console.log(`❌ FAIL: "${query}" → ${result.message.substring(0, 50)}...`);
    }
  });
  
  console.log(`\n📊 Results: ${passCount}/${TEST_QUERIES.length} passed`);
  
  if (failures.length > 0) {
    console.log(`\n⚠️  Failed queries: ${failures.join(', ')}`);
  } else {
    console.log(`\n🎉 All tests passed! 100% search accuracy achieved.`);
  }
  
  return {
    totalTests: TEST_QUERIES.length,
    passed: passCount,
    failed: failCount,
    successRate: Math.round((passCount / TEST_QUERIES.length) * 100)
  };
}
