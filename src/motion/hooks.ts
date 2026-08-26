// =============================================================================
// motion/hooks.ts — Primitivas de movimiento compartidas por TODAS las escenas.
// -----------------------------------------------------------------------------
// Aquí vive la "física" del vídeo: mismas curvas, mismos tiempos de entrada.
// Si tocas algo aquí, cambia el carácter del movimiento en toda la pieza.
// =============================================================================

import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { EASE, ENTER_FRAMES, SPRING_SOFT } from "../theme";

type SpringConfig = {
  damping: number;
  mass: number;
  stiffness: number;
};

/**
 * Progreso de entrada (0 → 1) con spring, relativo al frame de la escena.
 * Es la base de casi todas las apariciones del vídeo.
 */
export const useEnter = (delay = 0, config: SpringConfig = SPRING_SOFT) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config, durationInFrames: 34 });
};

/**
 * Progreso lineal-con-easing (0 → 1). Para barridos, dibujos de línea,
 * máscaras y todo lo que necesite un final exacto en el tiempo.
 */
export const useProgress = (
  delay = 0,
  duration = ENTER_FRAMES,
  easing = EASE,
) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });
};

/**
 * CAMERA PUSH — la escena entera hace un scale muy leve durante toda su
 * duración, para que nunca esté quieta. Regla del vídeo: cero estático.
 */
export const useCameraPush = (
  durationInFrames: number,
  from = 1,
  to = 1.04,
): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, durationInFrames], [from, to], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * PARALLAX — desplaza una capa a lo largo de la escena. Las capas de fondo usan
 * `distance` pequeño (se mueven menos) y las de primer plano, mayor.
 */
export const useParallax = (
  durationInFrames: number,
  distance: number,
): number => {
  const frame = useCurrentFrame();
  return interpolate(frame, [0, durationInFrames], [0, distance], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
};

/**
 * Respiración muy sutil: un elemento "vivo" que oscila de forma casi
 * imperceptible. Para que nada quede congelado en pantalla.
 */
export const useBreathe = (amplitude = 0.006, periodInFrames = 220): number => {
  const frame = useCurrentFrame();
  return 1 + Math.sin((frame / periodInFrames) * Math.PI * 2) * amplitude;
};

/**
 * Salida por fade al final de una escena (los últimos `duration` frames).
 * Se usa cuando una escena tiene que fundir antes del remate.
 */
export const useOutro = (durationInFrames: number, duration = 20): number => {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [durationInFrames - duration, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE },
  );
};
