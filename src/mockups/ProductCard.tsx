// =============================================================================
// mockups/ProductCard.tsx — Tarjeta de producto flotante.
// El producto (una lámpara) está DIBUJADO en SVG: sus trazos se dibujan solos
// y la luz se enciende con el color de acento. Ninguna imagen externa.
// =============================================================================

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE, theme } from "../theme";
import { useEnter, useProgress } from "../motion/hooks";

export const ProductCard: React.FC<{
  delay?: number;
  width?: number;
  height?: number;
}> = ({ delay = 0, width = 300, height = 340 }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(delay);

  // Los trazos de la lámpara se dibujan uno tras otro.
  const drawShade = useProgress(delay + 12, 30, EASE);
  const drawStem = useProgress(delay + 26, 24, EASE);
  const drawBase = useProgress(delay + 38, 22, EASE);

  // La luz se enciende al final.
  const lightOn = useProgress(delay + 54, 34, EASE);

  // Flotación permanente: la tarjeta nunca queda quieta.
  const float = Math.sin((frame - delay) / 70) * 7;

  return (
    <div
      style={{
        width,
        height,
        borderRadius: 22,
        backgroundColor: theme.colors.surface,
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow:
          "0 40px 80px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(enter, [0, 1], [40, float])}px) scale(${interpolate(
          enter,
          [0, 1],
          [0.9, 1],
        )})`,
        willChange: "transform, opacity",
      }}
    >
      <svg width={width * 0.72} height={height * 0.72} viewBox="0 0 200 240">
        <defs>
          <radialGradient id="lamp-light" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stopColor={theme.colors.accent} stopOpacity={0.5} />
            <stop offset="100%" stopColor={theme.colors.accent} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* El haz de luz que proyecta la lámpara */}
        <path
          d="M52,92 L148,92 L186,215 L14,215 Z"
          fill="url(#lamp-light)"
          opacity={lightOn}
        />

        {/* Pantalla de la lámpara */}
        <path
          d="M50,90 L150,90 L126,30 L74,30 Z"
          stroke={theme.colors.text}
          strokeWidth={4}
          strokeLinejoin="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - drawShade}
        />

        {/* Bombilla */}
        <circle
          cx={100}
          cy={104}
          r={9}
          fill={theme.colors.accent}
          opacity={lightOn}
        />

        {/* Pie */}
        <path
          d="M100,90 L100,206"
          stroke={theme.colors.muted}
          strokeWidth={4}
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - drawStem}
        />

        {/* Base */}
        <path
          d="M60,208 L140,208"
          stroke={theme.colors.text}
          strokeWidth={6}
          strokeLinecap="round"
          fill="none"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - drawBase}
        />
      </svg>
    </div>
  );
};
