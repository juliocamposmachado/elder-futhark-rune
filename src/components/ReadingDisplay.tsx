import { DrawnRune, DisplayMode, ReadingMethod } from '../types/rune';
import { RuneCard } from './RuneCard';

interface ReadingDisplayProps {
  drawnRunes: DrawnRune[];
  method: ReadingMethod;
  mode: DisplayMode;
}

export function ReadingDisplay({ drawnRunes, method, mode }: ReadingDisplayProps) {
  if (drawnRunes.length === 0) return null;

  if (method === 'triple') {
    return (
      <div className="w-full max-w-4xl mx-auto animate-fadeIn">
        <h2 className="text-3xl font-serif text-amber-950 text-center mb-8 tracking-wide">
          Leitura Tripla: Passado — Presente — Futuro
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drawnRunes.map((drawnRune, index) => (
            <RuneCard
              key={drawnRune.rune.id}
              drawnRune={drawnRune}
              method={method}
              mode={mode}
              index={index}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto animate-fadeIn">
      <h2 className="text-3xl font-serif text-amber-950 text-center mb-4 tracking-wide">
        Lançamento Tradicional
      </h2>
      <p className="text-center text-amber-800 font-serif mb-8 text-sm">
        Runas mais próximas ao centro têm maior relevância
      </p>

      <div className="relative w-full aspect-square max-w-2xl mx-auto bg-gradient-to-br from-amber-100 to-amber-200 rounded-full border-4 border-amber-900 shadow-2xl overflow-hidden mb-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMSIvPjwvc3ZnPg==')] opacity-50" />

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-amber-900 rounded-full shadow-lg z-10" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1/3 h-1/3 rounded-full border-2 border-dashed border-amber-700 opacity-30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2/3 h-2/3 rounded-full border-2 border-dashed border-amber-600 opacity-20" />
        </div>

        {drawnRunes.map((drawnRune, index) => (
          <div
            key={drawnRune.rune.id}
            className="absolute"
            style={{
              left: `${drawnRune.x}%`,
              top: `${drawnRune.y}%`,
              transform: `translate(-50%, -50%) rotate(${drawnRune.rotation}deg)`,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div
              className="w-16 h-20 bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-900 rounded shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform animate-fadeInScale"
              style={{
                transform: drawnRune.inverted ? 'rotate(180deg)' : 'none'
              }}
            >
              <span className="text-3xl font-mono text-amber-900">
                {drawnRune.rune.symbol}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drawnRunes.map((drawnRune, index) => (
          <RuneCard
            key={drawnRune.rune.id}
            drawnRune={drawnRune}
            method={method}
            mode={mode}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
