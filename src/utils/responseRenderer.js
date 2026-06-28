/**
 * Professional Response Rendering Engine
 * Detects and renders content based on structure:
 * - Paragraphs
 * - Bullet lists
 * - Numbered lists
 * - Mixed content
 * - Tables
 */

/**
 * Detect content type from answer text
 */
export function detectContentType(text) {
  if (!text || typeof text !== 'string') return 'text';

  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length === 0) return 'text';

  let bulletCount = 0;
  let numberedCount = 0;
  let letterCount = 0;
  let paragraphCount = 0;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (/^[•\-*]\s+/.test(trimmed)) bulletCount++;
    else if (/^\d+\)\s+/.test(trimmed)) numberedCount++;
    else if (/^[a-z]\)\s+/.test(trimmed)) letterCount++;
    else if (trimmed.length > 0) paragraphCount++;
  });

  const totalStructuredItems = bulletCount + numberedCount + letterCount;

  // Determine primary structure
  if (totalStructuredItems === 0) {
    return 'paragraph';
  }

  if (paragraphCount > 0 && totalStructuredItems > 0) {
    return 'mixed';
  }

  if (bulletCount > numberedCount && bulletCount > letterCount) {
    return 'bullet';
  }

  if (numberedCount > bulletCount && numberedCount > letterCount) {
    return 'numbered';
  }

  if (letterCount > 0) {
    return 'lettered';
  }

  return 'mixed';
}

/**
 * Parse text into structured items
 */
export function parseContent(text) {
  if (!text || typeof text !== 'string') return [];

  const lines = text.split('\n');
  const items = [];
  let currentParagraph = [];

  lines.forEach(line => {
    const trimmed = line.trim();

    if (!trimmed) {
      if (currentParagraph.length > 0) {
        items.push({
          type: 'paragraph',
          content: currentParagraph.join(' ').trim()
        });
        currentParagraph = [];
      }
      return;
    }

    if (/^[•\-*]\s+/.test(trimmed)) {
      if (currentParagraph.length > 0) {
        items.push({
          type: 'paragraph',
          content: currentParagraph.join(' ').trim()
        });
        currentParagraph = [];
      }
      items.push({
        type: 'bullet',
        content: trimmed.replace(/^[•\-*]\s+/, '').trim()
      });
    } else if (/^\d+\)\s+/.test(trimmed)) {
      if (currentParagraph.length > 0) {
        items.push({
          type: 'paragraph',
          content: currentParagraph.join(' ').trim()
        });
        currentParagraph = [];
      }
      items.push({
        type: 'numbered',
        content: trimmed.replace(/^\d+\)\s+/, '').trim()
      });
    } else if (/^[a-z]\)\s+/.test(trimmed)) {
      if (currentParagraph.length > 0) {
        items.push({
          type: 'paragraph',
          content: currentParagraph.join(' ').trim()
        });
        currentParagraph = [];
      }
      items.push({
        type: 'lettered',
        content: trimmed.replace(/^[a-z]\)\s+/, '').trim()
      });
    } else {
      currentParagraph.push(trimmed);
    }
  });

  // Handle remaining paragraph
  if (currentParagraph.length > 0) {
    items.push({
      type: 'paragraph',
      content: currentParagraph.join(' ').trim()
    });
  }

  return items;
}

/**
 * Group consecutive items of same type
 */
export function groupItems(items) {
  if (!items || items.length === 0) return [];

  const grouped = [];
  let currentGroup = null;

  items.forEach(item => {
    if (item.type === 'paragraph') {
      if (currentGroup && currentGroup.type !== 'paragraph') {
        grouped.push(currentGroup);
        currentGroup = null;
      }
      grouped.push(item);
    } else {
      if (!currentGroup || currentGroup.type !== item.type) {
        if (currentGroup) grouped.push(currentGroup);
        currentGroup = {
          type: item.type,
          items: [item.content]
        };
      } else {
        currentGroup.items.push(item.content);
      }
    }
  });

  if (currentGroup) grouped.push(currentGroup);

  return grouped;
}

/**
 * Render grouped items to React elements (returns JSX structure)
 */
export function renderContent(text) {
  const items = parseContent(text);
  const grouped = groupItems(items);

  return grouped.map((group, idx) => {
    if (group.type === 'paragraph') {
      return {
        key: `para-${idx}`,
        type: 'paragraph',
        content: group.content
      };
    } else if (group.type === 'bullet') {
      return {
        key: `bullet-${idx}`,
        type: 'ul',
        items: group.items
      };
    } else if (group.type === 'numbered') {
      return {
        key: `numbered-${idx}`,
        type: 'ol',
        items: group.items
      };
    } else if (group.type === 'lettered') {
      return {
        key: `lettered-${idx}`,
        type: 'ol',
        items: group.items,
        letterStyle: true
      };
    }
    return null;
  });
}

/**
 * Check if text contains structured content
 */
export function hasStructuredContent(text) {
  if (!text || typeof text !== 'string') return false;

  const lines = text.split('\n');
  return lines.some(line => {
    const trimmed = line.trim();
    return /^[•\-*]\s+/.test(trimmed) ||
           /^\d+\)\s+/.test(trimmed) ||
           /^[a-z]\)\s+/.test(trimmed);
  });
}

/**
 * Extract key sections from content
 */
export function extractSections(text) {
  if (!text || typeof text !== 'string') return [];

  const sections = [];
  const lines = text.split('\n');
  let currentSection = null;

  lines.forEach(line => {
    const trimmed = line.trim();

    // Detect section headers (all caps with optional number)
    if (/^[A-Z][A-Z\s\-:]{2,}/.test(trimmed)) {
      if (currentSection) sections.push(currentSection);
      currentSection = {
        header: trimmed,
        content: []
      };
    } else if (currentSection && trimmed) {
      currentSection.content.push(trimmed);
    }
  });

  if (currentSection) sections.push(currentSection);

  return sections;
}

/**
 * Format response for display
 * Returns structured object for React rendering
 */
export function formatResponse(answer) {
  if (!answer || typeof answer !== 'string') {
    return {
      blocks: [],
      hasStructure: false,
      contentType: 'empty'
    };
  }

  const contentType = detectContentType(answer);
  const blocks = renderContent(answer);
  const hasStructure = hasStructuredContent(answer);

  return {
    blocks,
    contentType,
    hasStructure,
    rawText: answer
  };
}

export default {
  detectContentType,
  parseContent,
  groupItems,
  renderContent,
  hasStructuredContent,
  extractSections,
  formatResponse
};
