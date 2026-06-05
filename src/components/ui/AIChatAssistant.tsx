"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";

export default function AIChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm Celestine's AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", content: input }]);
    const currentInput = input;
    setInput("");

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: `I'm a demo version of the AI right now! I'd love to chat about "${currentInput}", but my brain isn't fully wired to the backend just yet.` }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-electricBlue rounded-full flex items-center justify-center shadow-lg shadow-electricBlue/20 z-[90] hover:scale-110 transition-transform"
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: isOpen ? 0 : 1 }}
        whileHover={{ scale: 1.1 }}
      >
        <MessageSquare className="w-6 h-6 text-navy" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 h-[500px] rounded-2xl border border-white/10 shadow-2xl z-[95] flex flex-col overflow-hidden"
            style={{ background: "#0f1f3d" }}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center" style={{ background: "#0a1628" }}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-electricBlue/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-electricBlue" />
                </div>
                <div>
                  <h3 className="text-white font-medium text-sm">DexterAI Assistant</h3>
                  <p className="text-xs text-electricBlue">Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-4" style={{ background: "#0f1f3d" }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "self-end flex-row-reverse" : "self-start"}`}
                >
                  <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${msg.role === "user" ? "bg-white/10" : "bg-electricBlue/20"}`}>
                    {msg.role === "user" ? <User className="w-3 h-3 text-white" /> : <Bot className="w-3 h-3 text-electricBlue" />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.role === "user"
                      ? "bg-electricBlue text-navy rounded-tr-sm"
                      : "text-gray-200 rounded-tl-sm"
                  }`}
                  style={msg.role === "assistant" ? { background: "#1a2f52", border: "1px solid rgba(255,255,255,0.08)" } : {}}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex gap-2" style={{ background: "#0a1628" }}>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-grow rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-electricBlue transition-colors border border-white/10"
                style={{ background: "#1a2f52" }}
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="w-10 h-10 bg-electricBlue rounded-lg flex items-center justify-center text-navy disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-cyan-400"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
