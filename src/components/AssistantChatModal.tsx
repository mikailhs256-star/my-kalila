import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Heart, Bot, User, RefreshCw, ChevronDown } from 'lucide-react';
import { ChatMessage, CycleCalculationResult } from '../types';

interface AssistantChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CycleCalculationResult;
  presetQuestion?: string;
  onClearPresetQuestion?: () => void;
}

export const AssistantChatModal: React.FC<AssistantChatModalProps> = ({
  isOpen,
  onClose,
  result,
  presetQuestion,
  onClearPresetQuestion,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content:
        'Halo! Senang bisa menemanimu. Aku adalah asisten kesehatan reproduksi wanita yang siap mendengarkan dan menjawab pertanyaanmu tentang siklus haid, masa subur, ovulasi, hormon, atau cara merawat diri dengan penuh empati.\n\nApa yang sedang kamu rasakan atau ingin kamu tanyakan hari ini?',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickQuestions = [
    'Apa tanda fisik tubuh saat sedang ovulasi?',
    'Kenapa tanggal haid saya bisa maju atau mundur?',
    'Tips alami meredakan kram perut saat haid?',
    'Apa perbedaan gejala PMS dan tanda awal kehamilan?',
    'Nutrisi apa yang cocok untuk fase luteal?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Handle incoming preset question from other components
  useEffect(() => {
    if (presetQuestion && isOpen) {
      handleSendMessage(presetQuestion);
      if (onClearPresetQuestion) {
        onClearPresetQuestion();
      }
    }
  }, [presetQuestion, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const cycleContext = {
        lmpDate: result.input.lastPeriodDate,
        cycleLength: result.input.cycleLength,
        periodLength: result.input.periodDuration,
        currentPhase: result.currentPhaseDetail.name,
        daysUntilPeriod: result.daysUntilNextPeriod,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          cycleContext,
        }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi asisten');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'Terima kasih telah bertanya. Semoga harimu menyenangkan dan tubuhmu tetap sehat!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          'Maaf, terjadi sedikit kendala teknis saat menyusun jawaban. Tapi ketahuilah, tubuhmu luar biasa dan membutuhkan waktu istirahat yang cukup. Jangan ragu bertanya lagi ya!\n\nCatatan Edukatif: Informasi ini bersifat edukatif dan tidak menggantikan konsultasi medis resmi.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-rose-100 flex flex-col h-[90vh] max-h-[720px] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50 via-rose-50/50 to-white border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
              <Heart className="w-5 h-5 fill-white/20" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base sm:text-lg text-stone-900 flex items-center gap-2">
                <span>Asisten Empatik Reproduksi</span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  Online
                </span>
              </h3>
              <p className="text-xs text-stone-500">
                Teman bicara ramah &amp; terpercaya untuk siklus kewanitaanmu
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
            title="Tutup dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-stone-50/40">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs shadow-xs ${
                  msg.role === 'user'
                    ? 'bg-stone-800 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-xs'
                    : 'bg-white text-stone-800 border border-rose-100 rounded-tl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-1.5 flex justify-end ${
                    msg.role === 'user' ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white text-stone-600 border border-rose-100 rounded-2xl rounded-tl-xs px-4 py-3 text-xs flex items-center gap-2 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-stone-400 text-xs ml-1">Mengetik jawaban yang menenangkan...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Question Suggestions */}
        <div className="px-4 py-2 bg-stone-100/70 border-t border-stone-200/60 overflow-x-auto whitespace-nowrap scrollbar-none flex items-center gap-2">
          <span className="text-[11px] text-stone-500 font-medium shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-rose-500" />
            Ide tanya:
          </span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSendMessage(q)}
              disabled={isLoading}
              className="text-xs px-3 py-1 rounded-full bg-white text-stone-700 hover:text-rose-700 hover:border-rose-300 border border-stone-200 transition-all shrink-0 cursor-pointer disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Input Field */}
        <div className="p-3 sm:p-4 bg-white border-t border-stone-200/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ketik pertanyaan atau perasaanmu di sini..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-stone-50 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-400 focus:bg-white text-stone-900 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-medium text-xs sm:text-sm transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Kirim</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-stone-400">
              Catatan: Jawaban bersifat perkiraan edukatif &amp; tidak menggantikan nasihat medis dokter.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
