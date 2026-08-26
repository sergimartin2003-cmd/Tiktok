// =============================================================================
// timing.ts — LÍNEA DE TIEMPO
// -----------------------------------------------------------------------------
// ⏱️  AQUÍ AJUSTAS LOS TIEMPOS PARA CUAJARLOS CON TU VOZ.
//
// `sceneDurationsInSeconds` es la ÚNICA fuente de verdad de la duración.
// Cambia un número (en segundos) y toda la línea de tiempo se recoloca sola:
// la duración total de la composición y el `from` de cada escena se recalculan
// automáticamente. No hace falta tocar nada más.
//
// Orden de las escenas:
//   [0] INTRO · [1] EL MARGEN · [2] LA ATENCIÓN
//   [3] DROPSHIPPING vs STOCK · [4] NINGÚN PRODUCTO DURA · [5] CIERRE
// =============================================================================

export const FPS = 30;

// 👇 CAMBIA ESTOS NÚMEROS (segundos) para sincronizar con tu locución.
export const sceneDurationsInSeconds: number[] = [7, 13, 13, 12, 12, 6];

// --- A partir de aquí es cálculo automático: no necesitas tocarlo. ---------

// Duración de cada escena en frames.
export const sceneDurationsInFrames: number[] = sceneDurationsInSeconds.map(
  (seconds) => Math.round(seconds * FPS),
);

// Frame de inicio (offset) de cada escena dentro de la composición.
export const sceneStartsInFrames: number[] = sceneDurationsInFrames.reduce<
  number[]
>((starts, _duration, index) => {
  const previousStart = index === 0 ? 0 : starts[index - 1];
  const previousDuration = index === 0 ? 0 : sceneDurationsInFrames[index - 1];
  starts.push(previousStart + previousDuration);
  return starts;
}, []);

// Duración total de la composición (suma de todas las escenas).
export const totalDurationInFrames: number = sceneDurationsInFrames.reduce(
  (sum, duration) => sum + duration,
  0,
);
