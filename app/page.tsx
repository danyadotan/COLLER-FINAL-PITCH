"use client";

import { useState, useEffect, useRef } from "react";
import { Bot, X, Send, Sparkles, Shield, Layers, Cpu, ArrowRight } from "lucide-react";

type ChatState = "hidden" | "pitch_intro" | "chat" | "minimized";
type Message = { role: "user" | "assistant"; content: string };

const INTRO_TEXT = `I worked through the night.\n\nThree things are ready for your confirmation.\n\nI am TAB — the closed, governed layer between employees and the people who manage them. Not a productivity tool. Not a chatbot. Infrastructure.\n\nBelow is the architecture. Or ask me the hard questions.`;

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Three layers. One nervous system. What do you want to understand first — the architecture, the privacy model, or the business case?",
};

export default function Home() {
  const [chatState, setChatState] = useState<ChatState>("hidden");
  const [typedText, setTypedText] = useState("");
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setChatState("pitch_intro"), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (chatState === "pitch_intro") {
      let i = 0;
      setTypedText("");
      const interval = setInterval(() => {
        setTypedText((prev) => prev + INTRO_TEXT.charAt(i));
        i++;
        if (i >= INTRO_TEXT.length) clearInterval(interval);
      }, 22);
      return () => clearInterval(interval);
    }
  }, [chatState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isOpen = chatState === "pitch_intro" || chatState === "chat";

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: inputValue };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!res.ok) throw new Error("API error");

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Unable to connect. The infrastructure is present — the network is not.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans text-slate-900 relative overflow-x-hidden selection:bg-indigo-200">
      <main className="max-w-7xl mx-auto p-8 md:p-16 pb-32">
        <header className="mb-16">
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" aria-hidden="true" /> Coller Startup Competition Pitch
          </h2>
          <h1 className="text-5xl md:text-7xl font-light tracking-tight text-slate-900 mb-6">
            TAB<span className="font-medium text-indigo-600">@Work</span>
          </h1>
          <p className="text-2xl text-slate-500 font-light max-w-2xl leading-relaxed">
            Three layers.<br />
            <span className="italic text-slate-800">One unbroken loop.</span>
          </p>
          <p className="mt-4 text-sm text-slate-500 max-w-xl">
            A multi-agent architecture where every layer has exactly one job, one loyalty, and one language — and none of them overlap.
          </p>
        </header>

        <section className="bg-[#111111] text-slate-300 rounded-[2rem] p-8 md:p-12 shadow-2xl mb-8 border border-slate-800">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-8">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <Shield className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Personal TAB</h3>
              <p className="text-slate-400 text-sm mt-1">One per employee. Unconditional loyalty. Hard domain boundaries.</p>
            </div>
            <div className="ml-auto bg-slate-800 text-xs px-3 py-1 rounded-full text-slate-300 uppercase tracking-wider font-bold">
              Employee Layer
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Core Loyalty", text: "The employee, always, first. Not negotiable. Not configurable by the org. The employee's TAB is theirs — not a company asset." },
              { label: "Domain Boundary", text: "Sees 2-3 steps ahead within the employee's specific framework and tools. Not the org's strategy. Its own lane only." },
              { label: "Resolution Hierarchy", text: "Predict → Self-repair → Escalate → Bypass. Employee workflow never stops. The wall never appears." },
              { label: "Trust Architecture", text: "Encrypted on-device. Keys never leave. The org cannot decrypt what the employee's TAB holds. Not policy — architecture." },
              { label: "What It Sends Up", text: "Anonymous friction signals only. No names, no content. Pattern, not person." },
              { label: "The Relationship", text: "More consistent than a manager. More available than a colleague. No competing agenda. Ever." },
            ].map(({ label, text }) => (
              <div key={label} className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-800/50">
                <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-bold">{label}</h4>
                <p className="text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="flex flex-col md:flex-row gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
          {[
            { icon: <Layers className="w-8 h-8 text-indigo-400 mb-4" aria-hidden="true" />, title: "Team TAB", desc: "Cross-functional context & alignment.", layer: "Layer 2" },
            { icon: <Cpu className="w-8 h-8 text-indigo-400 mb-4" aria-hidden="true" />, title: "Org TAB", desc: "Macro friction analytics & resource routing.", layer: "Layer 3" },
          ].map(({ icon, title, desc, layer }) => (
            <section key={title} className="flex-1 bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200 flex flex-col justify-center items-center text-center min-h-[200px]">
              {icon}
              <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
              <p className="text-slate-500 text-sm">{desc}</p>
              <div className="mt-4 bg-slate-100 text-xs px-3 py-1 rounded-full text-slate-500 uppercase tracking-wider font-bold">{layer}</div>
            </section>
          ))}
        </div>
      </main>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-1000 z-40 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setChatState("minimized")}
      />

      {/* Widget */}
      <div
        className={`fixed z-50 transition-all duration-700 flex flex-col ${
          isOpen
            ? "top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] items-center"
            : "bottom-8 left-8 w-16 items-start"
        }`}
      >
        <div
          onClick={() => chatState === "minimized" && setChatState("chat")}
          className={`bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-500 overflow-hidden ring-4 ring-white/10 ${
            isOpen ? "w-24 h-24 mb-8 shadow-indigo-500/30" : "w-16 h-16 hover:scale-110 hover:shadow-indigo-500/50"
          }`}
        >
          <img
            src="/TAB_Logo.jpg"
            alt="TAB"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <Bot className="text-white w-1/2 h-1/2" />
        </div>

        <div
          className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 w-full relative ${
            isOpen ? "opacity-100 scale-100 max-h-[700px]" : "opacity-0 scale-90 max-h-0"
          }`}
        >
          {/* Intro */}
          {chatState === "pitch_intro" && (
            <div className="p-8 md:p-10">
              <button
                onClick={() => setChatState("minimized")}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-medium text-slate-800">
                {typedText}
              </div>
              <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_5s_forwards]">
                <button
                  onClick={() => setChatState("minimized")}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors w-full sm:w-auto text-center"
                >
                  Explore Architecture
                </button>
                <button
                  onClick={() => setChatState("chat")}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-indigo-500/30"
                >
                  Interview TAB <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Chat */}
          {chatState === "chat" && (
            <div className="flex flex-col h-[500px]">
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" /> Investor Q&amp;A
                  </h3>
                  <p className="text-xs text-slate-500">Ask TAB about the architecture, the privacy model, or the business case.</p>
                </div>
                <button
                  onClick={() => setChatState("minimized")}
                  className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-indigo-600 text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-800 rounded-bl-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-500 p-4 rounded-2xl rounded-bl-sm flex gap-2 items-center">
                      {[0, 0.2, 0.4].map((delay, i) => (
                        <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${delay}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 bg-white">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., How does privacy work at L1?"
                    className="w-full bg-slate-100 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-xl py-3.5 pl-4 pr-12 text-sm outline-none transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim() || isLoading}
                    className="absolute right-2 p-2 bg-indigo-600 text-white rounded-lg disabled:opacity-50 disabled:bg-slate-400 hover:bg-indigo-700 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
