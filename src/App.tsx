import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { Rune, DrawnRune, ReadingMethod, DisplayMode, Reading } from './types/rune';
import { drawTripleRunes, drawScatterRunes } from './lib/runeLogic';
import { RuneBag } from './components/RuneBag';
import { ReadingDisplay } from './components/ReadingDisplay';
import { Download, BookOpen, Sparkles } from 'lucide-react';

function App() {
  const [runes, setRunes] = useState<Rune[]>([]);
  const [drawnRunes, setDrawnRunes] = useState<DrawnRune[]>([]);
  const [method, setMethod] = useState<ReadingMethod>('triple');
  const [mode, setMode] = useState<DisplayMode>('poetic');
  const [isShaking, setIsShaking] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRunes();
  }, []);

  async function loadRunes() {
    try {
      const { data, error } = await supabase
        .from('runes')
        .select('*')
        .order('id');

      if (error) throw error;
      setRunes(data || []);
    } catch (error) {
      console.error('Erro ao carregar runas:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCast() {
    if (runes.length === 0) return;

    setIsShaking(true);
    setDrawnRunes([]);

    setTimeout(() => {
      const drawn = method === 'triple'
        ? drawTripleRunes(runes)
        : drawScatterRunes(runes);

      setDrawnRunes(drawn);
      setIsShaking(false);
    }, 1200);
  }

  async function handleSaveReading() {
    if (drawnRunes.length === 0) return;

    const reading: Reading = {
      method,
      runes_drawn: drawnRunes,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('readings')
        .insert([reading]);

      if (error) throw error;

      const blob = new Blob([JSON.stringify(reading, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `leitura-runas-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao salvar leitura:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-stone-100 flex items-center justify-center">
        <div className="text-2xl font-serif text-amber-900 animate-pulse">
          Carregando runas antigas...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-amber-50 to-stone-100 relative overflow-x-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZSI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOSIgbnVtT2N0YXZlcz0iNCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNub2lzZSkiIG9wYWNpdHk9IjAuMDMiLz48L3N2Zz4=')] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-amber-800" size={32} />
            <h1 className="text-5xl md:text-6xl font-serif text-amber-950 tracking-wide drop-shadow-lg">
              Oráculo das Runas
            </h1>
            <Sparkles className="text-amber-800" size={32} />
          </div>
          <p className="text-lg md:text-xl text-amber-800 font-serif italic max-w-2xl mx-auto leading-relaxed">
            Elder Futhark — Os símbolos ancestrais que falam através do tempo
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-amber-700 font-serif">
            <BookOpen size={16} />
            <span>Consulte as antigas runas e descubra o que elas revelam</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <aside className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-900 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-serif text-amber-950 mb-4 tracking-wide">
                Método de Leitura
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setMethod('triple')}
                  className={`w-full px-4 py-3 font-serif rounded border-2 transition-all text-left ${
                    method === 'triple'
                      ? 'bg-amber-800 text-amber-50 border-amber-900 shadow-lg'
                      : 'bg-amber-100 text-amber-900 border-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <div className="font-bold">Tirada Tripla</div>
                  <div className="text-sm mt-1 opacity-90">
                    Passado, Presente, Futuro
                  </div>
                </button>

                <button
                  onClick={() => setMethod('scatter')}
                  className={`w-full px-4 py-3 font-serif rounded border-2 transition-all text-left ${
                    method === 'scatter'
                      ? 'bg-amber-800 text-amber-50 border-amber-900 shadow-lg'
                      : 'bg-amber-100 text-amber-900 border-amber-700 hover:bg-amber-200'
                  }`}
                >
                  <div className="font-bold">Lançamento Tradicional</div>
                  <div className="text-sm mt-1 opacity-90">
                    6 a 9 runas espalhadas
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-4 border-amber-900 rounded-lg p-6 shadow-xl">
              <h2 className="text-xl font-serif text-amber-950 mb-4 tracking-wide">
                Modo de Interpretação
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => setMode('poetic')}
                  className={`w-full px-4 py-3 font-serif rounded border-2 transition-all ${
                    mode === 'poetic'
                      ? 'bg-amber-800 text-amber-50 border-amber-900 shadow-lg'
                      : 'bg-amber-100 text-amber-900 border-amber-700 hover:bg-amber-200'
                  }`}
                >
                  Modo Poético
                </button>

                <button
                  onClick={() => setMode('technical')}
                  className={`w-full px-4 py-3 font-serif rounded border-2 transition-all ${
                    mode === 'technical'
                      ? 'bg-amber-800 text-amber-50 border-amber-900 shadow-lg'
                      : 'bg-amber-100 text-amber-900 border-amber-700 hover:bg-amber-200'
                  }`}
                >
                  Modo Técnico
                </button>
              </div>
            </div>

            {drawnRunes.length > 0 && (
              <button
                onClick={handleSaveReading}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-700 to-green-800 text-green-50 font-serif rounded border-2 border-green-900 shadow-lg hover:from-green-600 hover:to-green-700 transition-all"
              >
                <Download size={20} />
                Salvar Leitura
              </button>
            )}
          </aside>

          <main className="lg:col-span-3 space-y-8">
            <div className="flex justify-center">
              <RuneBag onCast={handleCast} isShaking={isShaking} />
            </div>

            <ReadingDisplay
              drawnRunes={drawnRunes}
              method={method}
              mode={mode}
            />
          </main>
        </div>

        <footer className="mt-16 text-center text-sm text-amber-700 font-serif border-t-2 border-amber-300 pt-8">
          <p className="mb-2">
            Sistema de leitura de runas Elder Futhark com sorteio criptograficamente seguro
          </p>
          <p className="text-xs opacity-75">
            As runas não predizem o futuro, mas oferecem perspectivas para reflexão
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
