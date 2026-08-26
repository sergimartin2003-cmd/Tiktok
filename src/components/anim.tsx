// =============================================================================
// anim.tsx — Primitivas de animación reutilizables
// -----------------------------------------------------------------------------
// Movimiento "premium y con intención": entradas con spring() suave (sin
// rebotes exagerados) + micro scale/opacity en el texto clave.
// =============================================================================

import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// Config de spring suave y sobrio (sin overshoot molesto).
const SOFT_SPRING = { damping: 200, mass: 0.7, stiffness: 120 } as const;

/**
 * Reveal — aparición limpia: fade + leve desplazamiento vertical + micro scale.
 * `delay` en frames (relativo al inicio de la escena).
 */
export const Reveal: React.FC<{
  delay?: number;
  y?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ delay = 0, y = 26, children, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: SOFT_SPRING,
  });

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [y, 0]);
  const scale = interpolate(progress, [0, 1], [0.985, 1]);

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        willChange: "transform, opacity",
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * useCountUp — devuelve un número que "cuenta" de 0 a `to` con easing limpio.
 * Sirve tanto para valores positivos como negativos (p. ej. −10).
 */
export const useCountUp = (
  to: number,
  delay = 0,
  durationInFrames = 22,
): number => {
  const frame = useCurrentFrame();
  const progress = interpolate(
    frame,
    [delay, delay + durationInFrames],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.cubic),
    },
  );
  return Math.round(to * progress);
};
