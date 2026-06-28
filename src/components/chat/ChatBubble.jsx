import { memo } from 'react';
import { motion } from 'framer-motion';
import { formatResponse } from '../../utils/responseRenderer';

/**
 * CHATBUBBLE - Structured FAQ-Style Rendering
 * 
 * RULES:
 * - NO confidence scores shown to users
 * - NO timestamps in main content
 * - NO dangerouslySetInnerHTML
 * - Structured rendering: title → description → lists → source
 */

function ChatBubble({ message, isBot = false, timestamp, answer }) {
  /**
   * Render structured answer blocks
   * Each block type has specific styling
   */
  const renderStructuredBlocks = (blocks) => {
    if (!blocks || blocks.length === 0) return null;

    return blocks.map((block) => {
      if (!block) return null;

      switch (block.type) {
        // Title - H3 heading
        case 'title':
          return (
            <h3 
              key={block.key} 
              className="text-base sm:text-lg font-bold mb-2 text-gray-900 leading-tight"
            >
              {block.content}
            </h3>
          );

        // Description - Paragraph
        case 'description':
          return (
            <p 
              key={block.key} 
              className="mb-3 leading-relaxed text-sm sm:text-base text-gray-700"
            >
              {block.content}
            </p>
          );

        // Details - Bullet list with heading
        case 'details':
          return (
            <div key={block.key} className="mb-3">
              {block.heading && (
                <p className="font-semibold text-sm sm:text-base mb-2 text-gray-900">
                  {block.heading}
                </p>
              )}
              <ul className="ml-5 space-y-1.5 list-disc marker:text-primary-600">
                {block.items.map((item, idx) => (
                  <li 
                    key={idx} 
                    className="text-sm sm:text-base leading-relaxed text-gray-700 pl-1"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );

        // Specializations - Separate section
        case 'specializations':
          return (
            <div key={block.key} className="mb-3">
              <p className="font-semibold text-sm sm:text-base mb-2 text-gray-900">
                {block.heading}
              </p>
              <ul className="ml-5 space-y-1.5 list-disc marker:text-indigo-600">
                {block.items.map((item, idx) => (
                  <li 
                    key={idx} 
                    className="text-sm sm:text-base leading-relaxed text-gray-700 pl-1"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );

        // Features - Separate section
        case 'features':
          return (
            <div key={block.key} className="mb-3">
              <p className="font-semibold text-sm sm:text-base mb-2 text-gray-900">
                {block.heading}
              </p>
              <ul className="ml-5 space-y-1.5 list-disc marker:text-green-600">
                {block.items.map((item, idx) => (
                  <li 
                    key={idx} 
                    className="text-sm sm:text-base leading-relaxed text-gray-700 pl-1"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );

        // Source - Small footer text ONLY
        case 'source':
          return (
            <div 
              key={block.key} 
              className="mt-4 pt-3 border-t border-gray-300"
            >
              <p className="text-xs text-gray-500 italic">
                Source: {block.content}
              </p>
            </div>
          );

        // Plain text fallback
        case 'text':
          return (
            <p 
              key={block.key} 
              className="text-sm sm:text-base leading-relaxed text-gray-700"
            >
              {block.content}
            </p>
          );

        default:
          return null;
      }
    });
  };

  // Format bot response if answer object exists
  let formatted = null;
  if (isBot && answer) {
    formatted = formatResponse({ answer });
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
            ? 'bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900 border border-gray-200'
            : 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg'
        }`}
      >
        {/* Main Content */}
        <div className="text-sm sm:text-base leading-relaxed break-words">
          {isBot && formatted && formatted.type === 'structured' ? (
            // Structured FAQ-style rendering
            <div className="space-y-2">
              {renderStructuredBlocks(formatted.blocks)}
            </div>
          ) : (
            // Plain text (user messages or error messages)
            <div className={isBot ? 'text-gray-800' : 'text-white'}>
              {message}
            </div>
          )}
        </div>

        {/* Footer - Only timestamp, NO confidence */}
        {timestamp && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <span className={`text-xs ${isBot ? 'text-gray-400' : 'text-primary-100'}`}>
              {timestamp}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default memo(ChatBubble);
