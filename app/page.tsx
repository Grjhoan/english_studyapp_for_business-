'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { PhraseInput } from '@/components/PhraseInput';
import { PhraseCard } from '@/components/PhraseCard';
import { Pagination } from '@/components/Pagination';
import { ModelInfoModal } from '@/components/ModelInfoModal';
import { SystemAlert } from '@/components/SystemAlert';
import { PhraseItem } from '@/lib/types';
import { Search, SlidersHorizontal, BookOpen, Sparkles } from 'lucide-react';

const PAGE_SIZE = 10;
const STORAGE_KEY = 'pm_english_phrases_v1';

export default function Home() {
  const [phrases, setPhrases] = useState<PhraseItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModelInfoOpen, setIsModelInfoOpen] = useState(false);
  const [alert, setAlert] = useState<{
    type: 'info' | 'success' | 'error';
    title?: string;
    message: string;
  } | null>(null);

  // 1. Load initial phrases from backend API and sync with local storage
  useEffect(() => {
    async function loadPhrases() {
      try {
        const res = await fetch('/api/phrases');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.phrases)) {
            setPhrases(data.phrases);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(data.phrases));
            } catch {}
            return;
          }
        }
      } catch (err) {
        console.warn('Backend fetch failed, attempting localStorage:', err);
      }

      // Fallback to localStorage if offline / serverless cold start
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPhrases(parsed);
          }
        }
      } catch {}
    }

    loadPhrases();
  }, []);

  // Save to localStorage when phrases change
  const updatePhrases = (newPhrases: PhraseItem[]) => {
    setPhrases(newPhrases);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newPhrases));
    } catch {}
  };

  // 2. Handle Generation of new phrase
  const handleGenerate = async (phrase: string) => {
    setIsLoading(true);
    setAlert(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phrase }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate business examples.');
      }

      if (data.phrases) {
        updatePhrases(data.phrases);
      } else if (data.item) {
        const filtered = phrases.filter(
          (p) => p.phrase.toLowerCase() !== data.item.phrase.toLowerCase()
        );
        updatePhrases([data.item, ...filtered]);
      }

      setCurrentPage(1); // Jump to page 1 to see the new phrase
      setAlert({
        type: 'success',
        title: 'PHRASE ADDED',
        message: `Generated 3 business sentences for "${phrase}". Examples are ready below (click the accordion to view).`,
      });
    } catch (err: any) {
      console.error(err);
      setAlert({
        type: 'error',
        title: 'GENERATION ERROR',
        message: err.message || 'Could not contact backend LLM service.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Handle Deleting a phrase
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/phrases?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success && data.phrases) {
        updatePhrases(data.phrases);
      } else {
        updatePhrases(phrases.filter((item) => item.id !== id));
      }

      setAlert({
        type: 'info',
        title: 'DELETED',
        message: 'Phrase removed from your vault.',
      });
    } catch (err: any) {
      console.error(err);
      // Client-side fallback delete
      updatePhrases(phrases.filter((item) => item.id !== id));
    }
  };

  // 4. Search and pagination calculation
  const filteredPhrases = useMemo(() => {
    if (!searchQuery.trim()) return phrases;
    const query = searchQuery.toLowerCase().trim();
    return phrases.filter(
      (item) =>
        item.phrase.toLowerCase().includes(query) ||
        item.meaning.toLowerCase().includes(query) ||
        item.examples.some((ex) => ex.sentence.toLowerCase().includes(query))
    );
  }, [phrases, searchQuery]);

  const totalPages = Math.ceil(filteredPhrases.length / PAGE_SIZE) || 1;

  // Ensure current page does not exceed total pages
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [totalPages, currentPage]);

  const paginatedPhrases = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredPhrases.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredPhrases, currentPage]);

  return (
    <main className="min-h-screen bg-[#F5F3EC] px-3 sm:px-6 py-6 max-w-3xl mx-auto selection:bg-[#00FF00]">
      {/* Header section */}
      <Header
        phraseCount={phrases.length}
        onOpenModelInfo={() => setIsModelInfoOpen(true)}
      />

      {/* System alert banner if active */}
      {alert && (
        <SystemAlert
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}

      {/* Main input card for entering new phrase */}
      <PhraseInput onGenerate={handleGenerate} isLoading={isLoading} />

      {/* Vault / Saved Phrases section */}
      <section className="mb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black inline-block"></span>
            <h2 className="font-mono text-sm sm:text-base font-bold uppercase tracking-wider text-black">
              SAVED PHRASES VAULT ({filteredPhrases.length})
            </h2>
          </div>

          {/* Search filter input */}
          <div className="w-full sm:w-64">
            <div className="flex items-center border-2 border-black bg-[#FFFFFF] px-2 py-1 shadow-retro-sm">
              <Search className="w-3.5 h-3.5 text-[#666666] mr-1.5 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search vault..."
                className="w-full font-mono text-xs text-black placeholder:text-[#888888] focus:outline-none bg-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs font-mono text-[#888888] hover:text-black"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Phrases List */}
        {paginatedPhrases.length === 0 ? (
          <div className="bg-[#FFFFFF] border-2 border-black p-8 text-center shadow-retro">
            <p className="font-mono text-sm text-[#666666] mb-3">
              No phrases found {searchQuery ? `matching "${searchQuery}"` : 'yet'}.
            </p>
            <p className="font-mono text-xs text-[#888888]">
              Type a word like <span className="font-bold text-black">&ldquo;Catch me up&rdquo;</span> above to generate business sentences!
            </p>
          </div>
        ) : (
          <div>
            {paginatedPhrases.map((item, idx) => (
              <PhraseCard
                key={item.id}
                item={item}
                index={(currentPage - 1) * PAGE_SIZE + idx}
                onDelete={handleDelete}
              />
            ))}

            {/* Pagination: only if > 10 phrases per page requirement */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredPhrases.length}
              pageSize={PAGE_SIZE}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 300, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </section>

      {/* Footer bar */}
      <footer className="border-t-2 border-black pt-4 pb-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#666666] gap-2">
        <div>
          PM ENGLISH COMPANION // BUILT FOR CLIENT & TEAM EXCELLENCE
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModelInfoOpen(true)}
            className="hover:text-black underline cursor-pointer"
          >
            [ AI MODEL DETAILS ]
          </button>
        </div>
      </footer>

      {/* Model Information Modal */}
      <ModelInfoModal
        isOpen={isModelInfoOpen}
        onClose={() => setIsModelInfoOpen(false)}
      />
    </main>
  );
}
