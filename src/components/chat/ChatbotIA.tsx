"use client";

import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "@/actions/chat-actions";
import { MessageCircle, X, Send, Bot, AlertCircle } from "lucide-react";
import Link from "next/link"; // <-- Importante

type Message = {
  role: "user" | "model";
  text: string;
};

export function ChatbotIA() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false); 
  const [needsAccount, setNeedsAccount] = useState(false); // <-- NUEVO: Para saber si es visitante bloqueado
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", text: "¡Hola! Soy el asistente experto de Mascotiq. ¿En qué puedo ayudarte hoy con la nutrición de tu peludo?" }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isLocked) return;

    const userText = input.trim();
    setInput("");
    
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setIsLoading(true);

    const historyForGemini = messages.slice(1).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const response = await sendChatMessage(historyForGemini, userText);

    if (response.success && response.text) {
      setMessages(prev => [...prev, { role: "model", text: response.text }]);
    } else {
      setMessages(prev => [...prev, { role: "model", text: response.error || "Ocurrió un error." }]);
      
      // NUEVO: Verificamos exactamente qué tipo de bloqueo es
      if (response.error?.includes("Crea tu cuenta gratis")) {
        setIsLocked(true);
        setNeedsAccount(true);
      } else if (response.error?.includes("Límite")) {
        setIsLocked(true); 
      }
    }
    setIsLoading(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={`fixed bottom-6 right-6 p-4 bg-slate-900 text-white rounded-full shadow-2xl hover:bg-slate-800 transition-all hover:scale-105 z-40 ${isOpen ? 'hidden' : 'flex'}`}>
        <MessageCircle className="w-7 h-7" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[350px] sm:w-[400px] h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-slate-100 animate-in slide-in-from-bottom-10 duration-300 overflow-hidden">
          <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-500/20 p-2 rounded-full"><Bot className="w-5 h-5 text-emerald-400" /></div>
              <div>
                <h3 className="font-bold text-sm">Asistente Mascotiq</h3>
                <p className="text-xs text-slate-400">Nutrición & Bienestar (IA)</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-sm ${msg.role === "user" ? "bg-emerald-600 text-white rounded-br-sm" : "bg-white text-slate-800 border border-slate-200 rounded-bl-sm"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm p-3 shadow-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-75"></div>
                  <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* NUEVO: Interfaz de bloqueo adaptada al Visitante */}
          {isLocked && (
            <div className="bg-amber-50 p-4 text-sm text-amber-800 text-center flex flex-col items-center justify-center gap-2 border-t border-amber-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span className="font-bold">Límite de consultas alcanzado</span>
              </div>
              {needsAccount ? (
                <>
                  <p className="text-amber-700 text-xs">Crea tu cuenta gratis para seguir chateando y obtener tu diagnóstico.</p>
                  <Link href="/sign-up" className="mt-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors">
                    Crear cuenta gratis
                  </Link>
                </>
              ) : (
                <p className="text-amber-700 text-xs">Vuelve mañana o actualiza tu plan para más consultas.</p>
              )}
            </div>
          )}

          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLocked ? "Chat bloqueado..." : "Pregúntame sobre nutrición..."}
              disabled={isLoading || isLocked}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors disabled:opacity-50"
            />
            <button type="submit" disabled={!input.trim() || isLoading || isLocked} className="bg-emerald-600 text-white p-2 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md">
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}