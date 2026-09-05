import React, { useState } from 'react';
import { Bot, Send, X, Sparkles, User, ShieldAlert, HeartHandshake } from 'lucide-react';
import { Modal } from './Modal';
import { ChatMessage, getAIResponse } from '../../services/aiAssistantService';
import { triggerHapticTap, triggerHapticSuccess } from '../../services/native/hapticsService';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'officer' | 'civilian';
  currentCity?: string;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  mode,
  currentCity = 'Coimbatore',
}) => {
  const isOfficer = mode === 'officer';

  const initialGreeting: ChatMessage = {
    id: 'msg-0',
    sender: 'assistant',
    text: isOfficer
      ? `Vanakkam Officer. I am your **Tamil Nadu Police AI Assistant** for ${currentCity} jurisdiction. How can I assist with hardware sensor verification or NDPS procedures today?`
      : `Hello. I am your **24/7 AI Health & Safety Helpline** in ${currentCity}. Ask me anything about test strips, overdose care, or 108 Emergency assistance. Everything here is 100% confidential.`,
    timestamp: 'Just now'
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialGreeting]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = isOfficer
    ? [
        'How to move positive case to rehab (Sec 64A)?',
        'How does the electrical sensor reading work?',
        'NDPS Section 50 search procedure',
        `Nearest FSD facility in ${currentCity}`,
      ]
    : [
        'Someone is unresponsive (108 Emergency)',
        'How to read test strip (1 vs 2 lines)',
        `De-addiction support in ${currentCity}`,
        'Is this app anonymous?',
      ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    triggerHapticTap();
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Now'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = getAIResponse(text, mode, currentCity);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: reply,
        timestamp: 'Just now'
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
      triggerHapticSuccess();
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isOfficer ? 'TN Police AI Field Assistant' : '24/7 AI Health & Safety Helpline'}
      subtitle={`Local Intelligence & Guidance for ${currentCity}, Tamil Nadu`}
      maxHeight="max-h-[90vh]"
    >
      <div className="flex flex-col h-[65vh]">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-1 pb-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2 ${
                m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                m.sender === 'user'
                  ? 'bg-slate-700 text-white'
                  : isOfficer
                    ? 'bg-cyan-950 text-cyan-400 border border-cyan-700'
                    : 'bg-teal-950 text-teal-400 border border-teal-700'
              }`}>
                {m.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className={`rounded-2xl p-3 text-xs leading-relaxed max-w-[82%] font-sans ${
                m.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none'
                  : 'bg-tactical-950 border border-slate-800 text-slate-200 rounded-bl-none'
              }`}>
                <div className="whitespace-pre-line">
                  {m.text}
                </div>
                <div className={`text-[9px] font-mono mt-1 ${
                  m.sender === 'user' ? 'text-cyan-200' : 'text-slate-500'
                }`}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center space-x-2 text-xs text-slate-400 font-mono italic">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
              <span>AI Assistant is formulating guidance...</span>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="flex space-x-1.5 overflow-x-auto hide-scrollbar py-2 border-t border-slate-800 flex-shrink-0">
          {quickPrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(p)}
              className="text-[10px] font-mono bg-tactical-950 border border-slate-700/80 text-slate-300 hover:text-white hover:border-cyan-500 px-2.5 py-1 rounded-full whitespace-nowrap transition-colors flex-shrink-0"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Chat Input */}
        <div className="pt-2 flex items-center space-x-2 flex-shrink-0">
          <input
            type="text"
            placeholder={isOfficer ? "Ask about hardware readings, NDPS Act..." : "Ask about overdose care, 108, test strips..."}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-tactical-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className={`p-2.5 rounded-xl font-bold transition-transform active:scale-95 ${
              isOfficer 
                ? 'bg-cyan-500 hover:bg-cyan-400 text-tactical-950 disabled:opacity-40' 
                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 disabled:opacity-40'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
