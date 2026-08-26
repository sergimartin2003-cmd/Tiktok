// =============================================================================
// timing.ts — LÍNEA DE TIEMPO
// -----------------------------------------------------------------------------
// ⏱️  AQUÍ AJUSTAS LOS TIEMPOS PARA CUAJARLOS CON TU VOZ.
//
// `sceneDurationsInSeconds` es la ÚNICA fuente de verdad de la duración.
// Cambia un número (en SEGUNDOS) y toda la línea de tiempo se recoloca sola:
// los frames de cada escena, el solape de las transiciones y la duración total
// de la composición se recalculan automáticamente. Nada está hardcodeado.
//
// Orden de las escenas:
//   [0] INTRO · [1] EL MARGEN · [2] LA ATENCIÓN
//   [3] DROPSHIPPING vs STOCK · [4] NINGÚN PRODUCTO DURA · [5] CIERRE
// =============================================================================

// Full HD vertical a 60 fps.
export const FPS = 60;

// 👇 CAMBIA ESTOS NÚMEROS (segundos) para sincronizar con tu locución.
export const sceneDurationsInSeconds: number[] = [7, 13, 13, 12, 12, 6];

// Duración del solape entre escenas (transición). En segundos, también derivado.
export const TRANSITION_DURATION_IN_SECONDS = 0.5;

// --- A partir de aquí es cálculo automático: no necesitas tocarlo. ---------

/** Convierte segundos a frames con los fps del proyecto. */
export const sec = (seconds: number): number => Math.round(seconds * FPS);

// Duración de cada escena en frames (segundos × 60).
export const sceneDurationsInFrames: number[] =
  sceneDurationsInSeconds.map(sec);

// Frames que dura cada transición entre escenas.
export const TRANSITION_DURATION_IN_FRAMES = sec(
  TRANSITION_DURATION_IN_SECONDS,
);

// Número de transiciones = huecos entre escenas.
const TRANSITION_COUNT = Math.max(0, sceneDurationsInFrames.length - 1);

// Duración total de la composición.
// Las transiciones SOLAPAN escenas, así que restamos ese solape del total.
export const totalDurationInFrames: number =
  sceneDurationsInFrames.reduce((sum, duration) => sum + duration, 0) -
  TRANSITION_COUNT * TRANSITION_DURATION_IN_FRAMES;

// Frame de inicio de cada escena (útil para previsualizar y depurar).
export const sceneStartsInFrames: number[] = sceneDurationsInFrames.reduce<
  number[]
>((starts, _duration, index) => {
  if (index === 0) {
    starts.push(0);
    return starts;
  }
  starts.push(
    starts[index - 1] +
      sceneDurationsInFrames[index - 1] -
      TRANSITION_DURATION_IN_FRAMES,
  );
  return starts;
}, []);
