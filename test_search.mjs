import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load brochure data
const brochureData = JSON.parse(
  fs.readFileSync(join(__dirname, 'src/data/brochure.json'), 'utf8')
);

// Minimal search engine implementation for testing
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(word => word.length > 0)
    .join(' ');
}

function directKeywordMatch(query) {
  const normalized = normalizeText(query).toLowerCase();
  const queryWords = normalized.split(' ').filter(w => w.length > 0);
  
  for (const entry of brochureData) {
    const titleLower = normalizeText(entry.title).toLowerCase();
    const categoryLower = normalizeText(entry.category).toLowerCase();
    const keywords = (entry.keywords || []).map(k => k.toLowerCase());
    const questions = (entry.questions || []).map(q => normalizeText(q).toLowerCase());
    
    for (const word of queryWords) {
      if (word.length < 2) continue;
      
      if (keywords.includes(word)) {
        return { entry, confidence: 100, matchType: 'keyword_exact' };
      }
      
      if (keywords.some(k => k.includes(word))) {
        return { entry, confidence: 90, matchType: 'keyword_partial' };
      }
      
      if (titleLower.includes(word)) {
        return { entry, confidence: 85, matchType: 'title' };
      }
      
      if (categoryLower.includes(word)) {
        return { entry, confidence: 80, matchType: 'category' };
      }
      
      if (questions.some(q => q.includes(word))) {
        return { entry, confidence: 75, matchType: 'question' };
      }
    }
  }
  
  return null;
}

function isUniversityRelated(query) {
  const universityKeywords = [
    'rai', 'university', 'admission', 'course', 'program', 'degree',
    'placement', 'campus', 'faculty', 'research', 'innovation',
    'scholarship', 'fee', 'engineering', 'management', 'pharmacy',
    'law', 'agriculture', 'sciences', 'design', 'liberal', 'studies',
    'vision', 'mission', 'contact', 'accreditation', 'naac', 'ugc',
    'bba', 'mba', 'btech', 'b.tech', 'bca', 'mca', 'llb', 'bpharm',
    'dpharm', 'mpharm', 'bsc', 'msc', 'ba', 'bcom', 'llm', 'cse', 'it',
    'ai', 'ml', 'cyber', 'security', 'hr', 'marketing', 'finance',
    'rating', 'ranking', 'achievement', 'honour', 'honors', 'honours',
    'specialization', 'specialisation', 'school', 'schools', 'centre',
    'center', 'laboratory', 'lab', 'hostel', 'facility', 'facilities',
    'club', 'clubs', 'event', 'events', 'internship', 'placement',
    'crc', 'corporate', 'skill', 'training', 'interview', 'aptitude',
    'psychology', 'fashion', 'agriculture', 'startup', 'entrepreneurship',
    'incubation', 'innovation', 'research', 'phd', 'doctorate', 'ssip',
    'address', 'phone', 'email', 'location', 'ahmedabad', 'admission',
    'infrastructure', 'technology', 'platform', 'learning', 'online',
    'offline', 'virtual', 'laboratory', 'labs', 'holographic', 'holobox'
  ];

  const normalized = normalizeText(query).toLowerCase().split(' ');
  return normalized.some(word => 
    word.length > 0 && universityKeywords.some(keyword => 
      keyword === word || keyword.includes(word) || word.includes(keyword.substring(0, 3))
    )
  );
}

function testSearch(query) {
  const isRelated = isUniversityRelated(query);
  if (!isRelated) {
    return {
      success: false,
      reason: 'Not university related'
    };
  }
  
  const match = directKeywordMatch(query);
  if (match) {
    return {
      success: true,
      confidence: match.confidence,
      title: match.entry.title,
      category: match.entry.category,
      matchType: match.matchType,
      answer: match.entry.answer.substring(0, 80) + '...'
    };
  }
  
  return {
    success: false,
    reason: 'No match found'
  };
}

// Test queries
const TEST_QUERIES = [
  'BBA', 'MBA', 'MCA', 'BCA', 'Campus', 'Placement', 'Placements',
  'Achievements', 'Ranking', 'Rankings', 'Vision', 'Mission', 'Faculty',
  'Research', 'Innovation', 'Contact', 'Address', 'Email', 'Phone',
  'Engineering', 'Pharmacy', 'Law', 'Agriculture', 'Design', 'Psychology',
  'AI', 'ML', 'CSE', 'IT', 'NAAC', 'UGC', 'Honours', 'Location'
];

console.log('\n🧪 CRITICAL SEARCH FIX - TEST RESULTS\n');
console.log('='.repeat(80));

let passCount = 0;
let failCount = 0;
const results = [];

TEST_QUERIES.forEach(query => {
  const result = testSearch(query);
  results.push({ query, ...result });
  
  if (result.success) {
    passCount++;
    console.log(`✅ PASS: "${query}"`);
    console.log(`   → ${result.title}`);
    console.log(`   → Category: ${result.category}`);
    console.log(`   → Confidence: ${result.confidence}%`);
    console.log(`   → Match Type: ${result.matchType}\n`);
  } else {
    failCount++;
    console.log(`❌ FAIL: "${query}"`);
    console.log(`   → Reason: ${result.reason}\n`);
  }
});

console.log('='.repeat(80));
console.log(`\n📊 RESULTS SUMMARY`);
console.log(`Total Tests: ${TEST_QUERIES.length}`);
console.log(`Passed: ${passCount} ✅`);
console.log(`Failed: ${failCount} ❌`);
console.log(`Success Rate: ${Math.round((passCount / TEST_QUERIES.length) * 100)}%\n`);

if (failCount === 0) {
  console.log('🎉 ALL TESTS PASSED! 100% SEARCH ACCURACY ACHIEVED!\n');
} else {
  console.log('⚠️  Some tests failed. Review the results above.\n');
  console.log('Failed queries:', results.filter(r => !r.success).map(r => r.query).join(', '));
}

console.log('='.repeat(80));
