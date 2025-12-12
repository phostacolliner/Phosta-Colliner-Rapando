import React, { useState } from 'react';
import { getFinancialInsights } from '../services/geminiService';
import { Transaction } from '../types';
import { Sparkles, Send, Loader2, MessageSquare } from 'lucide-react';

interface AIAssistantProps {
  transactions: Transaction[];
}

const AIAssistant: React.FC<AIAssistantProps> = ({ transactions }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    const result = await getFinancialInsights(transactions, query);
    setResponse(result);
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all z-50 flex items-center gap-2"
      >
        <Sparkles size={24} />
        <span className="font-semibold">Ask AI</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <Sparkles size={20} />
          <h3 className="font-semibold">Business AI Analyst</h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="hover:bg-white/20 p-1 rounded-full transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-grow p-4 min-h-[300px] max-h-[500px] overflow-y-auto bg-slate-50">
        {!response && !loading && (
          <div className="text-center text-slate-500 mt-10 space-y-4">
            <div className="bg-white p-4 rounded-xl inline-block shadow-sm">
              <MessageSquare className="w-8 h-8 mx-auto mb-2 text-indigo-400" />
              <p className="text-sm">Ask me about your data!</p>
            </div>
            <div className="text-xs space-y-2">
              <p className="cursor-pointer hover:text-blue-600" onClick={() => setQuery("Which branch performs best?")}>"Which branch performs best?"</p>
              <p className="cursor-pointer hover:text-blue-600" onClick={() => setQuery("What is the payment mode trend?")}>"What is the payment mode trend?"</p>
              <p className="cursor-pointer hover:text-blue-600" onClick={() => setQuery("Summarize sales for this week")}>"Summarize sales for this week"</p>
            </div>
          </div>
        )}
        
        {loading && (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-2">
            <Loader2 className="animate-spin" size={32} />
            <p className="text-sm animate-pulse">Analyzing data...</p>
          </div>
        )}

        {response && (
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 text-sm text-slate-800 leading-relaxed whitespace-pre-line">
            <p className="font-semibold text-xs text-indigo-600 mb-2 uppercase tracking-wider">Analysis Result</p>
            {response}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form onSubmit={handleAsk} className="flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..." 
            className="flex-grow px-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <button 
            type="submit" 
            disabled={loading || !query.trim()}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;