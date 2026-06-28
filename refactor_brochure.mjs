import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const oldBrochure = JSON.parse(fs.readFileSync(path.join(__dirname, 'src/data/brochure.json'), 'utf8'));

// Transform old format to new structured format
function refactorEntry(entry) {
  const { id, category, title, keywords, questions, answer } = entry;

  // Main question is first in questions array, rest are aliases
  const mainQuestion = questions && questions.length > 0 ? questions[0] : title;
  const aliases = questions && questions.length > 1 ? questions.slice(1) : [];

  // Parse answer into structured components
  const { description, details, subSections } = parseAnswer(answer, title);

  return {
    id,
    question: mainQuestion,
    aliases,
    category,
    keywords,
    answer: {
      title,
      description,
      details,
      subSections: subSections.length > 0 ? subSections : undefined,
      source: category // metadata for footer only
    }
  };
}

// Parse answer string into description + details
function parseAnswer(answerText, title) {
  if (!answerText || typeof answerText !== 'string') {
    return { description: '', details: [], subSections: [] };
  }

  const description = extractFirstSentence(answerText);
  const details = extractListItems(answerText);
  const subSections = extractSubSections(answerText);

  return { description, details, subSections };
}

function extractFirstSentence(text) {
  if (!text) return '';
  
  // Split before inline list pattern  
  const beforeList = text.split(/\s+\d+\)|[•\-*]\s/)[0].trim();
  
  // Extract first sentence from that part
  const match = beforeList.match(/^([^.!?]*[.!?])/);
  if (match) {
    return match[1].trim();
  }
  
  // If no clear sentence ending, take first part up to 200 chars or newline
  return beforeList.split('\n')[0].substring(0, 200).trim();
}

function extractListItems(text) {
  if (!text) return [];

  const items = [];
  
  // Match inline numbered lists: 1) item 2) item 3) item
  // Capture text between "N) " and next number or end
  const matches = Array.from(text.matchAll(/\d+\)\s+(.+?)(?=\d+\)\s+|$)/g));
  
  for (const match of matches) {
    const content = match[1].trim().replace(/\s+/g, ' ');
    if (content.length > 0) {
      items.push(content);
    }
  }

  // If found numbered, return those
  if (items.length > 0) return items;

  // Otherwise try bullet points
  const bulletMatches = text.matchAll(/[•\-*]\s+([^\n]+)/g);
  for (const match of bulletMatches) {
    const content = match[1].trim();
    if (content.length > 0) {
      items.push(content);
    }
  }

  return items;
}

function extractSubSections(text) {
  if (!text) return [];
  // For now, return empty - can be extended for text with clear subsections
  return [];
}

// Refactor all entries
const newBrochure = oldBrochure.map(refactorEntry);

// Write refactored brochure
const output = JSON.stringify(newBrochure, null, 2);
fs.writeFileSync(path.join(__dirname, 'src/data/brochure.json'), output, 'utf8');

console.log(`✓ Refactored ${newBrochure.length} entries`);
console.log(`Sample refactored entry (${newBrochure[0].id}):`);
console.log(JSON.stringify(newBrochure[0], null, 2));
