'use strict';
import React from 'react';
import { AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

interface SystemAlertProps {
  type?: 'error' | 'success' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
}

export const SystemAlert: React.FC<SystemAlertProps> = ({
  type = 'info',
  title = 'SYSTEM ALERT',
  message,
  onClose,
}) => {
  const icon =
    type === 'error' ? (
      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
    ) : type === 'success' ? (
      <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
    ) : (
      <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
    );

  return (
    <div className="w-full bg-[#FFFFFF] border-2 border-black shadow-retro mb-6 text-left">
      {/* Title bar with retro hatched/grey style */}
      <div className="retro-titlebar px-3 py-1.5 flex items-center justify-between border-b-2 border-black bg-[#E0E0E0]">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
          {title}
        </span>
        {onClose && (
          <button
            onClick={onClose}
            className="w-5 h-5 flex items-center justify-center border border-black bg-white hover:bg-black hover:text-white text-xs font-bold leading-none retro-btn"
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>

      <div className="p-3.5 flex items-start gap-3 bg-[#FAFAFA]">
        {icon}
        <div className="flex-1">
          <p className="text-xs sm:text-sm font-mono text-[#222222] whitespace-pre-line leading-relaxed">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
};
