import { useState, useCallback, useMemo } from 'react';
import { FiMenu } from 'react-icons/fi';
import Navbar from '../components/layout/Navbar';
import Sidebar from '../components/layout/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import InputBox from '../components/chat/InputBox';
import { getChatbotInstance } from '../utils/chatbotManager';
import { CHATBOT_MESSAGES } from '../constants/chatbot';

export default function Chatbot() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Create chatbot instance once and memoize it
  const chatbot = useMemo(() => getChatbotInstance(), []);

  // Initialize messages with chatbot's history
  const [messages, setMessages] = useState(() => {
    const history = chatbot.getChatHistory();
    if (history.length === 0) {
      // Persist welcome message so it remains across refreshes
      const welcome = chatbot.addBotMessage(CHATBOT_MESSAGES.welcome, 100, { isWelcome: true });
      return [welcome];
    }
    return history;
  });

  // Memoize handlers to prevent unnecessary re-renders of child components
  const handleSendMessage = useCallback(async (message) => {
    if (!chatbot || !message.trim()) return;

    // Add user message
    const userMsg = chatbot.addUserMessage(message);
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Process query and get response
      const result = await chatbot.processQuery(message);
      setMessages(prev => [...prev, result.botMessage]);
    } catch (err) {
      console.error('Error processing message:', err);
      const errorMsg = chatbot.addBotMessage(
        'Sorry, I encountered an error. Please try again.',
        0,
        { error: true }
      );
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [chatbot]);

  const handleNewChat = useCallback(() => {
    if (chatbot) {
      chatbot.clearChatHistory();
      setMessages([chatbot.getWelcomeMessage()]);
    }
    setSidebarOpen(false);
  }, [chatbot]);

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onNewChat={handleNewChat}
          chatbot={chatbot}
          messages={messages}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="md:hidden flex items-center gap-4 px-4 py-3 border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open navigation menu"
            >
              <FiMenu size={20} aria-hidden="true" />
            </button>
            <h1 className="font-semibold text-gray-900">Rai University Chat</h1>
          </div>

          <ChatWindow
            messages={messages}
            isLoading={isLoading}
          />

          <InputBox onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
