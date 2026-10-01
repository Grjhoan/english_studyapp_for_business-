import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="w-full bg-[#FFFFFF] border-2 border-black shadow-retro p-3 mt-6 mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
      {/* Information text */}
      <div className="font-mono text-xs text-[#555555]">
        SHOWING <span className="font-bold text-black">{startItem}-{endItem}</span> OF <span className="font-bold text-black">{totalItems}</span> PHRASES
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
            px-3 py-2 text-xs font-mono font-bold border-2 border-black flex items-center gap-1 retro-btn min-h-[44px]
            ${
              currentPage === 1
                ? 'bg-[#E5E5E5] text-[#999999] border-[#BBBBBB] cursor-not-allowed'
                : 'bg-[#F0F0F0] text-black hover:bg-[#00FF00] cursor-pointer shadow-retro-sm'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4" />
          [ PREV ]
        </button>

        <div className="px-3 py-2 text-xs font-mono font-bold bg-[#FFFFFF] border-2 border-black shadow-retro-sm">
          PAGE {currentPage} / {totalPages}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
            px-3 py-2 text-xs font-mono font-bold border-2 border-black flex items-center gap-1 retro-btn min-h-[44px]
            ${
              currentPage === totalPages
                ? 'bg-[#E5E5E5] text-[#999999] border-[#BBBBBB] cursor-not-allowed'
                : 'bg-[#F0F0F0] text-black hover:bg-[#00FF00] cursor-pointer shadow-retro-sm'
            }
          `}
        >
          [ NEXT ]
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
