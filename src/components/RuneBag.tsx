import { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface RuneBagProps {
  onCast: () => void;
  isShaking: boolean;
}

export function RuneBag({ onCast, isShaking }: RuneBagProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6">
      <div
        className={`relative transition-transform duration-300 ${
          isShaking ? 'animate-shake' : ''
        } ${isHovered ? 'scale-105' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="w-32 h-40 bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 rounded-b-full border-4 border-amber-950 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JhaW4iIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMwMDAiIG9wYWNpdHk9IjAuMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFpbikiLz48L3N2Zz4=')] opacity-30" />
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-amber-950 rounded-full shadow-inner" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="text-amber-300 opacity-40" size={32} />
          </div>
        </div>
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-6 bg-amber-900 border-2 border-amber-950 rounded-t-lg" />
      </div>

      <button
        onClick={onCast}
        disabled={isShaking}
        className="px-8 py-3 bg-gradient-to-r from-amber-700 to-amber-800 text-amber-50 font-serif text-lg tracking-wider rounded border-2 border-amber-900 shadow-lg hover:from-amber-600 hover:to-amber-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase"
      >
        {isShaking ? 'Lançando...' : 'Lançar Runas'}
      </button>
    </div>
  );
}
