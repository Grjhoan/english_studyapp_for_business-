import React, { useState } from 'react';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface PhraseInputProps {
  onGenerate: (phrase: string) => Promise<void>;
  isLoading: boolean;
}

const QUICK_SUGGESTIONS = [
  'Catch me up',
  'Touch base',
  'Circle back',
  'Push back',
  'Bandwidth',
  'Hard stop',
  'Scope creep',
  'Low-hanging fruit',
];

export const PhraseInput: React.FC<PhraseInputProps> = ({ onGenerate, isLoading }) => {
  const [inputPhrase, setInputPhrase] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPhrase.trim() || isLoading) return;
    await onGenerate(inputPhrase.trim());
    setInputPhrase('');
  };

  const handleSelectQuick = (suggestion: string) => {
    setInputPhrase(suggestion);
  };

  return (
    <div className="w-full bg-[#FFFFFF] border-2 border-black shadow-retro-md mb-8">
      {/* Titlebar matching styleguide card style */}
      <div className="retro-titlebar px-3 py-2 flex items-center justify-between border-b-2 border-black bg-[#E8E8E8]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-black inline-block"></span>
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
            INPUT // NEW BUSINESS VOCABULARY
          </span>
        </div>
        <span className="font-mono text-[10px] text-[#666666] uppercase hidden sm:inline">
          MODEL: GEMINI-FLASH
        </span>
      </div>

      <div className="p-4 sm:p-5">
        <form onSubmit={handleSubmit}>
          <label className="block font-mono text-xs font-bold text-black uppercase mb-2">
            1. ENTER WORD OR PHRASE TO LEARN:
          </label>

          {/* Quick chips bar */}
          <div className="mb-3 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-mono text-[#666666]">Try:</span>
            {QUICK_SUGGESTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleSelectQuick(item)}
                className="text-[11px] font-mono px-2 py-0.5 border border-[#CCCCCC] bg-[#F9F9F9] hover:bg-[#00FF00] hover:text-black hover:border-black transition-colors rounded-sm cursor-pointer"
              >
                + {item}
              </button>
            ))}
          </div>

          {/* Input styled like the styleguide [ Search invoices... ] */}
          <div className="relative mb-4">
            <div className="flex items-center border-2 border-black bg-[#FAFAFA] focus-within:border-black focus-within:ring-2 focus-within:ring-[#00FF00] shadow-retro-sm">
              <span className="pl-3 font-mono font-bold text-black select-none">[</span>
              <input
                type="text"
                value={inputPhrase}
                onChange={(e) => setInputPhrase(e.target.value)}
                placeholder="Type or paste phrase here (e.g. Catch me up)..."
                disabled={isLoading}
                className="w-full px-2 py-3 bg-transparent text-sm sm:text-base font-mono text-black placeholder:text-[#888888] focus:outline-none"
                autoComplete="off"
              />
              <span className="pr-3 font-mono font-bold text-black select-none">]</span>
            </div>
          </div>

          {/* Action button in Neon Green */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <p className="text-[11px] font-mono text-[#666666]">
              Generates 3 contextual sentences (Client, Standup, Executive)
            </p>

            <button
              type="submit"
              disabled={isLoading || !inputPhrase.trim()}
              className={`
                px-5 py-3 font-mono font-bold text-xs sm:text-sm uppercase tracking-wider
                border-2 border-black shadow-retro flex items-center justify-center gap-2 retro-btn min-h-[44px]
                ${
                  isLoading || !inputPhrase.trim()
                    ? 'bg-[#DCDCDC] text-[#888888] border-[#999999] cursor-not-allowed shadow-none'
                    : 'bg-[#00FF00] text-black hover:bg-[#1AFF1A] cursor-pointer'
                }
              `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  [ GENERATING SENTENCES... ]
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  [ GENERATE 3 EXAMPLES ]
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
