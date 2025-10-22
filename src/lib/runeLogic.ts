import { Rune, DrawnRune, ReadingMethod } from '../types/rune';

export function secureShuffle<T>(array: T[]): T[] {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const rand = crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF;
    const j = Math.floor(rand * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function secureRandomInt(min: number, max: number): number {
  const range = max - min + 1;
  const rand = crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF;
  return Math.floor(rand * range) + min;
}

export function drawTripleRunes(baseRunes: Rune[]): DrawnRune[] {
  const shuffled = secureShuffle(baseRunes);
  const picked = shuffled.slice(0, 3);
  const positions = ['Passado', 'Presente', 'Futuro'];

  return picked.map((rune, idx) => ({
    rune,
    position: positions[idx]
  }));
}

export function drawScatterRunes(baseRunes: Rune[]): DrawnRune[] {
  const count = secureRandomInt(6, 9);
  const shuffled = secureShuffle(baseRunes);
  const picked = shuffled.slice(0, count);

  const centerX = 50;
  const centerY = 50;

  return picked.map((rune) => {
    const angle = crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF * Math.PI * 2;
    const distance = (crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF) * 35 + 5;

    const x = centerX + Math.cos(angle) * distance;
    const y = centerY + Math.sin(angle) * distance;

    const rotation = secureRandomInt(-30, 30);

    const invertRandom = crypto.getRandomValues(new Uint32Array(1))[0] / 0xFFFFFFFF;
    const inverted = invertRandom < 0.3;

    const distanceFromCenter = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );

    let position = 'periférica';
    if (distanceFromCenter < 15) {
      position = 'central';
    } else if (distanceFromCenter < 30) {
      position = 'intermediária';
    }

    return {
      rune,
      position,
      x,
      y,
      rotation,
      inverted
    };
  }).sort((a, b) => {
    const distA = Math.sqrt(Math.pow(a.x! - centerX, 2) + Math.pow(a.y! - centerY, 2));
    const distB = Math.sqrt(Math.pow(b.x! - centerX, 2) + Math.pow(b.y! - centerY, 2));
    return distA - distB;
  });
}

export function getRuneInterpretation(drawnRune: DrawnRune, method: ReadingMethod, mode: 'poetic' | 'technical'): string {
  const { rune, position, inverted } = drawnRune;

  if (mode === 'poetic') {
    if (method === 'triple') {
      const suffix = inverted ? ' (Invertida: energias bloqueadas ou desafiadas)' : '';
      return rune.poetic_text + suffix;
    } else {
      let relevance = '';
      if (position === 'central') {
        relevance = 'Runa central — de grande importância: ';
      } else if (position === 'intermediária') {
        relevance = 'Runa de influência moderada: ';
      } else {
        relevance = 'Runa periférica — influência sutil: ';
      }
      const suffix = inverted ? ' (Invertida: aspecto bloqueado)' : '';
      return relevance + rune.poetic_text + suffix;
    }
  } else {
    if (method === 'triple') {
      let meaning = '';
      if (position === 'Passado') meaning = rune.meaning_past;
      else if (position === 'Presente') meaning = rune.meaning_present;
      else meaning = rune.meaning_future;

      const suffix = inverted ? ' Invertida: energias bloqueadas ou desafiadas.' : '';
      return meaning + suffix;
    } else {
      const suffix = inverted ? ' (Invertida: aspecto bloqueado ou desafiado)' : '';
      return rune.meaning_short + suffix;
    }
  }
}
