import React, { useEffect, useRef, useState } from 'react';
import { X, Bot, User } from 'lucide-react';
import { askAI } from '../../services/askAI';

const AssistantPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const togglePanel = () => {
    setIsOpen(!isOpen);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user' as const, text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const aiReply = await askAI(userMessage.text);
      setMessages((prev) => [...prev, { role: 'assistant' as const, text: aiReply }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant' as const, text: '⚠ Ошибка при обращении к AI' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <>
      {!isOpen && (
        <div className="fixed bottom-20 right-6 z-[9998] flex items-center gap-2 group">
          <div className="opacity-0 group-hover:opacity-100 transition bg-zinc-800 text-white text-xs px-3 py-1 rounded shadow-lg mr-2">
            Попробуй AI-ассистента!
          </div>
          <button
            onClick={togglePanel}
            className="flex items-center gap-2 animate-pulse bg-gradient-to-br from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition"
          >
            <Bot className="w-5 h-5" />
            <span className="text-sm font-semibold">AI</span>
          </button>
        </div>
      )}

      {/* Панель ассистента */}
      <div
        className={`fixed right-0 top-0 h-full w-[360px] bg-zinc-900 text-white shadow-xl z-[9999] flex flex-col border-l border-white/10 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold">AI Ассистент</h2>
          <button onClick={togglePanel}>
            <X className="text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.length === 0 && (
            <p className="text-gray-400 text-sm text-center mt-10">
              Задай вопрос, чтобы начать ✨
            </p>
          )}
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="flex items-start gap-2 max-w-[80%]">
                {msg.role === 'assistant' && (
                  <div className="mt-1">
                    <Bot className="w-5 h-5 text-purple-400" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-xl text-sm break-words ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-gray-200'
                  }`}
                >
                  {msg.text}
                </div>
                {msg.role === 'user' && (
                  <div className="mt-1">
                    <User className="w-5 h-5 text-blue-300" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && <div className="text-sm text-gray-400">AI думает...</div>}
          <div ref={bottomRef}></div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10 flex gap-2 bg-zinc-900">
          <input
            ref={inputRef}
            className="flex-1 rounded-xl px-4 py-2 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            placeholder="Спроси что-нибудь..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl transition disabled:opacity-50"
          >
            ➤
          </button>
        </div>
      </div>
    </>
  );
};

export default AssistantPanel;
