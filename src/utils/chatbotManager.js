import { getFormattedResponse } from './searchEngine';

/**
 * Chatbot conversation manager
 */
export class ChatbotManager {
  constructor() {
    this.conversationHistory = [];
    this.loadChatHistory();
  }

  /**
   * Load chat history from local storage
   */
  loadChatHistory() {
    try {
      const saved = localStorage.getItem('rai_chatbot_history');
      if (saved) {
        this.conversationHistory = JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error loading chat history:', err);
      this.conversationHistory = [];
    }
  }

  /**
   * Save chat history to local storage
   */
  saveChatHistory() {
    try {
      localStorage.setItem('rai_chatbot_history', JSON.stringify(this.conversationHistory));
    } catch (err) {
      console.error('Error saving chat history:', err);
    }
  }

  /**
   * Generate message ID
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current timestamp
   */
  getCurrentTimestamp() {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  }

  /**
   * Add user message to conversation
   */
  addUserMessage(text) {
    const message = {
      id: this.generateMessageId(),
      type: 'user',
      text: text.trim(),
      timestamp: this.getCurrentTimestamp(),
      createdAt: Date.now()
    };

    this.conversationHistory.push(message);
    this.saveChatHistory();
    return message;
  }

  /**
   * Add bot message to conversation
   */
  addBotMessage(text, confidence = 0, metadata = {}, matchedKeywords = [], rawAnswer = '') {
    const message = {
      id: this.generateMessageId(),
      type: 'bot',
      text: text,
      timestamp: this.getCurrentTimestamp(),
      confidence: confidence,
      matchedKeywords: matchedKeywords,
      rawAnswer: rawAnswer,
      metadata: metadata,
      createdAt: Date.now()
    };

    this.conversationHistory.push(message);
    this.saveChatHistory();
    return message;
  }

  /**
   * Process user query and get bot response
   * Note: User message should already be added by caller (Chatbot component)
   */
  async processQuery(userQuery, threshold = 60) {
    // Simulate typing delay with loading animation
    await new Promise(resolve => setTimeout(resolve, 800));

    // Get response from search engine
    const response = getFormattedResponse(userQuery, threshold);

    // Extract matched keywords for highlighting
    const matchedKeywords = response.matchedKeywords || [];

    // Create bot message with confidence and keywords
    const botMessage = this.addBotMessage(
      response.message,
      response.confidence || 0,
      {
        category: response.category || 'Unknown',
        title: response.title || '',
        isFromBrochure: response.success
      },
      matchedKeywords,
      response.rawAnswer || ''
    );

    return {
      botMessage,
      response
    };
  }

  /**
   * Get welcome message
   */
  getWelcomeMessage() {
    return {
      id: this.generateMessageId(),
      type: 'bot',
      text: "👋 Welcome to Rai University Chatbot! I'm here to help you with information about our programs, admissions, placements, campus facilities, and more. What would you like to know about Rai University?",
      timestamp: this.getCurrentTimestamp(),
      isWelcome: true,
      createdAt: Date.now()
    };
  }

  /**
   * Get suggested questions
   */
  getSuggestedQuestions() {
    return [
      "What is the admission process?",
      "What programs does Rai University offer?",
      "What is the placement rate?",
      "Tell me about the AI Learning Platform",
      "Are hostel facilities available?",
      "How do I contact Rai University?"
    ];
  }

  /**
   * Clear chat history
   */
  clearChatHistory() {
    this.conversationHistory = [];
    localStorage.removeItem('rai_chatbot_history');
  }

  /**
   * Get chat history
   */
  getChatHistory() {
    return this.conversationHistory;
  }

  /**
   * Get conversation statistics
   */
  getStatistics() {
    const userMessages = this.conversationHistory.filter(m => m.type === 'user').length;
    const botMessages = this.conversationHistory.filter(m => m.type === 'bot').length;
    const avgConfidence = this.conversationHistory
      .filter(m => m.type === 'bot' && m.confidence)
      .reduce((sum, m) => sum + m.confidence, 0) / (botMessages || 1);

    return {
      totalMessages: this.conversationHistory.length,
      userMessages,
      botMessages,
      averageConfidence: Math.round(avgConfidence),
      hasHistory: this.conversationHistory.length > 0
    };
  }

  /**
   * Export chat history as JSON
   */
  exportChatHistory() {
    return JSON.stringify(this.conversationHistory, null, 2);
  }

  /**
   * Export chat history as text
   */
  exportChatHistoryAsText() {
    return this.conversationHistory
      .map(msg => {
        const type = msg.type === 'user' ? 'You' : 'Rai Chatbot';
        const confidence = msg.confidence ? ` (${msg.confidence}% confidence)` : '';
        return `[${msg.timestamp}] ${type}${confidence}: ${msg.text}`;
      })
      .join('\n');
  }

  /**
   * Search through chat history
   */
  searchHistory(query) {
    const lowerQuery = query.toLowerCase();
    return this.conversationHistory.filter(msg =>
      msg.text.toLowerCase().includes(lowerQuery)
    );
  }

  /**
   * Get recent messages
   */
  getRecentMessages(limit = 10) {
    return this.conversationHistory.slice(-limit);
  }

  /**
   * Copy message to clipboard
   */
  async copyToClipboard(messageId) {
    try {
      const message = this.conversationHistory.find(m => m.id === messageId);
      if (message) {
        await navigator.clipboard.writeText(message.text);
        return { success: true, message: 'Copied to clipboard!' };
      }
      return { success: false, message: 'Message not found' };
    } catch {
      return { success: false, message: 'Failed to copy' };
    }
  }

  /**
   * Get context-aware follow-up suggestions
   */
  getFollowUpSuggestions(lastBotMessage) {
    const suggestionsMap = {
      'About': [
        'What is Rai University?',
        'What is the vision of Rai University?'
      ],
      'Programs': [
        'What are the specializations?',
        'What is the duration?',
        'Can I get placement support?'
      ],
      'Recognition & Accreditation': [
        'What are the ratings?',
        'Is it NAAC accredited?'
      ],
      'Placements': [
        'What is the placement rate?',
        'How are students trained for interviews?'
      ],
      'AI Learning Platform': [
        'Can I access courses offline?',
        'What features are available?'
      ],
      'Contact Information': [
        'How do I apply?',
        'When are admissions open?'
      ]
    };

    const category = lastBotMessage?.metadata?.category || 'About';
    return suggestionsMap[category] || this.getSuggestedQuestions().slice(0, 3);
  }
}

/**
 * Create singleton instance
 */
let chatbotInstance = null;

export function getChatbotInstance() {
  if (!chatbotInstance) {
    chatbotInstance = new ChatbotManager();
  }
  return chatbotInstance;
}

export default ChatbotManager;
