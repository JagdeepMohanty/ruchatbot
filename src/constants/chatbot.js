// Single source of truth for chatbot configuration

export const CHATBOT_CONFIG = {
  name: "Rai",
  university: "Rai University",
  version: "1.0.0",
};

export const CHATBOT_MESSAGES = {
  welcome: `👋 Welcome to ${CHATBOT_CONFIG.university} Assistant! I'm here to help you with information about our programs, admissions, placements, campus facilities, and more. What would you like to know about ${CHATBOT_CONFIG.university}?`,

  fallback: `I apologize, but I don't have specific information about that topic in my current knowledge base. Could you please rephrase your question or ask about admissions, programs, placements, facilities, or campus life at ${CHATBOT_CONFIG.university}?`,

  error: "Sorry, I encountered an error. Please try again.",

  thinking: "Let me check that for you...",

  noMatch:
    "I couldn't find this information. Please contact us at +91 89 8000 4325 or info@raiuniversity.edu for more details.",

  outOfScope: `I can only answer questions about ${CHATBOT_CONFIG.university}. Please ask about programs, admissions, placements, campus, or facilities.`,
};

export const CHATBOT_SETTINGS = {
  searchThreshold: 0.3,
  minPrefixLength: 5,
  maxHistoryDisplay: 50,
  typingDelay: 800,
  minQuestionMatchScore: 0.7,
};