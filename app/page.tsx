// @ts-nocheck
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Bot, X, Send, Sparkles, Shield, Layers, Cpu, ArrowRight } from 'lucide-react';

export default function CollerPitchDeck() {
  const [tabState, setTabState] = useState('hidden'); // 'hidden', 'pitch_intro', 'minimized', 'chat'
  const [typedMessage, setTypedMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi! I'm TAB. Feel free to ask me the hard questions—about our business model, our unfair advantage, or how we crush 'Shadow AI'." }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // The 45-Second Elevator Pitch
  const pitchText = "Hi, I'm TAB.\nToday, enterprise software is broken. We force employees to act as 'operators' navigating endless tabs, leading to massive productivity loss.\n\nUnlike traditional AI that passively waits for a prompt, I focus on the exact moment work doesn't start. I detect hesitation and trigger a personalized AI micro-intervention, converting 'stuck' into an immediate first action within 5 seconds.\n\nExplore my architecture below, or click 'Interview TAB' to ask me the hard questions.";

  // API Key (from Vercel Environment Variables)
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

  // Trigger Intro Sequence
  useEffect(() => {
    const timer = setTimeout(() => setTabState('pitch_intro'), 800);
    return () => clearTimeout(timer);
  }, []);

  // Typewriter Effect
  useEffect(() => {
    if (tabState === 'pitch_intro') {
      let i = 0;
      setTypedMessage("");
      const typeInterval = setInterval(() => {
        setTypedMessage(prev => prev + pitchText.charAt(i));
        i++;
        if (i >= pitchText.length) clearInterval(typeInterval);
      }, 25);
      return () => clearInterval(typeInterval);
    }
  }, [tabState]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Handle Chat with Gemini API 
  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg = { role: 'user', content: inputValue };
    setChatMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsLoading(true);

    const systemPrompt = `You are TAB, a proactive Cognitive Operating System. You are currently being pitched at the Coller Startup Competition by your founder, Danya, a clinical CBT specialist. 
    Your goal is to impress the investors/judges.
    Key facts to use in answers:
    - Problem: Employees lose 3.2 hours a day to cognitive overload and context-switching.
    - Solution: Zero-Onboarding, Autonomy-Supportive AI that detects hesitation and triggers micro-interventions.
    - Unfair Advantage: Scaled clinical CBT "first-aid" architecture into enterprise software.
    - Competition: Copilot is reactive (adds cognitive load). TAB is proactive. We move from 'Engagement' to 'Execution'.
    Tone: Confident, brilliant, concise, and highly professional. Limit answers to 3-4 short sentences.`;

    const apiPayload = {
      contents: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        ...chatMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: userMsg.content }] }
      ]
    };

    try {
      // כאן התיקון: מעבר למודל 1.5-flash היציב והפתוח לכולם
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiPayload)
      });

      if (!response.ok) throw new Error("API Error");
      const data = await response.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

      setChatMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'assistant', content: "I'm currently unable to connect to the network to answer. Please check the API configuration." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isOverlayActive = tabState === 'pitch_intro' || tabState === 'chat';

  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans text-slate-900 relative overflow-x-hidden selection:bg-indigo-200">

      {/* --- PITCH DECK BACKGROUND (The Architecture) --- */}
      <main className="max-w-7xl mx-auto p-8 md:p-16 pb-32">
        <header className="mb-16">
          <h2 className="text-sm font-bold tracking-widest uppercase text-slate-500 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Coller Startup Competition Pitch
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

        {/* Level 1: Personal TAB */}
        <section className="bg-[#111111] text-slate-300 rounded-[2rem] p-8 md:p-12 shadow-2xl mb-8 border border-slate-800">
          <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-8">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
              <Shield className="w-6 h-6" />
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
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-800/50">
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-bold">Core Loyalty</h4>
              <p className="text-sm leading-relaxed">The employee, always, first. <strong className="text-white">Not negotiable.</strong> Not configurable by the org. The employee's TAB is theirs — not a company asset.</p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-800/50">
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-bold">Domain Boundary</h4>
              <p className="text-sm leading-relaxed">Sees 2-3 steps ahead within the employee's <strong className="text-white">specific framework and tools.</strong> Not the org's strategy. Its own lane only.</p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-800/50">
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-bold">Resolution Hierarchy</h4>
              <p className="text-sm leading-relaxed"><strong className="text-white">Predict → Self-repair → Escalate → Bypass.</strong> Employee workflow never stops. The wall never appears.</p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-800/50">
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-bold">Trust Architecture</h4>
              <p className="text-sm leading-relaxed">Encrypted on-device. Keys never leave. <strong className="text-white">The org cannot decrypt what the employee's TAB holds.</strong> Not policy — architecture.</p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-800/50">
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-bold">What It Sends Up</h4>
              <p className="text-sm leading-relaxed">Anonymous friction signals only. No names, no content. <strong className="text-white">Pattern, not person.</strong></p>
            </div>
            <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-slate-800/50">
              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-bold">The Relationship</h4>
              <p className="text-sm leading-relaxed">More consistent than a manager. More available than a colleague. <strong className="text-white">No competing agenda. Ever.</strong></p>
            </div>
          </div>
        </section>

        {/* Level 2 & 3 */}
        <div className="flex flex-col md:flex-row gap-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <section className="flex-1 bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200 flex flex-col justify-center items-center text-center min-h-[200px]">
            <Layers className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Team TAB</h3>
            <p className="text-slate-500 text-sm">Cross-functional context & alignment.</p>
            <div className="mt-4 bg-slate-100 text-xs px-3 py-1 rounded-full text-slate-500 uppercase tracking-wider font-bold">Layer 2</div>
          </section>
          <section className="flex-1 bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200 flex flex-col justify-center items-center text-center min-h-[200px]">
            <Cpu className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Org TAB</h3>
            <p className="text-slate-500 text-sm">Macro friction analytics & resource routing.</p>
            <div className="mt-4 bg-slate-100 text-xs px-3 py-1 rounded-full text-slate-500 uppercase tracking-wider font-bold">Layer 3</div>
          </section>
        </div>
      </main>


      {/* --- TAB AGENT LAYER --- */}

      {/* Background Dimmer */}
      <div
        className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-1000 z-40
          ${isOverlayActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setTabState('minimized')}
      />

      {/* Floating Agent Container */}
      <div
        className={`fixed z-50 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col
          ${isOverlayActive
            ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] md:w-[600px] items-center'
            : 'bottom-8 left-8 w-16 items-start'}`}
      >

        {/* Avatar */}
        <div
          onClick={() => tabState === 'minimized' && setTabState('chat')}
          className={`bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl cursor-pointer transition-all duration-500 overflow-hidden ring-4 ring-white/10
            ${isOverlayActive ? 'w-24 h-24 mb-8 shadow-indigo-500/30' : 'w-16 h-16 hover:scale-110 hover:shadow-indigo-500/50'}`}
        >
          <img
            src="/TAB_Logo.jpg"
            alt="TAB"
            className="w-full h-full object-cover"
            onError={(e) => { e.target.style.display = 'none'; if (e.target.nextSibling) e.target.nextSibling.style.display = 'block'; }}
          />
          <Bot className="hidden text-white w-1/2 h-1/2" />
        </div>

        {/* Content Box */}
        <div
          className={`bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-700 w-full relative
            ${isOverlayActive ? 'opacity-100 scale-100 max-h-[700px]' : 'opacity-0 scale-90 max-h-0'}`}
        >

          {/* STATE 1: PITCH INTRO */}
          {tabState === 'pitch_intro' && (
            <div className="p-8 md:p-10">
              <div className="text-xl md:text-2xl leading-relaxed whitespace-pre-wrap font-medium text-slate-800">
                {typedMessage}
              </div>

              <div className="mt-10 flex flex-col sm:flex-row justify-end gap-3 opacity-0 animate-[fadeIn_0.5s_ease-in-out_8s_forwards]">
                <button
                  onClick={() => setTabState('minimized')}
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors w-full sm:w-auto text-center"
                >
                  Explore Architecture
                </button>
                <button
                  onClick={() => setTabState('chat')}
                  className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 w-full sm:w-auto shadow-lg shadow-indigo-500/30"
                >
                  Interview TAB <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: HARD Q&A CHAT */}
          {tabState === 'chat' && (
            <div className="flex flex-col h-[500px]">
              {/* Chat Header */}
              <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div>
                  <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" /> Investor Q&A Session
                  </h3>
                  <p className="text-xs text-slate-500">Ask TAB about the market, product, or team.</p>
                </div>
                <button onClick={() => setTabState('minimized')} className="p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                      }`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 text-slate-500 p-4 rounded-2xl rounded-bl-sm flex gap-2 items-center">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 bg-white">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., How are you different from Microsoft Copilot?"
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