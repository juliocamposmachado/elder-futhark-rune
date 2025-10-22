import { useState } from 'react';
import { DrawnRune, DisplayMode } from '../types/rune';
import { getRuneInterpretation } from '../lib/runeLogic';
import { X } from 'lucide-react';

interface RuneCardProps {
  drawnRune: DrawnRune;
  method: 'triple' | 'scatter';
  mode: DisplayMode;
  index: number;
  style?: React.CSSProperties;
}

export function RuneCard({ drawnRune, method, mode, index, style }: RuneCardProps) {
  const [showModal, setShowModal] = useState(false);
  const { rune, position, inverted } = drawnRune;

  const interpretation = getRuneInterpretation(drawnRune, method, mode);

  return (
    <>
      <div
        onClick={() => setShowModal(true)}
        style={{
          ...style,
          transform: inverted ? 'rotate(180deg)' : 'none',
          animationDelay: `${index * 0.15}s`
        }}
        className="group relative bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-900 rounded-lg p-4 shadow-xl cursor-pointer hover:scale-105 transition-all duration-300 animate-fadeInScale backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50 rounded-lg" />

        <div className="relative flex flex-col items-center gap-2">
          <span className="text-6xl font-mono text-amber-900 filter drop-shadow-md">
            {rune.symbol}
          </span>
          <h3 className="text-xl font-serif text-amber-950 tracking-wide">
            {rune.name}
          </h3>
          <p className="text-sm text-amber-800 font-mono">
            {rune.translit}
          </p>
          <div className="mt-2 px-3 py-1 bg-amber-900 text-amber-50 text-xs font-serif rounded">
            {position}
          </div>
        </div>

        <div className="absolute inset-0 bg-amber-900 opacity-0 group-hover:opacity-10 transition-opacity rounded-lg pointer-events-none" />
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDUiLz48L3N2Zz4=')] opacity-50 rounded-lg pointer-events-none" />

            <div className="relative p-8">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-amber-200 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="text-amber-900" size={24} />
              </button>

              <div className="flex flex-col items-center gap-4 mb-6">
                <span className="text-8xl font-mono text-amber-900 filter drop-shadow-lg">
                  {rune.symbol}
                </span>
                <h2 className="text-3xl font-serif text-amber-950 tracking-wide">
                  {rune.name}
                </h2>
                <p className="text-lg text-amber-800 font-mono">
                  {rune.translit}
                </p>
                {inverted && (
                  <div className="px-4 py-2 bg-red-900 text-red-50 text-sm font-serif rounded">
                    Invertida
                  </div>
                )}
              </div>

              <div className="space-y-6 text-amber-950">
                <div>
                  <h3 className="text-lg font-serif font-bold mb-2 text-amber-900">
                    Palavras-chave
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {rune.keywords.map((keyword, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-200 text-amber-900 text-sm rounded-full font-serif"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold mb-2 text-amber-900">
                    Significado
                  </h3>
                  <p className="text-base leading-relaxed font-serif">
                    {rune.meaning_short}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold mb-2 text-amber-900">
                    Interpretação ({position})
                  </h3>
                  <p className="text-base leading-relaxed font-serif italic">
                    {interpretation}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t-2 border-amber-300">
                  <div>
                    <h4 className="text-sm font-serif font-bold mb-1 text-amber-900">
                      Passado
                    </h4>
                    <p className="text-sm leading-relaxed font-serif">
                      {rune.meaning_past}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold mb-1 text-amber-900">
                      Presente
                    </h4>
                    <p className="text-sm leading-relaxed font-serif">
                      {rune.meaning_present}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-serif font-bold mb-1 text-amber-900">
                      Futuro
                    </h4>
                    <p className="text-sm leading-relaxed font-serif">
                      {rune.meaning_future}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
