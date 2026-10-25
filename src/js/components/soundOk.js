import { soundOk } from '../mapDom/dom.js';

export function soundSuccess() {
  try {
    soundOk.currentTime = 0;
    const p = soundOk.play();
    // play() devolve Promise; sem o catch, bloqueio de autoplay gera erro não tratado
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch { /* som é opcional */ }
}
