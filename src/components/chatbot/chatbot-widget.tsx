'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, Loader2, Info } from 'lucide-react';
import Image from 'next/image';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const suggestedQuestions = [
  "What is PhilHealth?",
  "How many beneficiaries does PhilHealth have?",
  "What are the latest financial reports?",
  "Show me claims statistics",
  "How do I become a member?",
  "What services are covered?",
];

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your PhilHealth Transparency AI assistant. I can help you find information about beneficiaries, claims, financial data, and more. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const startNewSession = async () => {
    try {
      const response = await fetch('https://philhealth-ai-623960795683.asia-southeast1.run.app/session/start');
      if (!response.ok) {
        throw new Error('Failed to start session');
      }
      const data = await response.json();
      setSessionId(data.sid);
      return data.sid;
    } catch (error) {
      console.error('Error starting session:', error);
      return null;
    }
  };

  const handleSendMessage = async (messageToSend?: string) => {
    const messageContent = messageToSend || inputValue;
    if (!messageContent.trim() || isLoading) return;

    // Hide suggestions after first user message
    setShowSuggestions(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Get or create session
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        currentSessionId = await startNewSession();
        if (!currentSessionId) {
          throw new Error('Failed to create session');
        }
      }

      const response = await fetch(
        `https://philhealth-ai-623960795683.asia-southeast1.run.app/session/ask_stream?q=${encodeURIComponent(messageContent)}&sid=${currentSessionId}`,
        {
          method: 'GET',
          headers: {
            'accept': 'application/json',
          },
        }
      );

      if (!response.ok) {
        // If session expired, try creating a new one
        if (response.status === 404 || response.status === 400) {
          currentSessionId = await startNewSession();
          if (currentSessionId) {
            const retryResponse = await fetch(
              `https://philhealth-ai-623960795683.asia-southeast1.run.app/session/ask_stream?q=${encodeURIComponent(messageContent)}&sid=${currentSessionId}`,
              {
                method: 'GET',
                headers: {
                  'accept': 'application/json',
                },
              }
            );
            if (!retryResponse.ok) {
              throw new Error('Failed to get response after retry');
            }
            const retryData = await retryResponse.text();
            
            const assistantMessage: Message = {
              id: (Date.now() + 1).toString(),
              role: 'assistant',
              content: retryData,
              timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            return;
          }
        }
        throw new Error('Failed to get response');
      }

      const data = await response.text();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Backdrop overlay - including navbar and sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Full screen overlay with higher z-index to cover navbar and sidebar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[55]"
              onClick={() => setIsOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Chat Window - Full Right Side */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed top-0 bottom-0 right-0 w-full sm:w-[450px] lg:w-[500px] xl:w-[550px] bg-white dark:bg-gray-900 shadow-2xl border-l border-gray-200 dark:border-gray-700 flex flex-col z-[60] overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#009a3d] to-[#06b04d] p-4 flex items-center justify-center relative">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">PhilHealth AI</h3>
                  <p className="text-white/80 text-xs">Ask me anything</p>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex items-center gap-2">
                {/* Info Icon for Disclaimer */}
                <button
                  onClick={() => setShowDisclaimer(!showDisclaimer)}
                  className="relative text-white hover:text-white/80 hover:bg-white/20 p-2 rounded-full transition-all group"
                  aria-label="AI Assistant Information"
                >
                  <Info className="w-5 h-5 relative z-10" />
                  {/* Glowing blue pulse effect */}
                  <span className="absolute inset-0 rounded-full bg-blue-400/50 blur-md animate-pulse"></span>
                  <span className="absolute inset-0 rounded-full bg-blue-300/30 blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></span>
                </button>
                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:text-white/80 hover:bg-white/20 p-2 rounded-full transition-colors"
                  aria-label="Close AI Assistant"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Collapsible Transparency Disclaimer */}
            <AnimatePresence>
              {showDisclaimer && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800 overflow-hidden"
                >
                  <div className="px-4 py-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
                        <p className="font-semibold mb-1">AI Assistant Disclosure</p>
                        <p className="text-blue-800 dark:text-blue-300">
                          This AI uses PhilHealth public data from 2022-2024 including financial statements, 
                          claims statistics, and facility information. Responses are generated based on available 
                          datasets and may not reflect real-time information. For official guidance, please contact 
                          PhilHealth directly.
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-[#009a3d] to-[#06b04d] text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.role === 'user'
                          ? 'text-white/70'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              
              {/* Suggested Questions */}
              {showSuggestions && messages.length === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium px-1">
                    Suggested questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedQuestions.map((question, index) => (
                      <motion.button
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        onClick={() => handleSendMessage(question)}
                        disabled={isLoading}
                        className="text-xs px-3 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-[#009a3d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {question}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Retrieving information…</span>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about PhilHealth data..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:text-white text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-2 rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Send message"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Widget Button - Fixed position */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-4 sm:right-6 w-14 h-14 bg-gradient-to-r from-[#009a3d] to-[#06b04d] text-white rounded-full shadow-lg hover:shadow-xl transition-all z-50 flex items-center justify-center group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Open chat assistant"
        >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="h-6 w-6" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <span className="text-xl font-bold">AI</span>
            </motion.div>
          )}
        </AnimatePresence>
        </motion.button>
      )}
    </>
  );
}
