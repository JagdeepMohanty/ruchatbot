import { searchBrochure, getFormattedResponse } from './src/utils/searchEngine.js';

console.log('🧪 STRICT SEARCH ENGINE VALIDATION\n');
console.log('=' .repeat(60));

const testCases = [
  // PRIORITY 1: Exact Question Match (1.0)
  {
    name: 'Exact Question - Engineering',
    query: 'What programs does School of Engineering offer?',
    expectedScore: 1.0,
    expectedMatchType: 'exact_question',
    shouldMatch: true
  },
  {
    name: 'Exact Alias - About University',
    query: 'Tell me about Rai University',
    expectedScore: 1.0,
    expectedMatchType: 'exact_alias',
    shouldMatch: true
  },
  
  // PRIORITY 2: Alias Map (0.95)
  {
    name: 'Alias Map - BBA',
    query: 'bba',
    expectedScore: 0.95,
    expectedMatchType: 'alias_map',
    shouldMatch: true
  },
  {
    name: 'Alias Map - Engineering',
    query: 'engineering',
    expectedScore: 0.95,
    expectedMatchType: 'alias_map',
    shouldMatch: true
  },
  {
    name: 'Alias Map - Placement',
    query: 'placement',
    expectedScore: 0.95,
    expectedMatchType: 'alias_map',
    shouldMatch: true
  },
  
  // PRIORITY 3: Keyword Overlap (0.80-0.90)
  {
    name: 'Keyword Overlap - Admission Process',
    query: 'admission requirements eligibility',
    expectedMinScore: 0.75,
    expectedMatchType: 'keyword_overlap',
    shouldMatch: true
  },
  {
    name: 'Keyword Overlap - University Location',
    query: 'ahmedabad campus address',
    expectedMinScore: 0.75,
    expectedMatchType: 'keyword_overlap',
    shouldMatch: true
  },
  
  // PRIORITY 4: Semantic Match (0.85+)
  {
    name: 'Semantic - About University',
    query: 'tell me about rai university',
    expectedMinScore: 0.85,
    shouldMatch: true
  },
  
  // REJECTION: Below 0.75 threshold
  {
    name: 'Reject - Unrelated Query (weather)',
    query: 'what is the weather today',
    expectedScore: 0,
    shouldMatch: false
  },
  {
    name: 'Reject - Random Text',
    query: 'xyz abc random',
    expectedScore: 0,
    shouldMatch: false
  },
  {
    name: 'Reject - Single Character',
    query: 'a',
    expectedScore: 0,
    shouldMatch: false
  },
  
  // DETERMINISTIC: Same query = same result
  {
    name: 'Deterministic Test - BBA (Repeat)',
    query: 'bba',
    expectedScore: 0.95,
    expectedMatchType: 'alias_map',
    shouldMatch: true
  },
  {
    name: 'Deterministic Test - Engineering (Repeat)',
    query: 'What programs does School of Engineering offer?',
    expectedScore: 1.0,
    expectedMatchType: 'exact_question',
    shouldMatch: true
  }
];

let passed = 0;
let failed = 0;
const failures = [];

testCases.forEach((test, idx) => {
  console.log(`\n[Test ${idx + 1}/${testCases.length}] ${test.name}`);
  console.log(`Query: "${test.query}"`);
  
  const result = searchBrochure(test.query);
  const uiResponse = getFormattedResponse(test.query);
  
  console.log(`Raw Score: ${result.confidenceScore.toFixed(3)}`);
  console.log(`Match Type: ${result.matchType || 'none'}`);
  console.log(`Has Match: ${!!result.matchedEntry}`);
  console.log(`UI Success: ${uiResponse.success}`);
  
  let testPassed = true;
  const reasons = [];
  
  // Validate shouldMatch
  if (test.shouldMatch && !result.matchedEntry) {
    testPassed = false;
    reasons.push(`Expected match but got none`);
  }
  
  if (!test.shouldMatch && result.matchedEntry) {
    testPassed = false;
    reasons.push(`Expected NO match but got: ${result.matchedEntry.id}`);
  }
  
  // Validate exact score
  if (test.expectedScore !== undefined) {
    if (Math.abs(result.confidenceScore - test.expectedScore) > 0.01) {
      testPassed = false;
      reasons.push(`Expected score ${test.expectedScore}, got ${result.confidenceScore.toFixed(3)}`);
    }
  }
  
  // Validate minimum score
  if (test.expectedMinScore !== undefined) {
    if (result.confidenceScore < test.expectedMinScore) {
      testPassed = false;
      reasons.push(`Expected score >= ${test.expectedMinScore}, got ${result.confidenceScore.toFixed(3)}`);
    }
  }
  
  // Validate match type
  if (test.expectedMatchType && result.matchType !== test.expectedMatchType) {
    testPassed = false;
    reasons.push(`Expected type ${test.expectedMatchType}, got ${result.matchType}`);
  }
  
  // Validate answer structure
  if (test.shouldMatch && result.answerObject) {
    if (!result.answerObject.title) {
      testPassed = false;
      reasons.push(`Answer missing title`);
    }
    if (!result.answerObject.description) {
      testPassed = false;
      reasons.push(`Answer missing description`);
    }
  }
  
  // Validate UI response alignment
  if (test.shouldMatch && !uiResponse.success) {
    testPassed = false;
    reasons.push(`UI response shows failure but match found`);
  }
  
  if (!test.shouldMatch && uiResponse.success) {
    testPassed = false;
    reasons.push(`UI response shows success but no match found`);
  }
  
  if (testPassed) {
    console.log(`✅ PASSED`);
    passed++;
  } else {
    console.log(`❌ FAILED`);
    reasons.forEach(r => console.log(`   - ${r}`));
    failed++;
    failures.push({ test: test.name, reasons });
  }
});

console.log(`\n${'='.repeat(60)}`);
console.log(`\n📊 TEST RESULTS:`);
console.log(`   Passed: ${passed}/${testCases.length}`);
console.log(`   Failed: ${failed}/${testCases.length}`);
console.log(`   Success Rate: ${((passed / testCases.length) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log(`\n🎉 ALL TESTS PASSED!`);
  console.log(`\nSearch engine is now:`);
  console.log(`  ✅ Strictly priority-based (1.0 → 0.95 → 0.80-0.90 → 0.85+)`);
  console.log(`  ✅ Rejecting weak matches (< 0.75)`);
  console.log(`  ✅ Deterministic (same query = same result)`);
  console.log(`  ✅ Brochure-driven (no hallucination)`);
  console.log(`\n🚀 PRODUCTION READY`);
} else {
  console.log(`\n⚠️  ${failed} test(s) failed:`);
  failures.forEach((f, idx) => {
    console.log(`\n${idx + 1}. ${f.test}`);
    f.reasons.forEach(r => console.log(`   - ${r}`));
  });
}

console.log(`\n${'='.repeat(60)}\n`);
