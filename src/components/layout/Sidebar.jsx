import { FiPlus, FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

export default function Sidebar({ isOpen, onClose, onNewChat }) {
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

  return (
    <>
      {/* Mobile overlay */}
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

      {/* Sidebar */}
      <motion.div
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed md:static md:translate-x-0 top-14 sm:top-16 left-0 bottom-0 w-56 sm:w-64 bg-gray-900 text-white z-40 flex flex-col overflow-hidden ${
          isOpen ? '' : 'hidden md:flex'
        }`}
      >
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
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-gray-800 text-sm text-gray-300 hover:bg-gray-700 cursor-pointer transition-colors truncate focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500">
              Today's Conversation
            </div>
            <div className="p-3 rounded-lg text-sm text-gray-400 hover:bg-gray-800 cursor-pointer transition-colors truncate focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500">
              Yesterday
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button className="w-full px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors min-h-10 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500">
            Settings
          </button>
        </div>
      </motion.div>
    </>
  );
}
