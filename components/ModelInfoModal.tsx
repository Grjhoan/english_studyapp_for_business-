import React from 'react';
import { X, Cpu, DollarSign, Check, ShieldCheck } from 'lucide-react';

interface ModelInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelInfoModal: React.FC<ModelInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-[#FFFFFF] border-2 border-black shadow-retro-lg overflow-hidden animate-fadeIn">
        {/* Title bar */}
        <div className="retro-titlebar px-3 py-2 flex items-center justify-between border-b-2 border-black bg-[#E0E0E0]">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-black" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-black">
              AI MODEL SPECIFICATION & RECOMMENDATION
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center border border-black bg-white hover:bg-black hover:text-white text-xs font-bold leading-none retro-btn"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto font-mono">
          {/* Top Recommendation Badge */}
          <div className="p-3 bg-[#F0F0F0] border-2 border-black">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-black uppercase">TOP RECOMMENDATION:</span>
              <span className="bg-[#00FF00] text-black text-[10px] font-bold px-2 py-0.5 border border-black uppercase">
                FREE / CHEAPEST
              </span>
            </div>
            <div className="text-base font-bold text-black">Google Gemini 2.0 Flash / 1.5 Flash</div>
            <p className="text-xs text-[#555555] mt-1">
              Provides a generous <strong>100% Free Tier</strong> (up to 1,500 requests/day at $0.00). In paid tier, it costs only <strong>$0.075 per 1,000,000 tokens</strong>. Produces top-tier nuanced Business English.
            </p>
          </div>

          {/* Alternative */}
          <div className="p-3 bg-[#FFFFFF] border border-[#CCCCCC]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-[#666666] uppercase">ALTERNATIVE:</span>
              <span className="bg-[#EEEEEE] text-[#555555] text-[10px] font-bold px-2 py-0.5 border border-[#CCCCCC] uppercase">
                LOW-COST
              </span>
            </div>
            <div className="text-sm font-bold text-black">OpenAI GPT-4o-mini</div>
            <p className="text-xs text-[#666666] mt-1">
              Costs <strong>$0.15 per 1,000,000 tokens</strong> (~$0.00005 per phrase generation). Fully supported as fallback.
            </p>
          </div>

          {/* Security & Token Privacy */}
          <div className="p-3 bg-[#FAFAFA] border border-black text-xs space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-black">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              SECURITY: ZERO TOKEN EXPOSURE
            </div>
            <p className="text-[#555555]">
              API keys are strictly loaded in backend serverless routes (<code className="bg-[#EAEAEA] px-1">/api/generate</code>). No API key is ever visible in client-side code, network bundles, or browser inspection.
            </p>
          </div>

          {/* Setup instruction */}
          <div className="text-xs text-[#444444] space-y-1">
            <div className="font-bold text-black uppercase">HOW TO CONFIGURE ON VERCEL:</div>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px] text-[#666666]">
              <li>Get a free Gemini API key from <strong>Google AI Studio</strong> (aistudio.google.com).</li>
              <li>Add <code className="bg-[#EAEAEA] px-1 text-black font-bold">GEMINI_API_KEY</code> in your Vercel Project Settings &gt; Environment Variables.</li>
              <li>For local dev, add it to <code className="bg-[#EAEAEA] px-1 text-black">.env.local</code>.</li>
            </ol>
          </div>

          {/* Close button */}
          <div className="pt-2 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#00FF00] hover:bg-[#1AFF1A] text-black font-bold text-xs uppercase border-2 border-black shadow-retro retro-btn min-h-[44px]"
            >
              [ CLOSE SPECIFICATION ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
