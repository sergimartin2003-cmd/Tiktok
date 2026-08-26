// =============================================================================
// motion/FakeCursor.tsx — Puntero falso animado.
// Se mueve con spring (nunca lineal), deja una estela sutil y al hacer click
// dispara un ripple + un micro "press". Es el recurso que da sensación de
// producto real: alguien está USANDO la interfaz.
// =============================================================================

import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SPRING_SOFT, theme } from "../theme";

export type CursorPoint = {
  x: number;
  y: number;
  /** Frame en el que EMPIEZA el movimiento hacia este punto. */
  at: number;
};

export type CursorClick = {
  at: number;
  /** Color del ripple (por defecto, acento). */
  color?: string;
};

/**
 * Posición del cursor en un frame dado. Es una función PURA: por eso podemos
 * muestrear frames pasados y dibujar la estela.
 */
export const cursorPosAt = (
  frame: number,
  path: CursorPoint[],
  fps: number,
): { x: number; y: number } => {
  let x = path[0].x;
  let y = path[0].y;

  for (let i = 1; i < path.length; i++) {
    const point = path[i];
    const progress = spring({
      frame: frame - point.at,
      fps,
      config: SPRING_SOFT,
      durationInFrames: 42,
    });
    x += (point.x - x) * progress;
    y += (point.y - y) * progress;
  }

  return { x, y };
};

/** Progreso del "press" del botón del ratón (0 = suelto, 1 = pulsado). */
const pressAt = (frame: number, clicks: CursorClick[]): number => {
  let press = 0;
  for (const click of clicks) {
    const local = frame - click.at;
    // Baja rápido y vuelve: 6 frames de pulsación.
    const value = interpolate(local, [-3, 0, 6], [0, 1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    press = Math.max(press, value);
  }
  return press;
};

export const FakeCursor: React.FC<{
  path: CursorPoint[];
  clicks?: CursorClick[];
  /** Tamaño del puntero. */
  size?: number;
  /** Aparece en este frame. */
  appearAt?: number;
}> = ({ path, clicks = [], size = 44, appearAt }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const start = appearAt ?? path[0].at;
  const opacity = interpolate(frame, [start, start + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const { x, y } = cursorPosAt(frame, path, fps);
  const press = pressAt(frame, clicks);

  // Estela: muestreamos la posición en frames anteriores.
  const trail = [3, 6, 9, 12].map((back) => ({
    back,
    ...cursorPosAt(frame - back, path, fps),
  }));

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity }}>
      {/* Ripples de click */}
      {clicks.map((click, index) => {
        const local = frame - click.at;
        if (local < 0 || local > 40) {
          return null;
        }
        const progress = interpolate(local, [0, 40], [0, 1], {
          extrapolateRight: "clamp",
        });
        const clickPos = cursorPosAt(click.at, path, fps);
        const radius = interpolate(progress, [0, 1], [6, 90]);
        const rippleOpacity = interpolate(progress, [0, 1], [0.5, 0]);
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: clickPos.x - radius,
              top: clickPos.y - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: "50%",
              border: `3px solid ${click.color ?? theme.colors.accent}`,
              opacity: rippleOpacity,
            }}
          />
        );
      })}

      {/* Estela */}
      {trail.map((point) => (
        <div
          key={point.back}
          style={{
            position: "absolute",
            left: point.x - 4,
            top: point.y - 4,
            width: 8,
            height: 8,
            borderRadius: "50%",
            backgroundColor: theme.colors.text,
            opacity: 0.1 - point.back * 0.006,
            filter: "blur(2px)",
          }}
        />
      ))}

      {/* El puntero */}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: `scale(${1 - press * 0.18})`,
          transformOrigin: "top left",
          filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.6))",
        }}
      >
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path
            d="M5 2.5 L5 19.2 L9.1 15.2 L11.9 21.4 L14.9 20.1 L12.1 14 L17.8 13.9 Z"
            fill={theme.colors.text}
            stroke={theme.colors.background}
            strokeWidth={1.4}
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};
