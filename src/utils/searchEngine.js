import Fuse from 'fuse.js';
import brochureData from '../data/brochure.json' with { type: 'json' };

/**
 * STRICT BROCHURE-DRIVEN FAQ RETRIEVAL SYSTEM
 * 
 * PRIORITY ORDER:
 * 1. Exact match (question OR alias) → 1.0 score
 * 2. Alias map match → 0.95 score
 * 3. Keyword overlap → 0.80-0.90 score
 * 4. Fuse.js semantic match → 0.85+ score
 * 
 * REJECTION THRESHOLD: < 0.75 → NO MATCH
 */

// ALIAS MAP - Direct keyword to entry ID mapping
const ALIAS_MAP = {
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
  'data science': 'engineering_001',
  'cyber security': 'engineering_courses_001',
  
  // Management
  'bba': 'management_courses_001',
  'mba': 'management_courses_001',
  'b.com': 'management_courses_001',
  'bcom': 'management_courses_001',
  'management': 'management_001',
  'finance': 'management_courses_001',
  'marketing': 'management_courses_001',
  'hr': 'management_courses_001',
  'human resources': 'management_courses_001',
  
  // Computer Applications
  'mca': 'mca_001',
  'bca': 'bca_001',
  'b.sc it': 'bsc_it_001',
  
  // Other Schools
  'pharmacy': 'pharmacy_001',
  'b.pharm': 'pharmacy_001',
  'law': 'law_001',
  'llb': 'law_001',
  'agriculture': 'agriculture_001',
  'science': 'sciences_001',
  'sciences': 'sciences_001',
  'design': 'design_001',
  'liberal studies': 'liberal_studies_001',
  'psychology': 'liberal_studies_001',
  
  // University Info
  'about': 'about_001',
  'vision': 'vision_001',
  'mission': 'mission_001',
  'location': 'location_001',
  'address': 'location_001',
  'contact': 'contact_001',
  'admission': 'admission_001',
  'fee': 'fee_structure_001',
  'fees': 'fee_structure_001',
  
  // Recognition
  'ugc': 'recognition_001',
  'naac': 'recognition_001',
  'rating': 'ratings_001',
  'ranking': 'ratings_001',
  
  // Placements
  'placement': 'placements_001',
  'placements': 'placements_001',
  'job': 'placements_001',
  'career': 'placements_001',
  
  // Research
  'research': 'research_innovation_001',
  'phd': 'research_innovation_001',
  'startup': 'ssip_cell_001',
  'innovation': 'ssip_cell_001'
};

/**
 * Normalize text for comparison
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * STEP 1: Exact Question/Alias Match
 * Score: 1.0
 */
function findExactMatch(query) {
  const normalized = normalizeText(query);
  
  for (const entry of brochureData) {
    // Check question
    if (normalizeText(entry.question) === normalized) {
      return {
        matchedEntry: entry,
        confidenceScore: 1.0,
        answerObject: entry.answer,
        matchType: 'exact_question'
      };
    }
    
    // Check aliases
    if (entry.aliases && Array.isArray(entry.aliases)) {
      for (const alias of entry.aliases) {
        if (normalizeText(alias) === normalized) {
          return {
            matchedEntry: entry,
            confidenceScore: 1.0,
            answerObject: entry.answer,
            matchType: 'exact_alias'
          };
        }
      }
    }
  }
  
  return null;
}

/**
 * STEP 2: Alias Map Match
 * Score: 0.95
 */
function findAliasMapMatch(query) {
  const normalized = normalizeText(query);
  
  // Try full query
  if (ALIAS_MAP[normalized]) {
    const entry = brochureData.find(e => e.id === ALIAS_MAP[normalized]);
    if (entry) {
      return {
        matchedEntry: entry,
        confidenceScore: 0.95,
        answerObject: entry.answer,
        matchType: 'alias_map'
      };
    }
  }
  
  return null;
}

/**
 * STEP 3: Keyword Overlap Scoring
 * Score: 0.80-0.90 based on overlap ratio
 */
function findKeywordMatch(query) {
  const normalized = normalizeText(query);
  const queryWords = normalized.split(' ').filter(w => w.length > 2);
  
  if (queryWords.length === 0) return null;
  
  let bestMatch = null;
  let bestScore = 0;
  
  for (const entry of brochureData) {
    const entryKeywords = (entry.keywords || []).map(k => normalizeText(k));
    
    // Count exact keyword matches
    let exactMatches = 0;
    let partialMatches = 0;
    
    for (const word of queryWords) {
      for (const keyword of entryKeywords) {
        if (keyword === word) {
          exactMatches++;
          break;
        } else if (keyword.includes(word) || word.includes(keyword)) {
          partialMatches += 0.5;
          break;
        }
      }
    }
    
    const totalMatches = exactMatches + partialMatches;
    const overlapRatio = totalMatches / queryWords.length;
    
    // Score between 0.80 and 0.90 based on match quality
    if (overlapRatio >= 0.5) {
      const score = 0.80 + (0.10 * overlapRatio);
      
      if (score > bestScore) {
        bestScore = score;
        bestMatch = {
          matchedEntry: entry,
          confidenceScore: Math.min(0.90, score),
          answerObject: entry.answer,
          matchType: 'keyword_overlap'
        };
      }
    }
  }
  
  return bestMatch;
}

/**
 * STEP 4: Fuse.js Semantic Match
 * Score: 0.85+ ONLY
 */
function findSemanticMatch(query) {
  const fuseOptions = {
    keys: [
      { name: 'question', weight: 0.5 },
      { name: 'aliases', weight: 0.3 },
      { name: 'keywords', weight: 0.2 }
    ],
    includeScore: true,
    ignoreLocation: true,
    threshold: 0.25,  // Stricter threshold
    distance: 50
  };
  
  const fuse = new Fuse(brochureData, fuseOptions);
  const results = fuse.search(query);
  
  if (results.length > 0) {
    const topResult = results[0];
    // Convert Fuse score (0 = perfect, 1 = worst) to confidence (0-1)
    const confidence = 1 - (topResult.score || 0);
    
    // ONLY accept if confidence >= 0.85
    if (confidence >= 0.85) {
      return {
        matchedEntry: topResult.item,
        confidenceScore: confidence,
        answerObject: topResult.item.answer,
        matchType: 'semantic'
      };
    }
  }
  
  return null;
}

/**
 * MAIN SEARCH FUNCTION
 * Enforces strict priority and rejection threshold
 */
export function searchBrochure(query) {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return {
      matchedEntry: null,
      confidenceScore: 0,
      answerObject: null,
      error: 'Empty query'
    };
  }
  
  // Reject too short queries (< 2 characters)
  const normalized = normalizeText(query);
  if (normalized.length < 2) {
    return {
      matchedEntry: null,
      confidenceScore: 0,
      answerObject: null,
      error: 'Query too short'
    };
  }
  
  // PRIORITY 1: Exact Match (1.0)
  const exactMatch = findExactMatch(query);
  if (exactMatch) {
    return exactMatch;
  }
  
  // PRIORITY 2: Alias Map (0.95)
  const aliasMatch = findAliasMapMatch(query);
  if (aliasMatch) {
    return aliasMatch;
  }
  
  // PRIORITY 3: Keyword Overlap (0.80-0.90)
  const keywordMatch = findKeywordMatch(query);
  if (keywordMatch && keywordMatch.confidenceScore >= 0.75) {
    return keywordMatch;
  }
  
  // PRIORITY 4: Semantic Match (0.85+)
  const semanticMatch = findSemanticMatch(query);
  if (semanticMatch && semanticMatch.confidenceScore >= 0.85) {
    return semanticMatch;
  }
  
  // REJECTION: No match above threshold
  return {
    matchedEntry: null,
    confidenceScore: 0,
    answerObject: null,
    error: 'no_match'
  };
}

/**
 * Formatted response for UI
 */
export function getFormattedResponse(query) {
  const result = searchBrochure(query);
  
  if (!result.matchedEntry || result.confidenceScore < 0.75) {
    return {
      success: false,
      confidence: 0,
      message: 'Sorry, no exact information found in the Rai University brochure. Please try rephrasing your question or contact us at +91 89 8000 4325.',
      matchType: 'no_match'
    };
  }
  
  return {
    success: true,
    confidence: result.confidenceScore,
    message: result.answerObject?.description || '',
    answer: result.answerObject,
    entryId: result.matchedEntry.id,
    title: result.answerObject?.title || result.matchedEntry.question,
    category: result.matchedEntry.category,
    matchType: result.matchType
  };
}

export default {
  searchBrochure,
  getFormattedResponse
};
