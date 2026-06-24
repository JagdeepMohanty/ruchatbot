import { useState, useRef, useEffect } from 'react';
import { FiSend } from 'react-icons/fi';

export default function InputBox({ onSend, isLoading = false }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const autoResize = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    autoResize();
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
      autoResize();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 bg-white p-2 sm:p-4 shadow-lg">
      <div className="max-w-4xl mx-auto flex gap-2 sm:gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            autoResize();
          }}
          onKeyDown={handleKeyDown}
          placeholder="Ask me anything about Rai University... (Press Enter to send, Shift+Enter for new line)"
          disabled={isLoading}
          rows={1}
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 text-sm rounded-lg border border-gray-300 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 resize-none transition-all max-h-32"
          aria-label="Chat message input"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="h-10 sm:h-12 w-10 sm:w-12 rounded-lg bg-gradient-to-r from-primary-600 to-primary-700 text-white flex items-center justify-center hover:from-primary-700 hover:to-primary-800 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg flex-shrink-0 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
          title="Send message (Press Enter)"
          aria-label="Send message"
        >
          <FiSend size={18} className="sm:w-5 sm:h-5" aria-hidden="true" />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center px-2 sm:px-0">Shift + Enter for new line</p>
    </form>
  );
}
