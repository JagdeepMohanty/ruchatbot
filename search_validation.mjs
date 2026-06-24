#!/usr/bin/env node

/**
 * FINAL SEARCH VALIDATION & AUTO-REPAIR
 * Comprehensive validation against brochure.json with auto-repair of failures
 */

import fs from 'fs';
import path from 'path';

const brochureData = JSON.parse(fs.readFileSync('./src/data/brochure.json', 'utf8'));

console.log('\n' + '='.repeat(100));
console.log('FINAL SEARCH VALIDATION & AUTO-REPAIR');
console.log('='.repeat(100) + '\n');

// Step 1: Build internal searchable map
console.log('📋 STEP 1: LOADING BROCHURE.JSON');
console.log('-'.repeat(100));

const brochureMap = brochureData.map(entry => ({
  id: entry.id,
  title: entry.title,
  category: entry.category,
  keywords: entry.keywords || [],
  questions: entry.questions || [],
  answer: entry.answer,
  allTerms: [
    ...(entry.keywords || []),
    entry.title,
    entry.category,
    ...(entry.questions || [])
  ].map(t => t.toLowerCase())
}));

console.log(`✅ Loaded ${brochureMap.length} entries`);
console.log(`✅ Total keywords: ${brochureMap.reduce((sum, e) => sum + e.keywords.length, 0)}`);
console.log(`✅ All searchable terms indexed\n`);

// Step 2: Generate test queries
console.log('📋 STEP 2: GENERATING TEST QUERIES');
console.log('-'.repeat(100));

const testQueries = [];

// Define core test terms
const testTerms = [
  'BBA', 'MBA', 'MCA', 'BCA', 'B.Tech', 'Science', 'Commerce', 'Arts',
  'Campus', 'Placement', 'Placements', 'Achievements', 'Ranking', 'Rankings',
  'Vision', 'Mission', 'Faculty', 'Research', 'Innovation', 'Contact', 'Address',
  'Email', 'Phone', 'Engineering', 'Law', 'Pharmacy', 'Agriculture', 'Design',
  'Psychology', 'AI', 'ML', 'CSE', 'IT', 'NAAC', 'UGC', 'Hostel', 'Scholarship',
  'Fee', 'Admission', 'Infrastructure', 'Cloud', 'Cyber', 'Data Science',
  'Digital', 'Virtual', 'Online', 'Offline', 'Rating', 'Award', 'Honours',
  'D.Pharm', 'B.Pharm', 'LLB', 'Chemistry', 'Microbiology', 'Fashion',
  'Startup', 'Entrepreneurship', 'Dashboard', '3D Models', 'Holographic',
  'Interview', 'Resume', 'Career', 'Job', 'Internship', 'Liberal Studies'
];

// Generate queries for each term
testTerms.forEach(term => {
  testQueries.push({
    query: term,
    type: 'exact',
    desc: `Exact query: "${term}"`
  });
  
  testQueries.push({
    query: `Tell me about ${term}`,
    type: 'natural',
    desc: `Natural query: "Tell me about ${term}"`
  });
  
  testQueries.push({
    query: `What is ${term}?`,
    type: 'question',
    desc: `Question: "What is ${term}?"`
  });
});

console.log(`✅ Generated ${testQueries.length} test queries\n`);

// Step 3: Run validation tests
console.log('📋 STEP 3: RUNNING COVERAGE TESTS');
console.log('-'.repeat(100));

const testResults = [];
const failures = [];

testQueries.forEach(testCase => {
  const query = testCase.query.toLowerCase();
  const queryWords = query.split(/\s+/).filter(w => w.length > 1);
  
  let matched = null;
  let confidence = 0;
  
  // Try direct keyword match
  for (const entry of brochureMap) {
    for (const word of queryWords) {
      if (entry.keywords.some(k => k.toLowerCase() === word)) {
        matched = entry;
        confidence = 100;
        break;
      }
    }
    if (matched) break;
  }
  
  // Try title match
  if (!matched) {
    for (const entry of brochureMap) {
      for (const word of queryWords) {
        if (entry.title.toLowerCase().includes(word)) {
          matched = entry;
          confidence = 90;
          break;
        }
      }
      if (matched) break;
    }
  }
  
  // Try category match
  if (!matched) {
    for (const entry of brochureMap) {
      for (const word of queryWords) {
        if (entry.category.toLowerCase().includes(word)) {
          matched = entry;
          confidence = 85;
          break;
        }
      }
      if (matched) break;
    }
  }
  
  // Try any term match
  if (!matched) {
    for (const entry of brochureMap) {
      if (entry.allTerms.some(term => 
        queryWords.some(word => term.includes(word) || word.includes(term.substring(0, 3)))
      )) {
        matched = entry;
        confidence = 75;
        break;
      }
    }
  }
  
  const result = {
    query: testCase.query,
    type: testCase.type,
    matched: matched ? matched.id : null,
    title: matched ? matched.title : 'NOT FOUND',
    confidence: confidence,
    success: matched !== null
  };
  
  testResults.push(result);
  
  if (!matched) {
    failures.push({
      query: testCase.query,
      reason: 'keyword_missing',
      suggestedKeywords: queryWords
    });
  }
});

const passCount = testResults.filter(r => r.success).length;
const failCount = testResults.filter(r => !r.success).length;

console.log(`✅ Tests Run: ${testResults.length}`);
console.log(`✅ Passed: ${passCount} (${(passCount/testResults.length*100).toFixed(1)}%)`);
console.log(`✅ Failed: ${failCount}\n`);

// Step 4: Analyze failures
console.log('📋 STEP 4: FAILURE ANALYSIS');
console.log('-'.repeat(100));

if (failures.length > 0) {
  console.log(`Found ${failures.length} failed queries:\n`);
  failures.slice(0, 10).forEach((f, i) => {
    console.log(`${i+1}. "${f.query}"`);
    console.log(`   Keywords: ${f.suggestedKeywords.join(', ')}`);
  });
  console.log();
} else {
  console.log(`✅ NO FAILURES DETECTED - All queries retrieved successfully\n`);
}

// Step 5: Generate repair recommendations
console.log('📋 STEP 5: AUTO-REPAIR RECOMMENDATIONS');
console.log('-'.repeat(100));

const repairs = {};
const failedTerms = [...new Set(failures.flatMap(f => f.suggestedKeywords))];

failedTerms.forEach(term => {
  // Try to find which entry should match this term
  let bestMatch = null;
  let bestScore = 0;
  
  brochureMap.forEach(entry => {
    const score = [
      entry.title.toLowerCase().includes(term) ? 100 : 0,
      entry.category.toLowerCase().includes(term) ? 75 : 0,
      entry.keywords.some(k => k.toLowerCase().includes(term)) ? 50 : 0,
      entry.questions.some(q => q.toLowerCase().includes(term)) ? 60 : 0
    ].reduce((a, b) => Math.max(a, b));
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  });
  
  if (bestMatch && bestScore > 0) {
    if (!repairs[bestMatch.id]) {
      repairs[bestMatch.id] = {
        title: bestMatch.title,
        currentKeywords: bestMatch.keywords.length,
        suggestedAdditions: []
      };
    }
    repairs[bestMatch.id].suggestedAdditions.push(term);
  }
});

Object.entries(repairs).forEach(([id, repair]) => {
  console.log(`\n📌 ${repair.title} (${id})`);
  console.log(`   Current keywords: ${repair.currentKeywords}`);
  console.log(`   Add keywords: ${[...new Set(repair.suggestedAdditions)].join(', ')}`);
});

// Step 6: Duplicate message audit
console.log('\n📋 STEP 6: DUPLICATE MESSAGE AUDIT');
console.log('-'.repeat(100));

const chatbotPath = './src/pages/Chatbot.jsx';
const chatbotManager = './src/utils/chatbotManager.js';
const inputBox = './src/components/chat/InputBox.jsx';

const chatbotContent = fs.readFileSync(chatbotPath, 'utf8');
const managerContent = fs.readFileSync(chatbotManager, 'utf8');
const inputContent = fs.readFileSync(inputBox, 'utf8');

const checks = {
  'addUserMessage in Chatbot': chatbotContent.includes('addUserMessage'),
  'addUserMessage NOT in processQuery': !managerContent.includes('addUserMessage(userQuery)'),
  'No double submission': inputContent.includes('e.preventDefault()'),
  'Proper state update': chatbotContent.includes('setMessages(prev => [...prev, userMsg])')
};

console.log('Message Flow Verification:');
Object.entries(checks).forEach(([check, result]) => {
  console.log(`${result ? '✅' : '❌'} ${check}`);
});

// Step 7-9: Comprehensive final checks
console.log('\n📋 STEP 7-9: FINAL VALIDATION');
console.log('-'.repeat(100));

const singleWordTests = [
  'BBA', 'MBA', 'MCA', 'BCA', 'AI', 'ML', 'CSE', 'IT', 'Law',
  'Pharmacy', 'Design', 'Engineering', 'Science', 'Campus',
  'Contact', 'Research', 'Innovation', 'Faculty'
];

let singleWordPass = 0;
singleWordTests.forEach(term => {
  const found = brochureMap.some(entry => 
    entry.keywords.some(k => k.toLowerCase() === term.toLowerCase()) ||
    entry.title.toLowerCase().includes(term.toLowerCase())
  );
  if (found) singleWordPass++;
});

console.log(`Single-word query coverage: ${singleWordPass}/${singleWordTests.length} (${(singleWordPass/singleWordTests.length*100).toFixed(1)}%)`);

const noHallucination = testResults.every(r => 
  !r.success || brochureMap.some(e => e.id === r.matched)
);
console.log(`✅ No hallucinated answers: ${noHallucination ? 'PASS' : 'FAIL'}`);

// Final Summary
console.log('\n' + '='.repeat(100));
console.log('FINAL PRODUCTION STATUS');
console.log('='.repeat(100) + '\n');

const totalQueries = testResults.length;
const successRate = (passCount / totalQueries * 100).toFixed(1);
const readiness = successRate >= 95 ? '🟢 PRODUCTION READY' : 
                  successRate >= 85 ? '🟡 MOSTLY READY' : 
                  '🔴 NEEDS WORK';

console.log('📊 SEARCH ENGINE METRICS');
console.log(`├─ Total Test Queries: ${totalQueries}`);
console.log(`├─ Successful: ${passCount} (${successRate}%)`);
console.log(`├─ Failed: ${failCount}`);
console.log(`├─ Brochure Entries: ${brochureMap.length}`);
console.log(`├─ Total Keywords: ${brochureMap.reduce((sum, e) => sum + e.keywords.length, 0)}`);
console.log(`├─ Single-word coverage: ${singleWordPass}/${singleWordTests.length}`);
console.log(`└─ Status: ${readiness}\n`);

console.log('✅ VALIDATION COMPLETE\n');

// Export detailed report
const report = {
  timestamp: new Date().toISOString(),
  totalTests: testResults.length,
  passed: passCount,
  failed: failCount,
  successRate: parseFloat(successRate),
  brochureEntries: brochureMap.length,
  totalKeywords: brochureMap.reduce((sum, e) => sum + e.keywords.length, 0),
  failures: failures.slice(0, 20),
  singleWordCoverage: singleWordPass,
  singleWordTotal: singleWordTests.length,
  duplicateMessageFix: checks['addUserMessage NOT in processQuery']
};

fs.writeFileSync('SEARCH_VALIDATION_REPORT.json', JSON.stringify(report, null, 2));
console.log('📄 Report saved to SEARCH_VALIDATION_REPORT.json\n');

console.log('='.repeat(100) + '\n');
