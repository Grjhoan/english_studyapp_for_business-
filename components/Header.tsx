import React from 'react';
import { Terminal, Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  phraseCount: number;
  onOpenModelInfo: () => void;
}

export const Header: React.FC<HeaderProps> = ({ phraseCount, onOpenModelInfo }) => {
  return (
    <header className="mb-6 border-b-2 border-black pb-4">
      {/* Top micro bar */}
      <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-[#666666] mb-2 uppercase tracking-wider gap-2">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#00FF00] inline-block border border-black animate-pulse"></span>
          STATUS: ONLINE // VER. 1.0
        </span>
        <button
          onClick={onOpenModelInfo}
          className="hover:text-black underline flex items-center gap-1 text-[11px] font-mono cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5 text-black" />
          AI MODEL: GEMINI FLASH (FREE / LOW-COST)
        </button>
      </div>

      {/* Main retro title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <div className="inline-block bg-[#00FF00] text-black font-mono font-bold text-[10px] sm:text-xs px-2 py-0.5 border border-black shadow-retro-sm mb-1 uppercase tracking-widest">
            PROJECT MANAGER VOCABULARY ENGINE
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-black flex items-center gap-2">
            <Terminal className="w-6 h-6 sm:w-8 sm:h-8 inline text-black" />
            PM ENGLISH LAB
          </h1>
          <p className="text-xs sm:text-sm font-mono text-[#555555] mt-1 max-w-xl">
            Input any phrase (e.g. <span className="text-black font-bold">&ldquo;Catch me up&rdquo;</span>) to generate 3 tailored business sentences for Client Syncs, Team Standups, and Executive Updates.
          </p>
        </div>

        {/* Counter chip */}
        <div className="flex items-center gap-2 self-start sm:self-end">
          <div className="border-2 border-black bg-[#FFFFFF] px-3 py-1.5 shadow-retro text-xs font-mono font-bold">
            PHRASES: <span className="bg-[#00FF00] px-1.5 py-0.5 border border-black">{phraseCount}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
