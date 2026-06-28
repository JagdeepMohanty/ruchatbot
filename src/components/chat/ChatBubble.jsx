import { memo } from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { formatResponse } from '../../utils/responseRenderer';

function ChatBubble({ message, isBot = false, timestamp, confidence, matchedKeywords = [] }) {
  // Highlight matched keywords in text
  const highlightKeywords = (text, keywords) => {
    if (!keywords || keywords.length === 0) return text;
    
    let result = text;
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      result = result.replace(
        regex,
        `<mark class="bg-yellow-200 font-semibold">$&</mark>`
      );
    });
    return result;
  };

  // Render structured content blocks
  const renderStructuredContent = (blocks) => {
    return blocks.map((block) => {
      if (!block) return null;

      if (block.type === 'paragraph') {
        return (
          <p key={block.key} className="mb-3 leading-relaxed text-sm sm:text-base">
            {highlightKeywords(block.content, matchedKeywords)}
          </p>
        );
      }

      if (block.type === 'ul') {
        return (
          <ul key={block.key} className="mb-3 ml-4 space-y-1">
            {block.items.map((item, idx) => (
              <li key={idx} className="list-disc text-sm sm:text-base leading-relaxed">
                {highlightKeywords(item, matchedKeywords)}
              </li>
            ))}
          </ul>
        );
      }

      if (block.type === 'ol') {
        return (
          <ol
            key={block.key}
            className="mb-3 ml-4 space-y-1 list-decimal"
            style={block.letterStyle ? { listStyleType: 'lower-alpha' } : {}}
          >
            {block.items.map((item, idx) => (
              <li key={idx} className="text-sm sm:text-base leading-relaxed">
                {highlightKeywords(item, matchedKeywords)}
              </li>
            ))}
          </ol>
        );
      }

      return null;
    });
  };

  const getConfidenceColor = (score) => {
    if (score >= 85) return 'text-green-600';
    if (score >= 70) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getConfidenceLabel = (score) => {
    if (score >= 85) return 'High confidence';
    if (score >= 70) return 'Good match';
    if (score >= 60) return 'Partial match';
    return 'Low confidence';
  };

  // Parse and format bot response
  let formattedBlocks = null;
  if (isBot) {
    const formatted = formatResponse(message);
    if (formatted.hasStructure && formatted.blocks.length > 0) {
      formattedBlocks = formatted.blocks;
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-2 sm:mb-3 md:mb-4`}
    >
      <div
        className={`w-full sm:max-w-xs md:max-w-md lg:max-w-lg px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-2xl shadow-md transition-all hover:shadow-lg ${
          isBot
            ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border border-gray-200 rounded-bl-lg sm:rounded-bl-none'
            : 'bg-gradient-to-br from-primary-700 to-primary-800 text-white rounded-br-lg sm:rounded-br-none shadow-lg'
        }`}
      >
        <div className="text-sm sm:text-base leading-relaxed break-words overflow-wrap-break-word">
          {isBot && formattedBlocks ? (
            <div className="space-y-2">
              {renderStructuredContent(formattedBlocks)}
            </div>
          ) : isBot && matchedKeywords && matchedKeywords.length > 0 ? (
            <div dangerouslySetInnerHTML={{ __html: highlightKeywords(message, matchedKeywords) }} />
          ) : (
            message
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-3 mt-2 flex-wrap">
          <span className={`text-xs font-medium ${isBot ? 'text-gray-500' : 'text-primary-100'}`}>
            {timestamp}
          </span>
          {isBot && confidence && (
            <span className={`text-xs font-medium flex items-center gap-1 ${getConfidenceColor(confidence)}`}>
              {confidence >= 70 ? (
                <FiCheckCircle size={12} aria-hidden="true" />
              ) : (
                <FiAlertCircle size={12} aria-hidden="true" />
              )}
              {getConfidenceLabel(confidence)} ({confidence}%)
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Memoize component to prevent unnecessary re-renders
export default memo(ChatBubble);
