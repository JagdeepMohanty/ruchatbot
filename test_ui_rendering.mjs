import { formatStructuredAnswer, formatResponse } from './src/utils/responseRenderer.js';

console.log('🎨 UI RENDERING VALIDATION\n');
console.log('='.repeat(60));

// Test case 1: Complete answer object
const completeAnswer = {
  title: "School of Engineering",
  description: "School of Engineering focuses on producing industry-ready engineers through project-based learning, internships, and research.",
  details: [
    "B.Tech programs (8 semesters)",
    "Diploma programs (6 semesters)",
    "Project-based learning approach",
    "Industry internships and placements"
  ],
  specializations: [
    "AI & Machine Learning",
    "Data Science",
    "Cyber Security",
    "Cloud Computing"
  ],
  source: "School of Engineering Brochure"
};

// Test case 2: Answer with features
const answerWithFeatures = {
  title: "AI Learning Platform",
  description: "Advanced AI-driven platform for personalized learning.",
  details: [
    "Virtual Labs available 24/7",
    "Real-time progress tracking"
  ],
  features: [
    "Offline access",
    "Smart recommendations",
    "Interactive 3D models"
  ],
  source: "Technology Department"
};

// Test case 3: Simple answer (no lists)
const simpleAnswer = {
  title: "Vision Statement",
  description: "To produce professional graduates and responsible citizens.",
  details: [],
  source: "University"
};

// Test case 4: Plain text (error message)
const plainText = "Sorry, no exact information found in the Rai University brochure.";

console.log('\n[Test 1] Complete Answer with All Sections');
console.log('-------------------------------------------');
const result1 = formatStructuredAnswer(completeAnswer);
console.log(`Type: ${result1.type}`);
console.log(`Blocks: ${result1.blocks.length}`);
console.log(`Block Types: ${result1.blocks.map(b => b.type).join(', ')}`);
console.log(`Has Title: ${!!result1.title}`);
console.log(`Has Description: ${!!result1.description}`);
console.log(`Has Details: ${result1.details.length > 0}`);
console.log(`Has Specializations: ${result1.specializations.length > 0}`);
console.log(`Has Source: ${!!result1.source}`);

// Validate structure
let test1Passed = true;
const test1Reasons = [];

if (result1.type !== 'structured') {
  test1Passed = false;
  test1Reasons.push('Type should be "structured"');
}

if (result1.blocks.length !== 5) {
  test1Passed = false;
  test1Reasons.push(`Expected 5 blocks, got ${result1.blocks.length}`);
}

const expectedTypes = ['title', 'description', 'details', 'specializations', 'source'];
const actualTypes = result1.blocks.map(b => b.type);
if (JSON.stringify(actualTypes) !== JSON.stringify(expectedTypes)) {
  test1Passed = false;
  test1Reasons.push(`Block order mismatch. Expected: ${expectedTypes.join(',')}, Got: ${actualTypes.join(',')}`);
}

// Check NO metadata leakage
const allContent = JSON.stringify(result1);
if (allContent.includes('confidence') || allContent.includes('High confidence')) {
  test1Passed = false;
  test1Reasons.push('Confidence metadata leaked into output');
}

if (allContent.includes('timestamp') || /\d{4}-\d{2}-\d{2}/.test(allContent)) {
  test1Passed = false;
  test1Reasons.push('Timestamp leaked into output');
}

if (test1Passed) {
  console.log('✅ PASSED\n');
} else {
  console.log('❌ FAILED');
  test1Reasons.forEach(r => console.log(`   - ${r}`));
  console.log('');
}

console.log('\n[Test 2] Answer with Features');
console.log('-------------------------------------------');
const result2 = formatStructuredAnswer(answerWithFeatures);
console.log(`Type: ${result2.type}`);
console.log(`Blocks: ${result2.blocks.length}`);
console.log(`Block Types: ${result2.blocks.map(b => b.type).join(', ')}`);

let test2Passed = true;
const test2Reasons = [];

if (!result2.blocks.find(b => b.type === 'features')) {
  test2Passed = false;
  test2Reasons.push('Features block missing');
}

if (result2.blocks.find(b => b.type === 'features')?.items.length !== 3) {
  test2Passed = false;
  test2Reasons.push('Features should have 3 items');
}

if (test2Passed) {
  console.log('✅ PASSED\n');
} else {
  console.log('❌ FAILED');
  test2Reasons.forEach(r => console.log(`   - ${r}`));
  console.log('');
}

console.log('\n[Test 3] Simple Answer (No Lists)');
console.log('-------------------------------------------');
const result3 = formatStructuredAnswer(simpleAnswer);
console.log(`Type: ${result3.type}`);
console.log(`Blocks: ${result3.blocks.length}`);
console.log(`Block Types: ${result3.blocks.map(b => b.type).join(', ')}`);

let test3Passed = true;
const test3Reasons = [];

if (result3.blocks.length !== 3) {
  test3Passed = false;
  test3Reasons.push(`Expected 3 blocks (title, description, source), got ${result3.blocks.length}`);
}

if (result3.blocks.find(b => b.type === 'details')) {
  test3Passed = false;
  test3Reasons.push('Details block should NOT be rendered when array is empty');
}

if (test3Passed) {
  console.log('✅ PASSED\n');
} else {
  console.log('❌ FAILED');
  test3Reasons.forEach(r => console.log(`   - ${r}`));
  console.log('');
}

console.log('\n[Test 4] Plain Text (Error Message)');
console.log('-------------------------------------------');
const result4 = formatResponse(plainText);
console.log(`Type: ${result4.type}`);
console.log(`Blocks: ${result4.blocks.length}`);
console.log(`Content: ${result4.blocks[0]?.content}`);

let test4Passed = true;
const test4Reasons = [];

if (result4.type !== 'text') {
  test4Passed = false;
  test4Reasons.push('Plain text should have type "text"');
}

if (result4.blocks.length !== 1) {
  test4Passed = false;
  test4Reasons.push('Plain text should have exactly 1 block');
}

if (result4.blocks[0]?.type !== 'text') {
  test4Passed = false;
  test4Reasons.push('Block type should be "text"');
}

if (test4Passed) {
  console.log('✅ PASSED\n');
} else {
  console.log('❌ FAILED');
  test4Reasons.forEach(r => console.log(`   - ${r}`));
  console.log('');
}

console.log('\n[Test 5] Metadata Leak Check');
console.log('-------------------------------------------');

const testAnswers = [completeAnswer, answerWithFeatures, simpleAnswer];
let metadataLeakFound = false;
const leakSources = [];

testAnswers.forEach((ans, idx) => {
  const formatted = formatStructuredAnswer(ans);
  const jsonStr = JSON.stringify(formatted);
  
  // Check for metadata leaks
  const forbiddenTerms = [
    'confidence',
    'High confidence',
    'Low confidence',
    'matchType',
    'fuzzy',
    'semantic',
    'exact_match'
  ];
  
  forbiddenTerms.forEach(term => {
    if (jsonStr.toLowerCase().includes(term.toLowerCase())) {
      metadataLeakFound = true;
      leakSources.push(`Answer ${idx + 1}: Contains "${term}"`);
    }
  });
});

if (!metadataLeakFound) {
  console.log('✅ PASSED - No metadata leaks detected\n');
} else {
  console.log('❌ FAILED - Metadata leaks found:');
  leakSources.forEach(leak => console.log(`   - ${leak}`));
  console.log('');
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('\n📊 TEST SUMMARY:');
const allPassed = test1Passed && test2Passed && test3Passed && test4Passed && !metadataLeakFound;
const totalTests = 5;
const passedCount = [test1Passed, test2Passed, test3Passed, test4Passed, !metadataLeakFound].filter(Boolean).length;

console.log(`   Passed: ${passedCount}/${totalTests}`);
console.log(`   Success Rate: ${((passedCount / totalTests) * 100).toFixed(1)}%`);

if (allPassed) {
  console.log('\n🎉 ALL TESTS PASSED!');
  console.log('\nUI Rendering is now:');
  console.log('  ✅ Fully structured (title → description → lists)');
  console.log('  ✅ NO metadata leaks');
  console.log('  ✅ Clean FAQ-style format');
  console.log('  ✅ Professional presentation');
  console.log('\n🚀 PRODUCTION READY');
} else {
  console.log(`\n⚠️  ${totalTests - passedCount} test(s) failed`);
  console.log('Review the failures above and fix the issues.');
}

console.log('\n' + '='.repeat(60) + '\n');
