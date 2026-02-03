import React, { useState } from 'react';
import { CalculatorDef, CalculatorResult, ChartConfig } from '../types';
import { Charts } from './Charts';
import { Button } from './ui/Button';
import { Sparkles, Share2, Download, Copy, TrendingUp, DollarSign, Activity, X, Info } from 'lucide-react';
import { getAIExplanation } from '../services/geminiService';

interface ResultsViewProps {
  calculator: CalculatorDef;
  inputs: Record<string, any>;
  results: CalculatorResult[];
  chartConfig: ChartConfig | null;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ calculator, inputs, results, chartConfig }) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  const handleAIExplain = async () => {
    setIsLoadingAI(true);
    const outputs = results.reduce((acc, r) => ({ ...acc, [r.label]: `${r.value} ${r.unit || ''}` }), {});
    const explanation = await getAIExplanation(calculator.name, inputs, outputs);
    setAiExplanation(explanation);
    setIsLoadingAI(false);
  };

  const formatValue = (res: CalculatorResult) => {
    if (res.type === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(res.value));
    }
    if (res.type === 'percent') {
      return `${Number(res.value).toFixed(2)}%`;
    }
    return res.value;
  };

  return (
    <div className="flex flex-col space-y-8 h-full">
      <div className="grid grid-cols-1 gap-4">
        {results.map((res) => (
          <div 
            key={res.id} 
            className={`
              p-5 rounded-xl transition-all
              ${res.highlight 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'}
            `}
          >
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${res.highlight ? 'text-indigo-100' : 'text-slate-400'}`}>
              {res.label}
            </div>
            
            <div className={`text-2xl font-bold tracking-tight leading-none ${res.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
              {formatValue(res)}
              {res.unit && res.type !== 'currency' && res.type !== 'percent' && (
                <span className={`text-xs ml-1 font-medium ${res.highlight ? 'text-indigo-200' : 'text-slate-400'}`}>{res.unit}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {chartConfig && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-xl">
           <Charts config={chartConfig} />
        </div>
      )}

      <div className="mt-auto space-y-4">
        {!aiExplanation ? (
           <button 
            className="w-full flex items-center justify-center space-x-2 py-3 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-100 dark:hover:bg-indigo-950/40 transition-all disabled:opacity-50" 
            onClick={handleAIExplain}
            disabled={isLoadingAI}
          >
            {isLoadingAI ? (
               <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Sparkles size={14} />
            )}
            <span>{isLoadingAI ? 'Analyzing...' : 'AI Insights'}</span>
          </button>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-indigo-500/30 rounded-xl p-5 relative animate-fade-in shadow-xl shadow-indigo-500/5">
             <div className="flex items-center space-x-2 mb-3 text-indigo-500">
               <Info size={14} />
               <span className="text-[10px] font-bold uppercase tracking-widest">AI Summary</span>
             </div>
             <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{aiExplanation}</p>
             <button onClick={() => setAiExplanation(null)} className="absolute top-4 right-4 text-slate-300 hover:text-slate-500 transition-colors">
                <X size={14} />
             </button>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-900">
           <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-widest flex items-center">
             <Share2 size={12} className="mr-1.5" /> Share
           </button>
           <button className="text-[10px] font-bold text-slate-400 hover:text-indigo-500 uppercase tracking-widest flex items-center">
             <Download size={12} className="mr-1.5" /> Export
           </button>
        </div>
      </div>
    </div>
  );
};