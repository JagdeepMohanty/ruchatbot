import { getFormattedResponse } from './searchEngine.js';
import { CHATBOT_MESSAGES, CHATBOT_SETTINGS } from '../constants/chatbot.js';

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
   * Generate message ID with dynamic timestamp
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  /**
   * Get current timestamp
   */
  getCurrentTimestamp() {
    const now = new Date();
    // Use consistent human-friendly timestamp including date for clarity across devices
    return now.toLocaleString('en-GB', {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit'
    });
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
  addBotMessage(text, confidence = 0, metadata = {}, matchedKeywords = [], answer = null) {
    let rawConfidence = 0;
    if (typeof confidence === 'number') {
      rawConfidence = confidence <= 1 ? confidence : (confidence / 100);
    }
    const confidencePercent = Math.round((rawConfidence || 0) * 100);

    const message = {
      id: this.generateMessageId(),
      type: 'bot',
      text: text,
      timestamp: this.getCurrentTimestamp(),
      confidence: confidencePercent,
      rawConfidence: rawConfidence,
      matchedKeywords: matchedKeywords,
      answer: answer,
      metadata: metadata,
      createdAt: Date.now()
    };

    this.conversationHistory.push(message);
    this.saveChatHistory();
    return message;
  }

  /**
   * Process user query and get bot response
   */
  async processQuery(userQuery) {
    await new Promise(resolve => setTimeout(resolve, CHATBOT_SETTINGS.typingDelay));

    const response = getFormattedResponse(userQuery);
    const matchedKeywords = response.matchedKeywords || [];
    const rawConfidence = typeof response.confidence === 'number' ? response.confidence : 0;

    const metadata = {
      category: response.category || (response.entryId ? 'Brochure' : 'Unknown'),
      title: response.title || '',
      isFromBrochure: !!response.success,
      rawConfidence: rawConfidence
    };

    const botMessage = this.addBotMessage(
      response.message,
      rawConfidence,
      metadata,
      matchedKeywords,
      response.answer || null
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
      text: CHATBOT_MESSAGES.welcome,
      timestamp: this.getCurrentTimestamp(),
      isWelcome: true,
      createdAt: Date.now()
    };
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
   * Get conversations grouped by date
   */
  getConversationsByDate() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const sevenDays = 7 * oneDay;

    const grouped = {
      today: [],
      yesterday: [],
      lastWeek: [],
      older: []
    };

    // Group user messages into conversations (user + bot pairs)
    const conversations = [];
    let currentConv = null;

    this.conversationHistory.forEach(msg => {
      if (msg.type === 'user') {
        if (currentConv) conversations.push(currentConv);
        currentConv = {
          id: msg.id,
          title: msg.text.slice(0, 50) + (msg.text.length > 50 ? '...' : ''),
          timestamp: msg.createdAt,
          preview: msg.text
        };
      }
    });
    if (currentConv) conversations.push(currentConv);

    // Sort by timestamp descending
    conversations.sort((a, b) => b.timestamp - a.timestamp);

    // Categorize by date
    conversations.forEach(conv => {
      const age = now - conv.timestamp;

      if (age < oneDay) {
        grouped.today.push(conv);
      } else if (age < 2 * oneDay) {
        grouped.yesterday.push(conv);
      } else if (age < sevenDays) {
        grouped.lastWeek.push(conv);
      } else {
        grouped.older.push(conv);
      }
    });

    return grouped;
  }

  /**
   * Get today's conversations
   */
  getTodayConversations() {
    const grouped = this.getConversationsByDate();
    return grouped.today;
  }

  /**
   * Get recent messages
   */
  getRecentMessages(limit = 10) {
    return this.conversationHistory.slice(-limit);
  }

  /**
   * Load specific conversation by message ID
   */
  loadConversation(messageId) {
    const msgIndex = this.conversationHistory.findIndex(m => m.id === messageId);
    if (msgIndex === -1) return null;

    // Find conversation start (look backwards for user message)
    let startIndex = msgIndex;
    while (startIndex > 0 && this.conversationHistory[startIndex - 1].type !== 'user') {
      startIndex--;
    }

    return {
      messageId,
      messages: this.conversationHistory.slice(startIndex, msgIndex + 2)
    };
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
    return suggestionsMap[category] || [];
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
