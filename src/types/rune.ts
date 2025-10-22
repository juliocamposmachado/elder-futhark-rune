export interface Rune {
  id: number;
  symbol: string;
  name: string;
  translit: string;
  keywords: string[];
  meaning_short: string;
  meaning_past: string;
  meaning_present: string;
  meaning_future: string;
  poetic_text: string;
}

export interface DrawnRune {
  rune: Rune;
  position: string;
  x?: number;
  y?: number;
  rotation?: number;
  inverted?: boolean;
}

export interface Reading {
  id?: string;
  method: string;
  runes_drawn: DrawnRune[];
  created_at?: string;
}

export type ReadingMethod = 'triple' | 'scatter';
export type DisplayMode = 'poetic' | 'technical';
