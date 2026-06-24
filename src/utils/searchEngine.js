import Fuse from 'fuse.js';
import brochureData from '../data/brochure.json';



// Direct alias system - maps queries directly to brochure entries
const ALIAS_MAP = {
  // Science & Academics
  'science': 'sciences_001',
  'sciences': 'sciences_001',
  'bsc': 'sciences_001',
  'b.sc': 'sciences_001',
  'msc': 'sciences_001',
  'm.sc': 'sciences_001',
  'chemistry': 'sciences_001',
  'microbiology': 'sciences_001',
  'pharmaceutical': 'sciences_001',
  
  // Management Programs
  'bba': 'management_courses_001',
  'mba': 'management_courses_001',
  'b.com': 'management_courses_001',
  'bcom': 'management_courses_001',
  'commerce': 'management_001',
  'finance': 'management_courses_001',
  'fintech': 'management_courses_001',
  'marketing': 'management_courses_001',
  'hr': 'management_courses_001',
  'human resources': 'management_courses_001',
  'accounting': 'management_courses_001',
  'accounting and finance': 'management_courses_001',
  
  // Engineering
  'engineering': 'engineering_001',
  'b.tech': 'engineering_001',
  'btech': 'engineering_001',
  'cse': 'engineering_courses_001',
  'computer science': 'engineering_courses_001',
  'it': 'engineering_courses_001',
  'information technology': 'engineering_courses_001',
  'mechanical': 'engineering_courses_001',
  'electrical': 'engineering_courses_001',
  'ai': 'engineering_001',
  'ml': 'engineering_001',
  'machine learning': 'engineering_001',
  'cloud': 'engineering_001',
  'cyber': 'engineering_courses_001',
  'cyber security': 'engineering_courses_001',
  'data science': 'engineering_001',
  
  // Computer Applications
  'mca': 'mca_001',
  'master computer applications': 'mca_001',
  'bca': 'bca_001',
  'bachelor computer applications': 'bca_001',
  'b.sc it': 'bsc_it_001',
  
  // Other Schools
  'pharmacy': 'pharmacy_001',
  'b.pharm': 'pharmacy_001',
  'bpharm': 'pharmacy_001',
  'd.pharm': 'pharmacy_001',
  'dpharm': 'pharmacy_001',
  'm.pharm': 'pharmacy_001',
  'mpharm': 'pharmacy_001',
  'law': 'law_001',
  'llb': 'law_001',
  'agriculture': 'agriculture_001',
  'design': 'design_001',
  'fashion': 'design_001',
  'liberal studies': 'liberal_studies_001',
  'psychology': 'liberal_studies_001',
  'arts': 'liberal_studies_001',
  
  // Campus & Location
  'campus': 'location_001',
  'location': 'location_001',
  'address': 'location_001',
  'where': 'location_001',
  'contact': 'contact_001',
  'email': 'contact_001',
  'phone': 'contact_001',
  'ahmedabad': 'location_001',
  
  // Placements & Careers
  'placement': 'placements_001',
  'placements': 'placements_001',
  'job': 'placements_001',
  'jobs': 'placements_001',
  'career': 'placements_001',
  'careers': 'placements_001',
  'recruitment': 'placements_001',
  'placement support': 'placements_001',
  'internship': 'placements_001',
  'internships': 'placements_001',
  'crc': 'placements_001',
  'corporate resource cell': 'placements_001',
  
  // Achievements & Recognition
  'achievement': 'ratings_001',
  'achievements': 'ratings_001',
  'ranking': 'ratings_001',
  'rankings': 'ratings_001',
  'award': 'ratings_001',
  'awards': 'ratings_001',
  'rating': 'ratings_001',
  'ratings': 'ratings_001',
  'honours': 'liberal_studies_001',
  'honors': 'liberal_studies_001',
  'hons': 'liberal_studies_001',
  
  // University Information
  'vision': 'vision_001',
  'mission': 'mission_001',
  'about': 'about_001',
  'features': 'salient_001',
  'pillars': 'four_pillars_001',
  'support': '360_support_001',
  'faculty': 'experience_001',
  'professors': 'experience_001',
  'experienced': 'experience_001',
  'iit': 'experience_001',
  'iim': 'experience_001',
  
  // Research & Innovation
  'research': 'research_innovation_001',
  'phd': 'research_innovation_001',
  'doctoral': 'research_innovation_001',
  'innovation': 'ssip_cell_001',
  'startup': 'ssip_cell_001',
  'entrepreneurship': 'ssip_cell_001',
  'incubation': 'ssip_cell_001',
  'ssip': 'ssip_cell_001',
  
  // AI Learning Platform
  'ai learning platform': 'ai_learning_001',
  'ai-driven': 'ai_learning_001',
  'dashboard': 'dashboard_analytics_001',
  'analytics': 'dashboard_analytics_001',
  'virtual labs': 'ai_learning_001',
  'virtual lab': 'ai_learning_001',
  'holographic': '3d_models_001',
  'holobox': '3d_models_001',
  '3d models': '3d_models_001',
  'smart classroom': 'smart_classroom_001',
  'offline': 'offline_learning_001',
  'online': 'offline_learning_001',
  
  // Admissions
  'admission': 'admission_001',
  'admissions': 'admission_001',
  'apply': 'admission_001',
  'application': 'admission_001',
  'enroll': 'admission_001',
  'enrollment': 'admission_001',
  'fee': 'fee_structure_001',
  'fees': 'fee_structure_001',
  'cost': 'fee_structure_001',
  'scholarship': 'fee_structure_001',
  'scholarships': 'fee_structure_001',
  'financial aid': 'fee_structure_001',
  
  // Other
  'recognition': 'recognition_001',
  'accreditation': 'recognition_001',
  'naac': 'recognition_001',
  'ugc': 'recognition_001',
  'collaboration': 'collaborations_001',
  'partnership': 'collaborations_001',
  'microsoft': 'collaborations_001',
  'tata': 'collaborations_001',
  'student clubs': 'student_clubs_001',
  'events': 'student_clubs_001',
  'sports': 'student_clubs_001'
};

export function normalizeText(text) {
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

// Step 1: Try direct alias match (fastest, most reliable)
export function findAliasMatch(query) {
  const normalized = normalizeText(query).toLowerCase();
  
  // Try exact alias match
  if (ALIAS_MAP[normalized]) {
    const entryId = ALIAS_MAP[normalized];
    const entry = brochureData.find(e => e.id === entryId);
    if (entry) {
      return { entry, confidence: 100, matchType: 'alias_exact' };
    }
  }
  
  // Try partial alias match for multi-word queries
  const words = normalized.split(' ');
  for (const word of words) {
    if (ALIAS_MAP[word]) {
      const entryId = ALIAS_MAP[word];
      const entry = brochureData.find(e => e.id === entryId);
      if (entry) {
        return { entry, confidence: 100, matchType: 'alias_partial' };
      }
    }
  }
  
  return null;
}

// Step 2: Try exact keyword match
export function findExactKeywordMatch(query) {
  const normalized = normalizeText(query).toLowerCase();
  const queryWords = normalized.split(' ').filter(w => w.length > 1);
  
  for (const entry of brochureData) {
    const keywords = (entry.keywords || []).map(k => k.toLowerCase());
    
    for (const word of queryWords) {
      if (keywords.includes(word)) {
        return { entry, confidence: 100, matchType: 'keyword_exact' };
      }
    }
  }
  
  return null;
}

// Step 3: Try question match
export function findQuestionMatch(query) {
  const normalized = normalizeText(query).toLowerCase();
  const queryWords = normalized.split(' ').filter(w => w.length > 1);
  
  for (const entry of brochureData) {
    const questions = (entry.questions || []).map(q => normalizeText(q).toLowerCase());
    
    for (const question of questions) {
      let matchCount = 0;
      for (const word of queryWords) {
        if (question.includes(word)) matchCount++;
      }
      if (matchCount >= Math.max(1, queryWords.length * 0.7)) {
        return { entry, confidence: 95, matchType: 'question' };
      }
    }
  }
  
  return null;
}

// Step 4: Try title match
export function findTitleMatch(query) {
  const normalized = normalizeText(query).toLowerCase();
  const queryWords = normalized.split(' ').filter(w => w.length > 1);
  
  for (const entry of brochureData) {
    const titleNorm = normalizeText(entry.title).toLowerCase();
    
    for (const word of queryWords) {
      if (titleNorm.includes(word)) {
        return { entry, confidence: 90, matchType: 'title' };
      }
    }
  }
  
  return null;
}

// Step 5: Try keyword partial match
export function findPartialKeywordMatch(query) {
  const normalized = normalizeText(query).toLowerCase();
  const queryWords = normalized.split(' ').filter(w => w.length > 1);
  
  for (const entry of brochureData) {
    const keywords = (entry.keywords || []).map(k => k.toLowerCase());
    
    for (const word of queryWords) {
      for (const keyword of keywords) {
        if (keyword.includes(word) || word.includes(keyword.substring(0, 3))) {
          return { entry, confidence: 85, matchType: 'keyword_partial' };
        }
      }
    }
  }
  
  return null;
}

// Step 6: Fuzzy search fallback (only after all direct matches fail)
export function findFuzzyMatch(query) {
  const fuseOptions = {
    keys: [
      { name: 'keywords', weight: 0.4 },
      { name: 'questions', weight: 0.35 },
      { name: 'title', weight: 0.15 },
      { name: 'answer', weight: 0.1 }
    ],
    threshold: 0.3,
    minMatchCharLength: 2,
    shouldSort: true,
    includeScore: true,
    ignoreLocation: true,
    distance: 1000
  };

  const fuse = new Fuse(brochureData, fuseOptions);
  const results = fuse.search(query);
  
  if (results.length > 0) {
    const topResult = results[0];
    const confidence = Math.max(50, Math.round((1 - topResult.score) * 80));
    return { entry: topResult.item, confidence, matchType: 'fuzzy' };
  }
  
  return null;
}

// RESTRUCTURED SEARCH FLOW: Try brochure FIRST
export function searchKnowledgeBase(query) {
  if (!query || query.trim().length === 0) {
    return {
      results: [],
      confidence: 0,
      message: 'Please enter a search query.'
    };
  }

  // Step 1: Try alias match
  const aliasMatch = findAliasMatch(query);
  if (aliasMatch) {
    return {
      results: [{
        id: aliasMatch.entry.id,
        category: aliasMatch.entry.category,
        title: aliasMatch.entry.title,
        answer: aliasMatch.entry.answer,
        confidence: aliasMatch.confidence,
        matchType: aliasMatch.matchType
      }],
      confidence: aliasMatch.confidence,
      message: aliasMatch.entry.answer,
      topResult: {
        id: aliasMatch.entry.id,
        title: aliasMatch.entry.title,
        answer: aliasMatch.entry.answer
      }
    };
  }

  // Step 2: Try exact keyword match
  const exactMatch = findExactKeywordMatch(query);
  if (exactMatch) {
    return {
      results: [{
        id: exactMatch.entry.id,
        category: exactMatch.entry.category,
        title: exactMatch.entry.title,
        answer: exactMatch.entry.answer,
        confidence: exactMatch.confidence,
        matchType: exactMatch.matchType
      }],
      confidence: exactMatch.confidence,
      message: exactMatch.entry.answer,
      topResult: {
        id: exactMatch.entry.id,
        title: exactMatch.entry.title,
        answer: exactMatch.entry.answer
      }
    };
  }

  // Step 3: Try question match
  const questionMatch = findQuestionMatch(query);
  if (questionMatch) {
    return {
      results: [{
        id: questionMatch.entry.id,
        category: questionMatch.entry.category,
        title: questionMatch.entry.title,
        answer: questionMatch.entry.answer,
        confidence: questionMatch.confidence,
        matchType: questionMatch.matchType
      }],
      confidence: questionMatch.confidence,
      message: questionMatch.entry.answer,
      topResult: {
        id: questionMatch.entry.id,
        title: questionMatch.entry.title,
        answer: questionMatch.entry.answer
      }
    };
  }

  // Step 4: Try title match
  const titleMatch = findTitleMatch(query);
  if (titleMatch) {
    return {
      results: [{
        id: titleMatch.entry.id,
        category: titleMatch.entry.category,
        title: titleMatch.entry.title,
        answer: titleMatch.entry.answer,
        confidence: titleMatch.confidence,
        matchType: titleMatch.matchType
      }],
      confidence: titleMatch.confidence,
      message: titleMatch.entry.answer,
      topResult: {
        id: titleMatch.entry.id,
        title: titleMatch.entry.title,
        answer: titleMatch.entry.answer
      }
    };
  }

  // Step 5: Try partial keyword match
  const partialMatch = findPartialKeywordMatch(query);
  if (partialMatch) {
    return {
      results: [{
        id: partialMatch.entry.id,
        category: partialMatch.entry.category,
        title: partialMatch.entry.title,
        answer: partialMatch.entry.answer,
        confidence: partialMatch.confidence,
        matchType: partialMatch.matchType
      }],
      confidence: partialMatch.confidence,
      message: partialMatch.entry.answer,
      topResult: {
        id: partialMatch.entry.id,
        title: partialMatch.entry.title,
        answer: partialMatch.entry.answer
      }
    };
  }

  // Step 6: Try fuzzy match (only after all direct matches fail)
  const fuzzyMatch = findFuzzyMatch(query);
  if (fuzzyMatch) {
    return {
      results: [{
        id: fuzzyMatch.entry.id,
        category: fuzzyMatch.entry.category,
        title: fuzzyMatch.entry.title,
        answer: fuzzyMatch.entry.answer,
        confidence: fuzzyMatch.confidence,
        matchType: fuzzyMatch.matchType
      }],
      confidence: fuzzyMatch.confidence,
      message: fuzzyMatch.entry.answer,
      topResult: {
        id: fuzzyMatch.entry.id,
        title: fuzzyMatch.entry.title,
        answer: fuzzyMatch.entry.answer
      }
    };
  }

  // Only fallback if NO brochure match found
  return {
    results: [],
    confidence: 0,
    message: "I couldn't find this information in our database. Please try different keywords or contact us at +91 89 8000 4325."
  };
}

// NEW: Check if brochure has information BEFORE fallback gate
export function hasBrochureInfo(query) {
  if (!query) return false;
  
  const aliasMatch = findAliasMatch(query);
  if (aliasMatch) return true;
  
  const exactMatch = findExactKeywordMatch(query);
  if (exactMatch) return true;
  
  const questionMatch = findQuestionMatch(query);
  if (questionMatch) return true;
  
  const titleMatch = findTitleMatch(query);
  if (titleMatch) return true;
  
  const partialMatch = findPartialKeywordMatch(query);
  if (partialMatch) return true;
  
  const fuzzyMatch = findFuzzyMatch(query);
  if (fuzzyMatch) return true;
  
  return false;
}

export function getFormattedResponse(query) {
  // CRITICAL CHANGE: Search brochure FIRST, only use isUniversityRelated as last resort
  const searchResult = searchKnowledgeBase(query);
  
  // If brochure found a match, return it
  if (searchResult.results.length > 0 && searchResult.confidence > 0) {
    const topResult = searchResult.results[0];
    let formattedMessage = topResult.answer;
    if (topResult.category) {
      formattedMessage += `\n\n📖 Source: ${topResult.category}`;
    }
    
    return {
      success: true,
      confidence: topResult.confidence,
      message: formattedMessage,
      rawAnswer: topResult.answer,
      category: topResult.category || 'Unknown',
      title: topResult.title,
      confidenceScore: topResult.confidence,
      matchedKeywords: extractMatchedKeywords(query, topResult),
      relatedQuestions: topResult.title ? [topResult.title] : [],
      matchType: searchResult.matchType
    };
  }
  
  // Only if NO brochure match, check if it's university-related
  if (!isUniversityRelated(query)) {
    return {
      success: false,
      confidence: 0,
      message: "I can only answer questions about Rai University. Please ask about programs, admissions, placements, campus, or facilities."
    };
  }
  
  // Still no match - final fallback
  return {
    success: false,
    confidence: 0,
    message: "I couldn't find this information. Please contact us at +91 89 8000 4325 or info@raiuniversity.edu for more details."
  };
}

export function isUniversityRelated(query) {
  const universityKeywords = [
    'rai', 'university', 'admission', 'course', 'program', 'degree',
    'placement', 'campus', 'faculty', 'research', 'innovation',
    'scholarship', 'fee', 'engineering', 'management', 'pharmacy',
    'law', 'agriculture', 'sciences', 'design', 'liberal', 'studies',
    'vision', 'mission', 'contact', 'accreditation', 'naac', 'ugc',
    'bba', 'mba', 'btech', 'b.tech', 'bca', 'mca', 'llb', 'bpharm',
    'dpharm', 'mpharm', 'bsc', 'msc', 'ba', 'bcom', 'llm', 'cse', 'it',
    'ai', 'ml', 'cyber', 'security', 'hr', 'marketing', 'finance',
    'rating', 'ranking', 'achievement', 'honour', 'honors', 'honours'
  ];

  const normalized = normalizeText(query).toLowerCase().split(' ');
  return normalized.some(word => 
    word.length > 0 && universityKeywords.some(keyword => 
      keyword === word || keyword.includes(word) || word.includes(keyword.substring(0, 3))
    )
  );
}

export function extractMatchedKeywords(query, result) {
  const queryWords = normalizeText(query).split(' ').filter(w => w.length > 1);
  const answerText = normalizeText(result.answer);
  
  return queryWords.filter(word => answerText.includes(word));
}

export function searchByCategory(category) {
  return brochureData.filter(item => 
    item.category.toLowerCase() === category.toLowerCase()
  );
}

export function getSuggestions(query, limit = 5) {
  if (!query || query.length < 2) return [];

  const normalized = normalizeText(query);
  const suggestions = brochureData
    .filter(item => 
      item.title.toLowerCase().includes(normalized) ||
      item.keywords.some(k => k.includes(normalized))
    )
    .slice(0, limit)
    .map(item => ({
      id: item.id,
      title: item.title,
      category: item.category
    }));

  return suggestions;
}

export default {
  normalizeText,
  findAliasMatch,
  findExactKeywordMatch,
  findQuestionMatch,
  findTitleMatch,
  findPartialKeywordMatch,
  findFuzzyMatch,
  hasBrochureInfo,
  searchKnowledgeBase,
  isUniversityRelated,
  getFormattedResponse,
  searchByCategory,
  getSuggestions
};
