'use strict';
import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, ChevronDown, ChevronUp, Trash2, Users, Briefcase, BarChart3 } from 'lucide-react';
import { PhraseItem, SentenceContext } from '@/lib/types';

interface PhraseCardProps {
  item: PhraseItem;
  index: number;
  onDelete: (id: string) => Promise<void>;
}

export const PhraseCard: React.FC<PhraseCardProps> = ({ item, index, onDelete }) => {
  // HIDDEN by default as requested: "hide the sentences examples, I SHOULD ONLY open with something like accordions"
  const [isOpen, setIsOpen] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Audio Speech Synthesis function (Web Speech API)
  const handleSpeak = (sentenceId: string, text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (speakingId === sentenceId) {
      window.speechSynthesis.cancel();
      setSpeakingId(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any currently speaking audio
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.95; // Slightly measured pace for learning / PM clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => setSpeakingId(sentenceId);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

  const handleCopy = async (sentenceId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(sentenceId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
      setCopiedId(null);
    }
  };

  const handleDelete = async () => {
    if (confirm(`Remove "${item.phrase}" from your vocabulary vault?`)) {
      setIsDeleting(true);
      await onDelete(item.id);
      setIsDeleting(false);
    }
  };

  const getContextIcon = (context: SentenceContext) => {
    switch (context) {
      case 'Client / Customer Sync':
        return <Briefcase className="w-3.5 h-3.5 text-black" />;
      case 'Internal Team Standup':
        return <Users className="w-3.5 h-3.5 text-black" />;
      case 'Stakeholder / Executive Update':
        return <BarChart3 className="w-3.5 h-3.5 text-black" />;
      default:
        return <Briefcase className="w-3.5 h-3.5 text-black" />;
    }
  };

  return (
    <article className="w-full bg-[#FFFFFF] border-2 border-black shadow-retro-md mb-5 overflow-hidden transition-all">
      {/* Title bar with retro grey style */}
      <div className="retro-titlebar px-3 py-2 flex items-center justify-between border-b-2 border-black bg-[#E8E8E8]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2.5 h-2.5 bg-[#00FF00] border border-black inline-block flex-shrink-0"></span>
          <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-black truncate">
            PHRASE #{String(index + 1).padStart(2, '0')}: &ldquo;{item.phrase}&rdquo;
          </h2>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-mono text-[#666666] hidden md:inline">
            {new Date(item.createdAt).toLocaleDateString()}
          </span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1 text-[#666666] hover:text-red-600 hover:bg-white border border-transparent hover:border-black transition-colors"
            title="Delete phrase"
            aria-label="Delete phrase"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        {/* Definition & PM Context */}
        <div className="mb-4">
          <div className="text-xs font-mono text-[#777777] uppercase mb-1">
            BUSINESS DEFINITION:
          </div>
          <p className="text-sm sm:text-base font-mono text-[#222222] font-semibold leading-relaxed">
            {item.meaning}
          </p>
          {item.businessTip && (
            <div className="mt-2.5 p-2 bg-[#F5F5F5] border-l-2 border-[#00FF00] text-xs font-mono text-[#555555]">
              <span className="font-bold text-black">💡 PM TIP:</span> {item.businessTip}
            </div>
          )}
        </div>

        {/* ACCORDION TOGGLE BUTTON (Strictly hides examples until clicked) */}
        <div className="pt-2 border-t border-[#E0E0E0]">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            className={`
              w-full py-2.5 px-3 font-mono text-xs sm:text-sm font-bold uppercase tracking-wider
              border-2 border-black flex items-center justify-between retro-btn min-h-[44px]
              ${
                isOpen
                  ? 'bg-[#00FF00] text-black shadow-retro-sm'
                  : 'bg-[#F0F0F0] text-black hover:bg-[#E8E8E8] shadow-retro-sm'
              }
            `}
          >
            <span className="flex items-center gap-2">
              {isOpen ? (
                <>
                  <ChevronUp className="w-4 h-4 text-black" />
                  [ HIDE 3 BUSINESS EXAMPLES ]
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 text-black" />
                  [ OPEN 3 BUSINESS EXAMPLES ]
                </>
              )}
            </span>
            <span className="text-[10px] font-mono opacity-70">
              {isOpen ? 'COLLAPSE ▲' : 'EXPAND ▼'}
            </span>
          </button>
        </div>

        {/* ACCORDION CONTENT (HIDDEN BY DEFAULT) */}
        {isOpen && (
          <div className="mt-4 space-y-4 pt-2 animate-fadeIn">
            {item.examples.map((ex, exIdx) => (
              <div
                key={ex.id || exIdx}
                className="bg-[#FAFAFA] border-2 border-black p-3.5 shadow-retro-sm"
              >
                {/* Context badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#CCCCCC]">
                  <span className="inline-flex items-center gap-1.5 bg-[#FFFFFF] px-2 py-0.5 border border-black text-[11px] font-mono font-bold text-black uppercase">
                    {getContextIcon(ex.context)}
                    {ex.context}
                  </span>

                  {/* Audio and Copy actions */}
                  <div className="flex items-center gap-1.5">
                    {/* Speech / Pronunciation button */}
                    <button
                      type="button"
                      onClick={() => handleSpeak(ex.id, ex.sentence)}
                      className={`
                        px-2 py-1 text-[11px] font-mono font-bold border border-black flex items-center gap-1 retro-btn
                        ${
                          speakingId === ex.id
                            ? 'bg-[#00FF00] text-black ring-1 ring-black'
                            : 'bg-[#FFFFFF] text-black hover:bg-[#F0F0F0]'
                        }
                      `}
                      title="Listen to pronunciation"
                    >
                      {speakingId === ex.id ? (
                        <>
                          <VolumeX className="w-3 h-3 text-black animate-pulse" />
                          <span>STOP</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3 h-3 text-black" />
                          <span>LISTEN</span>
                        </>
                      )}
                    </button>

                    {/* Copy sentence button */}
                    <button
                      type="button"
                      onClick={() => handleCopy(ex.id, ex.sentence)}
                      className="px-2 py-1 text-[11px] font-mono font-bold bg-[#FFFFFF] hover:bg-[#F0F0F0] text-black border border-black flex items-center gap-1 retro-btn"
                      title="Copy sentence to clipboard"
                    >
                      {copiedId === ex.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-black" />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* The sentence itself */}
                <p className="font-mono text-sm sm:text-base text-black font-medium leading-relaxed my-2">
                  &ldquo;{ex.sentence}&rdquo;
                </p>

                {/* Explanation note */}
                {ex.explanation && (
                  <p className="text-[11px] font-mono text-[#666666] italic mt-1.5">
                    ↳ Note: {ex.explanation}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
