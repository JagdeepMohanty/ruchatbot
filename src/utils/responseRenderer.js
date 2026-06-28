/**
 * STRUCTURED RESPONSE RENDERER
 * Converts brochure answer objects into clean, structured UI blocks
 * 
 * RULES:
 * - NO metadata (confidence, timestamps) in output
 * - NO raw HTML rendering
 * - ALWAYS return structured format
 */

/**
 * Format answer object into structured UI blocks
 * 
 * @param {Object} answerObject - Answer from brochure.json
 * @returns {Object} Structured format for UI rendering
 */
export function formatStructuredAnswer(answerObject) {
  if (!answerObject || typeof answerObject !== 'object') {
    return {
      type: 'empty',
      blocks: []
    };
  }

  const blocks = [];

  // 1. Title (Always render as H3)
  if (answerObject.title) {
    blocks.push({
      type: 'title',
      content: answerObject.title,
      key: 'title'
    });
  }

  // 2. Description (Always render as paragraph)
  if (answerObject.description) {
    blocks.push({
      type: 'description',
      content: answerObject.description,
      key: 'description'
    });
  }

  // 3. Details (Always render as bullet list)
  if (answerObject.details && Array.isArray(answerObject.details) && answerObject.details.length > 0) {
    blocks.push({
      type: 'details',
      heading: 'Key Points:',
      items: answerObject.details,
      key: 'details'
    });
  }

  // 4. Specializations (Render as separate section if present)
  if (answerObject.specializations && Array.isArray(answerObject.specializations) && answerObject.specializations.length > 0) {
    blocks.push({
      type: 'specializations',
      heading: 'Specializations:',
      items: answerObject.specializations,
      key: 'specializations'
    });
  }

  // 5. Features (Render as separate section if present)
  if (answerObject.features && Array.isArray(answerObject.features) && answerObject.features.length > 0) {
    blocks.push({
      type: 'features',
      heading: 'Key Features:',
      items: answerObject.features,
      key: 'features'
    });
  }

  // 6. Source (ONLY render in footer, never as main content)
  if (answerObject.source) {
    blocks.push({
      type: 'source',
      content: answerObject.source,
      key: 'source'
    });
  }

  return {
    type: 'structured',
    title: answerObject.title || '',
    description: answerObject.description || '',
    details: answerObject.details || [],
    specializations: answerObject.specializations || [],
    source: answerObject.source || '',
    blocks: blocks
  };
}

/**
 * Main entry point - formats any response into structured format
 * 
 * @param {Object} response - Response from search engine
 * @returns {Object} Structured format for UI
 */
export function formatResponse(response) {
  // If response has answer object, format it
  if (response && response.answer && typeof response.answer === 'object') {
    return formatStructuredAnswer(response.answer);
  }

  // If response is just an answer object
  if (response && response.title && response.description) {
    return formatStructuredAnswer(response);
  }

  // Fallback: plain text (error messages, etc.)
  if (typeof response === 'string') {
    return {
      type: 'text',
      blocks: [{
        type: 'text',
        content: response,
        key: 'text'
      }]
    };
  }

  // Empty response
  return {
    type: 'empty',
    blocks: []
  };
}

export default {
  formatStructuredAnswer,
  formatResponse
};
