import { FiPlus, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Sidebar({ isOpen, onClose, onNewChat, chatbot, messages = [] }) {
  const [conversations, setConversations] = useState({ today: [], yesterday: [], lastWeek: [], older: [] });

  // Update grouped conversations whenever messages or chatbot change
  useEffect(() => {
    if (chatbot) {
      const grouped = chatbot.getConversationsByDate();
      setConversations(grouped);
    }
  }, [isOpen, chatbot, messages]);

  // Handle escape key to close sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const hasAnyConversations = 
    conversations.today.length > 0 || 
    conversations.yesterday.length > 0 || 
    conversations.lastWeek.length > 0 || 
    conversations.older.length > 0;

  // Extract content to reuse for mobile and desktop render
  const renderContent = () => (
    <>
      <div className="flex items-center justify-between p-4">
        <h2 className="font-semibold text-base">Chats</h2>
        <button
          onClick={onClose}
          className="md:hidden p-1 hover:bg-gray-800 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          aria-label="Close sidebar"
        >
          <FiX size={20} />
        </button>
      </div>

      <button
        onClick={onNewChat}
        className="m-4 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 transition-colors font-medium text-sm min-h-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
        aria-label="Start new chat"
      >
        <FiPlus size={18} />
        New Chat
      </button>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {!hasAnyConversations ? (
          <div className="text-center text-gray-500 text-sm py-8">
            No conversations yet.<br />Start chatting to see history!
          </div>
        ) : (
          <div className="space-y-4">
            {conversations.today.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Today</h3>
                <div className="space-y-1">
                  {conversations.today.map(conv => (
                    <div
                      key={conv.id}
                      className="p-3 rounded-lg bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors truncate focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                      title={conv.preview}
                    >
                      {conv.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {conversations.yesterday.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Yesterday</h3>
                <div className="space-y-1">
                  {conversations.yesterday.map(conv => (
                    <div
                      key={conv.id}
                      className="p-3 rounded-lg text-sm text-gray-400 hover:bg-gray-800 cursor-pointer transition-colors truncate focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                      title={conv.preview}
                    >
                      {conv.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {conversations.lastWeek.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Last 7 Days</h3>
                <div className="space-y-1">
                  {conversations.lastWeek.map(conv => (
                    <div
                      key={conv.id}
                      className="p-3 rounded-lg text-sm text-gray-400 hover:bg-gray-800 cursor-pointer transition-colors truncate focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                      title={conv.preview}
                    >
                      {conv.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {conversations.older.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wider">Older</h3>
                <div className="space-y-1">
                  {conversations.older.map(conv => (
                    <div
                      key={conv.id}
                      className="p-3 rounded-lg text-sm text-gray-400 hover:bg-gray-800 cursor-pointer transition-colors truncate focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
                      title={conv.preview}
                    >
                      {conv.title}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex gap-3">
          <button 
            onClick={onNewChat}
            className="flex-1 px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors min-h-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >
            Clear History
          </button>

          <button
            onClick={() => {
              try {
                const json = chatbot?.exportChatHistory?.() || '[]';
                const blob = new Blob([json], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rai_chat_history_${Date.now()}.json`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
              } catch (err) {
                console.error('Export failed', err);
              }
            }}
            className="px-4 py-2 text-sm rounded-lg bg-primary-600 hover:bg-primary-700 text-white transition-colors min-h-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          >
            Export
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Mobile animated sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-14 sm:top-16 left-0 bottom-0 w-56 sm:w-64 bg-gray-900 text-white z-40 flex flex-col overflow-hidden md:hidden"
          >
            {renderContent()}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop static sidebar */}
      <div className="hidden md:flex md:static md:translate-x-0 top-14 sm:top-16 left-0 bottom-0 w-56 sm:w-64 bg-gray-900 text-white z-40 flex flex-col overflow-hidden">
        {renderContent()}
      </div>
    </>
  );
}
