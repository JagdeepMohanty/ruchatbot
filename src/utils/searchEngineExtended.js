/**
 * Extended search engine with auto-repair capabilities
 * This module enhances searchEngine.js with additional aliases and synonyms
 */

import Fuse from 'fuse.js';
import brochureData from '../data/brochure.json';

// EXTENDED ALIAS MAP - Comprehensive coverage
export const EXTENDED_ALIAS_MAP = {
  // Science & Academics - Extended
  'science': 'sciences_001',
  'sciences': 'sciences_001',
  'bsc': 'sciences_001',
  'b.sc': 'sciences_001',
  'bachelors science': 'sciences_001',
  'msc': 'sciences_001',
  'm.sc': 'sciences_001',
  'masters science': 'sciences_001',
  'chemistry': 'sciences_001',
  'microbiology': 'sciences_001',
  'pharmaceutical': 'sciences_001',
  'bio': 'sciences_001',
  'biochemistry': 'sciences_001',
  
  // Management Programs - Extended
  'bba': 'management_courses_001',
  'mba': 'management_courses_001',
  'b.com': 'management_courses_001',
  'bcom': 'management_courses_001',
  'bachelors commerce': 'management_courses_001',
  'commerce': 'management_001',
  'business': 'management_001',
  'finance': 'management_courses_001',
  'fintech': 'management_courses_001',
  'marketing': 'management_courses_001',
  'digital marketing': 'management_courses_001',
  'hr': 'management_courses_001',
  'human resources': 'management_courses_001',
  'hrm': 'management_courses_001',
  'accounting': 'management_courses_001',
  'accounting and finance': 'management_courses_001',
  'entrepreneurship': 'ssip_cell_001',
  'startup': 'ssip_cell_001',
  'innovation': 'ssip_cell_001',
  
  // Engineering - Extended
  'engineering': 'engineering_001',
  'b.tech': 'engineering_001',
  'btech': 'engineering_001',
  'bachelors engineering': 'engineering_001',
  'cse': 'engineering_courses_001',
  'computer science': 'engineering_courses_001',
  'computer engineering': 'engineering_courses_001',
  'it': 'engineering_courses_001',
  'information technology': 'engineering_courses_001',
  'mechanical': 'engineering_courses_001',
  'mechanical engineering': 'engineering_courses_001',
  'electrical': 'engineering_courses_001',
  'electrical engineering': 'engineering_courses_001',
  'ai': 'engineering_001',
  'artificial intelligence': 'engineering_001',
  'ml': 'engineering_001',
  'machine learning': 'engineering_001',
  'deep learning': 'engineering_001',
  'cloud': 'engineering_001',
  'cloud computing': 'engineering_001',
  'aws': 'engineering_001',
  'cyber': 'engineering_courses_001',
  'cyber security': 'engineering_courses_001',
  'cybersecurity': 'engineering_courses_001',
  'security': 'engineering_courses_001',
  'data science': 'engineering_001',
  'data analytics': 'engineering_001',
  'full stack': 'engineering_001',
  
  // Computer Applications - Extended
  'mca': 'mca_001',
  'master computer applications': 'mca_001',
  'masters computer': 'mca_001',
  'bca': 'bca_001',
  'bachelor computer applications': 'bca_001',
  'bachelors computer': 'bca_001',
  'b.sc it': 'bsc_it_001',
  'bsc it': 'bsc_it_001',
  'computer applications': 'bca_001',
  
  // Other Schools - Extended
  'pharmacy': 'pharmacy_001',
  'b.pharm': 'pharmacy_001',
  'bpharm': 'pharmacy_001',
  'bachelors pharmacy': 'pharmacy_001',
  'd.pharm': 'pharmacy_001',
  'dpharm': 'pharmacy_001',
  'diploma pharmacy': 'pharmacy_001',
  'm.pharm': 'pharmacy_001',
  'mpharm': 'pharmacy_001',
  'masters pharmacy': 'pharmacy_001',
  'pharmacist': 'pharmacy_001',
  'pharmaceutical sciences': 'pharmacy_001',
  'law': 'law_001',
  'llb': 'law_001',
  'bachelor law': 'law_001',
  'llm': 'law_001',
  'masters law': 'law_001',
  'legal studies': 'law_001',
  'agriculture': 'agriculture_001',
  'agricultural': 'agriculture_001',
  'farming': 'agriculture_001',
  'agri': 'agriculture_001',
  'design': 'design_001',
  'fashion design': 'design_001',
  'fashion': 'design_001',
  'creative': 'design_001',
  'liberal studies': 'liberal_studies_001',
  'liberal arts': 'liberal_studies_001',
  'psychology': 'liberal_studies_001',
  'arts': 'liberal_studies_001',
  'b.a': 'liberal_studies_001',
  'ba': 'liberal_studies_001',
  
  // Campus & Location - Extended
  'campus': 'location_001',
  'location': 'location_001',
  'address': 'location_001',
  'where': 'location_001',
  'reach': 'location_001',
  'how to reach': 'location_001',
  'contact': 'contact_001',
  'email': 'contact_001',
  'phone': 'contact_001',
  'phone number': 'contact_001',
  'contact number': 'contact_001',
  'ahmedabad': 'location_001',
  'dholka': 'location_001',
  'saroda': 'location_001',
  'website': 'contact_001',
  'contact us': 'contact_001',
  
  // Placements & Careers - Extended
  'placement': 'placements_001',
  'placements': 'placements_001',
  'placement support': 'placements_001',
  'placement rate': 'placements_001',
  'placement assistance': 'placements_001',
  'job': 'placements_001',
  'jobs': 'placements_001',
  'job opportunities': 'placements_001',
  'career': 'placements_001',
  'careers': 'placements_001',
  'career support': 'placements_001',
  'recruitment': 'placements_001',
  'hiring': 'placements_001',
  'interview': 'placements_001',
  'interview preparation': 'placements_001',
  'mock interview': 'placements_001',
  'internship': 'placements_001',
  'internships': 'placements_001',
  'crc': 'placements_001',
  'corporate resource cell': 'placements_001',
  'placement suite': 'placement_suite_001',
  'ai enabled placement': 'placement_suite_001',
  
  // Achievements & Recognition - Extended
  'achievement': 'ratings_001',
  'achievements': 'ratings_001',
  'award': 'ratings_001',
  'awards': 'ratings_001',
  'ranking': 'ratings_001',
  'rankings': 'ratings_001',
  'rating': 'ratings_001',
  'ratings': 'ratings_001',
  'recognition': 'recognition_001',
  'accreditation': 'recognition_001',
  'accredited': 'recognition_001',
  'gsirf': 'ratings_001',
  'iic': 'ratings_001',
  'zee': 'ratings_001',
  'times': 'ratings_001',
  'honours': 'liberal_studies_001',
  'honors': 'liberal_studies_001',
  'hons': 'liberal_studies_001',
  
  // University Information - Extended
  'vision': 'vision_001',
  'vision statement': 'vision_001',
  'mission': 'mission_001',
  'mission statement': 'mission_001',
  'about': 'about_001',
  'about us': 'about_001',
  'established': 'about_001',
  'founded': 'about_001',
  'features': 'salient_001',
  'salient features': 'salient_001',
  'highlights': 'salient_001',
  'pillars': 'four_pillars_001',
  'four pillars': 'four_pillars_001',
  'support': '360_support_001',
  '360 support': '360_support_001',
  '360 degree support': '360_support_001',
  'faculty': 'experience_001',
  'faculties': 'experience_001',
  'professors': 'experience_001',
  'teachers': 'experience_001',
  'experienced': 'experience_001',
  'iit': 'experience_001',
  'iim': 'experience_001',
  'educators': 'experience_001',
  
  // Research & Innovation - Extended
  'research': 'research_innovation_001',
  'research opportunities': 'research_innovation_001',
  'research center': 'research_innovation_001',
  'phd': 'research_innovation_001',
  'phd program': 'research_innovation_001',
  'doctoral': 'research_innovation_001',
  'doctoral program': 'research_innovation_001',
  'innovation': 'ssip_cell_001',
  'innovation support': 'ssip_cell_001',
  'innovation cell': 'ssip_cell_001',
  'startup': 'ssip_cell_001',
  'startup support': 'ssip_cell_001',
  'startup incubation': 'ssip_cell_001',
  'entrepreneurship': 'ssip_cell_001',
  'incubation': 'ssip_cell_001',
  'incubator': 'ssip_cell_001',
  'ssip': 'ssip_cell_001',
  'ssip cell': 'ssip_cell_001',
  'hackathon': 'ssip_cell_001',
  'intellectual property': 'ssip_cell_001',
  
  // AI Learning Platform - Extended
  'ai learning platform': 'ai_learning_001',
  'ai-driven': 'ai_learning_001',
  'ai driven learning': 'ai_learning_001',
  'learning platform': 'ai_learning_001',
  'smart learning': 'ai_learning_001',
  'dashboard': 'dashboard_analytics_001',
  'analytics': 'dashboard_analytics_001',
  'progress tracking': 'dashboard_analytics_001',
  'performance tracking': 'dashboard_analytics_001',
  'virtual labs': 'ai_learning_001',
  'virtual lab': 'ai_learning_001',
  'lab': 'ai_learning_001',
  'holographic': '3d_models_001',
  'holobox': '3d_models_001',
  '3d models': '3d_models_001',
  '3d visualization': '3d_models_001',
  'smart classroom': 'smart_classroom_001',
  'smart classrooms': 'smart_classroom_001',
  'digital classroom': 'smart_classroom_001',
  'interactive learning': 'smart_classroom_001',
  'multimedia': 'smart_classroom_001',
  'offline': 'offline_learning_001',
  'offline learning': 'offline_learning_001',
  'offline mode': 'offline_learning_001',
  'no internet': 'offline_learning_001',
  'without internet': 'offline_learning_001',
  'online': 'offline_learning_001',
  'learning app': 'offline_learning_001',
  
  // Admissions - Extended
  'admission': 'admission_001',
  'admissions': 'admission_001',
  'admission process': 'admission_001',
  'admission requirements': 'admission_001',
  'apply': 'admission_001',
  'application': 'admission_001',
  'application process': 'admission_001',
  'enroll': 'admission_001',
  'enrollment': 'admission_001',
  'register': 'admission_001',
  'registration': 'admission_001',
  'fee': 'fee_structure_001',
  'fees': 'fee_structure_001',
  'fee structure': 'fee_structure_001',
  'cost': 'fee_structure_001',
  'cost of admission': 'fee_structure_001',
  'tuition': 'fee_structure_001',
  'scholarship': 'fee_structure_001',
  'scholarships': 'fee_structure_001',
  'financial aid': 'fee_structure_001',
  'financial support': 'fee_structure_001',
  'payment': 'fee_structure_001',
  'payments': 'fee_structure_001',
  
  // Recognition - Extended
  'recognition': 'recognition_001',
  'recognized': 'recognition_001',
  'ugc': 'recognition_001',
  'ugc approved': 'recognition_001',
  'naac': 'recognition_001',
  'naac accredited': 'recognition_001',
  'accreditation': 'recognition_001',
  'accredited': 'recognition_001',
  'bci': 'recognition_001',
  'bar council': 'recognition_001',
  'pci': 'recognition_001',
  'pharmacy council': 'recognition_001',
  'iso': 'recognition_001',
  'iso certified': 'recognition_001',
  
  // Collaborations - Extended
  'collaboration': 'collaborations_001',
  'collaborations': 'collaborations_001',
  'partnership': 'collaborations_001',
  'partnerships': 'collaborations_001',
  'partner': 'collaborations_001',
  'partners': 'collaborations_001',
  'tata': 'collaborations_001',
  'tata iis': 'collaborations_001',
  'microsoft': 'collaborations_001',
  'microsoft certification': 'collaborations_001',
  'industry': 'collaborations_001',
  'industry collaboration': 'collaborations_001',
  'corporate': 'collaborations_001',
  'corporate partnership': 'collaborations_001',
  
  // Student Life - Extended
  'student clubs': 'student_clubs_001',
  'student club': 'student_clubs_001',
  'clubs': 'student_clubs_001',
  'activities': 'student_clubs_001',
  'events': 'student_clubs_001',
  'events @ ru': 'student_clubs_001',
  'organization': 'student_clubs_001',
  'organizations': 'student_clubs_001',
  'cultural': 'student_clubs_001',
  'cultural events': 'student_clubs_001',
  'sports': 'student_clubs_001',
  'sports activities': 'student_clubs_001',
  'extracurricular': 'student_clubs_001',
  'extracurriculars': 'student_clubs_001',
  'student life': 'student_clubs_001',
  'campus life': 'student_clubs_001',
  
  // Program-specific - Extended
  'diploma': 'engineering_001',
  'd2d': 'engineering_courses_001',
  'degree to degree': 'engineering_courses_001',
  'integrated': 'management_001',
  'integrated mba': 'management_001',
  'specialization': 'engineering_courses_001',
  'specializations': 'engineering_courses_001',
  'elective': 'engineering_001',
  'electives': 'engineering_001',
  'course': 'engineering_001',
  'courses': 'engineering_001',
  'program': 'engineering_001',
  'programs': 'engineering_001',
  'stream': 'engineering_001',
  'streams': 'engineering_001',
  'semester': 'engineering_001',
  'semesters': 'engineering_001',
  'duration': 'engineering_001',
  'term': 'engineering_001',
  'terms': 'engineering_001'
};

// Additional abbreviations and synonyms
export const ABBREVIATION_MAP = {
  'sci': 'sciences_001',
  'eng': 'engineering_001',
  'comp': 'engineering_courses_001',
  'bio': 'sciences_001',
  'pharm': 'pharmacy_001',
  'acct': 'management_courses_001',
  'acc': 'management_courses_001',
  'dept': 'engineering_001',
  'prg': 'engineering_001',
  'univ': 'about_001',
  'uni': 'about_001',
  'rai': 'about_001',
  'ugc': 'recognition_001',
  'naac': 'recognition_001',
  'iit': 'experience_001',
  'iim': 'experience_001',
  'crc': 'placements_001',
  'ai': 'engineering_001',
  'ml': 'engineering_001',
  'hr': 'management_courses_001',
  'it': 'engineering_courses_001',
  'cse': 'engineering_courses_001',
  'bs': 'sciences_001',
  'ms': 'sciences_001',
  'ba': 'liberal_studies_001',
  'ma': 'liberal_studies_001',
  'phd': 'research_innovation_001',
  'mba': 'management_courses_001',
  'bba': 'management_courses_001',
  'bca': 'bca_001',
  'mca': 'mca_001',
  'btech': 'engineering_001',
  'llb': 'law_001',
  'llm': 'law_001',
  'bpharm': 'pharmacy_001',
  'mpharm': 'pharmacy_001'
};

// Typo corrections and fuzzy mappings
export const TYPO_CORRECTIONS = {
  'enginerring': 'engineering',
  'enginnering': 'engineering',
  'comupter': 'computer',
  'compter': 'computer',
  'scince': 'science',
  'managment': 'management',
  'achivement': 'achievement',
  'admmission': 'admission',
  'plcement': 'placement',
  'intership': 'internship',
  'spcialization': 'specialization',
  'activites': 'activities',
  'facilites': 'facilities',
  'unversity': 'university',
  'pharamcy': 'pharmacy',
  'psycology': 'psychology'
};

export function normalizeAndRepair(text) {
  if (!text || typeof text !== 'string') return '';
  
  let normalized = text.toLowerCase().trim();
  
  // Apply typo corrections
  for (const [typo, correct] of Object.entries(TYPO_CORRECTIONS)) {
    if (normalized.includes(typo)) {
      normalized = normalized.replace(new RegExp(typo, 'g'), correct);
    }
  }
  
  return normalized
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .split(' ')
    .filter(word => word.length > 0)
    .join(' ');
}

export function findExtendedAlias(query) {
  const normalized = normalizeAndRepair(query).toLowerCase();
  
  // Try exact match
  if (EXTENDED_ALIAS_MAP[normalized]) {
    return EXTENDED_ALIAS_MAP[normalized];
  }
  
  // Try abbreviation
  if (ABBREVIATION_MAP[normalized]) {
    return ABBREVIATION_MAP[normalized];
  }
  
  // Try word-by-word match
  const words = normalized.split(' ');
  for (const word of words) {
    if (EXTENDED_ALIAS_MAP[word]) {
      return EXTENDED_ALIAS_MAP[word];
    }
    if (ABBREVIATION_MAP[word]) {
      return ABBREVIATION_MAP[word];
    }
  }
  
  return null;
}

export default {
  EXTENDED_ALIAS_MAP,
  ABBREVIATION_MAP,
  TYPO_CORRECTIONS,
  normalizeAndRepair,
  findExtendedAlias
};
