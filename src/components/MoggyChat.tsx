import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, ShoppingBag } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { products, sugarFreeProducts, type Product } from '@/data/products';
import { getAIResponse, type ChatMessage } from '@/lib/moggyAI';

const allProducts = [...products, ...sugarFreeProducts];

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  text: "Hi there! I'm Moggy AI, your personal chocolate assistant. I can help you find the perfect chocolate, recommend gifts, answer flavor questions, or add items to your cart. What are you craving today?",
};

const QUICK_PROMPTS = [
  'Best sellers',
  'Sugar-free options',
  'Gift recommendations',
  'Add Rosy Moggy',
  'What is Moggy Chocolate?',
  'Recommend something creamy',
  'I love coffee flavor',
  'Are sugar-free chocolates healthy?',
  'Is it gluten-free?',
  'I have a nut allergy',
  'Recommend a Valentine\'s gift',
  'How much is Rosy Moggy?',
  'What\'s in my cart?',
  'Do you deliver nationwide?',
  'Surprise me with something new',
  'Which chocolate pairs well with coffee?',
];

let msgCounter = 0;
const nextId = () => `msg-${++msgCounter}`;

export default function MoggyChat() {
  const { cart, addToCart, openCart } = useShop();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      const userMsg: ChatMessage = { id: nextId(), role: 'user', text: trimmed };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);

      const response = getAIResponse(trimmed, {
        cart,
        addToCart,
        openCart,
        setSearchOpen: () => {},
      });

      const delay = 500 + Math.random() * 600;
      setTimeout(() => {
        const botMsg: ChatMessage = {
          id: nextId(),
          role: 'bot',
          text: response.text,
          productRefs: response.productRefs,
        };
        setMessages((prev) => [...prev, botMsg]);
        setIsTyping(false);
      }, delay);
    },
    [cart, addToCart, openCart],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const getProduct = (id: string): Product | undefined =>
    allProducts.find((p) => p.id === id);

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            aria-label="Chat with Moggy AI"
            className="fixed bottom-6 right-6 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-choco-800 text-cream-100 shadow-choco transition-transform hover:scale-110"
          >
            <span className="absolute inset-0 animate-pulse-gold rounded-full" />
            <MessageCircle className="relative h-6 w-6" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-400 text-[9px] font-bold text-choco-900">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="fixed bottom-0 right-0 z-[80] flex h-[600px] max-h-[85vh] w-full flex-col rounded-t-3xl bg-cream-100 shadow-choco sm:bottom-6 sm:right-6 sm:h-[560px] sm:max-h-[85vh] sm:w-[400px] sm:rounded-3xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-3xl bg-choco-800 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gold-400 text-choco-900">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-cream-100">Moggy AI</h3>
                  <p className="text-xs text-cream-100/60">Your chocolate assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex h-8 w-8 items-center justify-center rounded-full text-cream-100/70 transition-colors hover:bg-choco-700 hover:text-cream-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              {messages.map((msg) => (
                <div key={msg.id}>
                  <div
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'rounded-br-sm bg-choco-800 text-cream-100'
                          : 'rounded-bl-sm bg-white text-choco-800 shadow-soft'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>

                  {/* Product cards */}
                  {msg.productRefs && msg.productRefs.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {msg.productRefs.slice(0, 4).map((pid) => {
                        const product = getProduct(pid);
                        if (!product) return null;
                        return (
                          <button
                            key={pid}
                            onClick={() => {
                              addToCart(product);
                            }}
                            className="group flex items-center gap-2 rounded-xl border border-choco-200 bg-white px-3 py-2 text-left transition-all hover:border-gold-400 hover:shadow-soft"
                          >
                            <div className={`h-9 w-9 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br ${product.wrapper}`}>
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-full w-full object-cover opacity-90 mix-blend-multiply"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-bold text-choco-800">{product.name}</p>
                              <p className="text-xs text-gold-600">${product.price.toFixed(2)}</p>
                            </div>
                            <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-choco-100 text-choco-600 transition-colors group-hover:bg-gold-400 group-hover:text-choco-900">
                              <ShoppingBag className="h-3 w-3" />
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-soft">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          className="h-2 w-2 rounded-full bg-choco-400"
                          animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick prompts */}
            {messages.length <= 2 && (
              <div className="flex flex-wrap gap-2 px-4 pb-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-full border border-choco-200 bg-white px-3 py-1.5 text-xs font-medium text-choco-700 transition-all hover:border-gold-400 hover:bg-gold-50 hover:text-choco-800"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-choco-200 bg-white px-4 py-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me about chocolates..."
                className="flex-1 rounded-full border border-choco-200 bg-cream-50 px-4 py-2.5 text-sm text-choco-800 placeholder-choco-400 outline-none transition-colors focus:border-gold-400"
              />
              <button
                onClick={() => handleSend(input)}
                disabled={!input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-choco-800 text-cream-100 transition-colors hover:bg-choco-700 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
