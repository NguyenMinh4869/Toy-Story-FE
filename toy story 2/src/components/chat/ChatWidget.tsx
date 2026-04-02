import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2, ShoppingCart, MessageSquare, Gift, Tag, Truck } from 'lucide-react';
import { aiService } from '../../services/aiService';
import { useCart } from '../../context/CartContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Chào bạn! Mình là Toy Story Assistant. Mình có thể giúp bạn tìm kiếm đồ chơi, tư vấn quà tặng hoặc kiểm tra đơn hàng nhanh chóng. Bạn cần mình hỗ trợ gì ạ? 🧸❤️',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart, openCart } = useCart();

  useEffect(() => {
    aiService.onAddToCart = addToCart;
    aiService.onViewCart = openCart;
    return () => {
      aiService.onAddToCart = undefined;
      aiService.onViewCart = undefined;
    };
  }, [addToCart, openCart]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (customText?: string) => {
    const textToSend = customText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customText) setInput('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage(textToSend);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[10000] font-sf">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="mb-4 w-[380px] h-[550px] bg-white rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.15)] border border-red-50 flex flex-col overflow-hidden"
          >
            {/* Simple Red Header */}
            <div className="px-5 py-4 bg-[#ab0007] text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center border border-white/10 shadow-inner">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">Toy Story Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase font-bold opacity-80 tracking-tighter">Đang trực tuyến</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-all opacity-80 hover:opacity-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto px-4 py-5 bg-white space-y-5 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-2.5 rounded-2xl text-[14px] leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#ab0007] text-white rounded-tr-none'
                        : 'bg-gray-100 text-slate-700 rounded-tl-none border border-gray-200'
                    }`}>
                      {msg.content.split(/(!\[.*?\]\(.*?\))/g).map((part, i) => {
                        const imgMatch = part.match(/!\[(.*?)\]\((.*?)\)/);
                        if (imgMatch) {
                          return (
                            <div key={i} className="my-2 rounded-lg overflow-hidden border border-gray-100 shadow-sm bg-white p-1">
                              <img
                                src={imgMatch[2]}
                                alt={imgMatch[1]}
                                className="max-w-full h-auto object-cover rounded-md"
                                onError={(e) => (e.currentTarget.style.display = 'none')}
                              />
                            </div>
                          );
                        }
                        return <span key={i} className="whitespace-pre-wrap">{part}</span>;
                      })}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 font-medium px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border border-gray-200 px-3 py-2 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                    <Loader2 size={12} className="animate-spin text-[#ab0007]" />
                    <span className="text-[11px] text-slate-500 font-medium italic">Trợ lý đang phản hồi...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Practical Quick Actions */}
            <div className="px-4 py-2.5 bg-gray-50 flex gap-2 overflow-x-auto no-scrollbar border-t border-gray-100">
              {[
                { icon: <Gift size={13} />, label: 'Gợi ý quà cho bé 🎁' },
                { icon: <Tag size={13} />, label: 'Đồ chơi giảm giá 🔥' },
                { icon: <Truck size={13} />, label: 'Tra cứu đơn hàng 📦' },
                { icon: <ShoppingCart size={13} />, label: 'Xem giỏ hàng 🛒' }
              ].map((action, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(action.label)}
                  className="flex items-center gap-2 whitespace-nowrap px-3.5 py-1.5 bg-white text-[#ab0007] rounded-full text-[11px] font-bold hover:bg-[#ab0007] hover:text-white transition-all border border-red-100 shadow-sm active:scale-95"
                >
                  {action.icon} {action.label.substring(0, action.label.length - 2)}
                </button>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-100 flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-1 focus:ring-red-200 outline-none transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                className={`p-2.5 rounded-xl transition-all shadow-md ${!input.trim() || isLoading
                    ? 'bg-gray-100 text-gray-400 shadow-none'
                    : 'bg-[#ab0007] text-white hover:bg-red-800'
                  }`}
              >
                <Send size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-[#ab0007] text-white rounded-full flex items-center justify-center shadow-2xl relative border-2 border-white/50 active:scale-90 transition-all"
        aria-label="Toggle chat"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-6 w-6">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-6 w-6 bg-red-600 text-[11px] font-black items-center justify-center border-2 border-white shadow-md">1</span>
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
