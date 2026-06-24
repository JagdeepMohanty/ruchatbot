import { useEffect, useRef, memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatBubble from './ChatBubble';
import TypingIndicator from './TypingIndicator';
import SuggestedQuestions from './SuggestedQuestions';
import { FiCopy, FiCheck } from 'react-icons/fi';

const WELCOME_QUESTIONS = [
  'What is the admission process?',
  'What programs does Rai University offer?',
  'What is the placement rate?',
  'Are hostel facilities available?',
  'What scholarships are offered?',
  'How do I contact Rai University?'
];

const DEFAULT_MESSAGE = {
  id: 'welcome_001',
  type: 'bot',
  text: "👋 Welcome to Rai University Chatbot! I'm here to help you with information about our programs, admissions, placements, campus facilities, and more. What would you like to know about Rai University?",
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isWelcome: true,
};

function ChatWindow({ messages = [], isLoading = false, onSuggestedQuestion }) {
  const messagesEndRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleCopyMessage = async (messageId, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const displayMessages = messages.length > 0 ? messages : [DEFAULT_MESSAGE];
  const showSuggestions = messages.length === 0 || (messages.length === 1 && messages[0].isWelcome);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-white to-gray-50 custom-scrollbar">
      <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-3 sm:space-y-4">
        <AnimatePresence mode="popLayout">
          {displayMessages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.type === 'bot' ? 'justify-start' : 'justify-end'}`}
            >
              <div className="relative group w-full">
                <ChatBubble
                  message={msg.text}
                  isBot={msg.type === 'bot'}
                  timestamp={msg.timestamp}
                  confidence={msg.confidence}
                  matchedKeywords={msg.matchedKeywords || []}
                />
                {msg.type === 'bot' && !msg.isWelcome && (
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.text)}
                    className="absolute -top-1 -right-8 sm:-right-10 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg bg-gray-200 hover:bg-gray-300 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                    title="Copy message"
                    aria-label="Copy message to clipboard"
                  >
                    {copiedId === msg.id ? (
                      <FiCheck size={16} className="text-green-600" aria-hidden="true" />
                    ) : (
                      <FiCopy size={16} className="text-gray-600" aria-hidden="true" />
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <TypingIndicator />
          </motion.div>
        )}

        {showSuggestions && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200"
          >
            <p className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-4">💡 Popular Questions:</p>
            <SuggestedQuestions
              questions={WELCOME_QUESTIONS}
              onSelect={onSuggestedQuestion}
            />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

export default memo(ChatWindow);
