// =============================================================================
// components/LifecycleChart.tsx — La curva del producto ganador.
// La línea SE DIBUJA (stroke-dashoffset), el área bajo la curva se rellena con
// un degradado sutil de acento que avanza con el trazo, y aparecen dos
// etiquetas: el pico ("producto ganador") y la caída ("todos lo copian").
// =============================================================================

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE, accentGlow, theme } from "../theme";
import { useProgress } from "../motion/hooks";

const W = 880;
const H = 360;
const BASE_Y = 300;

// Trazado: sube rápido, hace pico a la izquierda del centro y cae despacio.
const CURVE = `M40,${BASE_Y} C140,${BASE_Y} 220,60 380,60 C560,60 660,${BASE_Y - 10} 840,${BASE_Y}`;
const AREA = `${CURVE} L840,${BASE_Y} L40,${BASE_Y} Z`;

const PEAK = { x: 380, y: 60 };
const DROP = { x: 700, y: 232 };

/** Etiqueta anclada a un punto de la curva, con su línea guía. */
const ChartLabel: React.FC<{
  x: number;
  y: number;
  dx: number;
  dy: number;
  text: string;
  color: string;
  delay: number;
}> = ({ x, y, dx, dy, text, color, delay }) => {
  const show = useProgress(delay, 22, EASE);
  return (
    <g opacity={show}>
      <line
        x1={x}
        y1={y}
        x2={x + dx}
        y2={y + dy}
        stroke={color}
        strokeWidth={1.5}
        opacity={0.5}
      />
      <text
        x={x + dx}
        y={y + dy - 12}
        fill={color}
        fontSize={26}
        fontWeight={700}
        textAnchor={dx < 0 ? "end" : "start"}
      >
        {text}
      </text>
    </g>
  );
};

export const LifecycleChart: React.FC<{
  delay?: number;
  /** Frames que tarda la curva en dibujarse. */
  drawDuration?: number;
}> = ({ delay = 0, drawDuration = 180 }) => {
  const frame = useCurrentFrame();
  const draw = useProgress(delay, drawDuration, EASE);

  // El pico late cuando el trazo ya ha pasado por él.
  const peakReached = draw > 0.45 ? 1 : 0;
  const pulse = 1 + Math.sin(frame / 9) * 0.18;

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
      <defs>
        <linearGradient id="area-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.colors.accent} stopOpacity={0.32} />
          <stop offset="100%" stopColor={theme.colors.accent} stopOpacity={0} />
        </linearGradient>
        {/* El área se destapa a la vez que avanza el trazo */}
        <clipPath id="area-reveal">
          <rect x={0} y={0} width={draw * W} height={H} />
        </clipPath>
      </defs>

      {/* Línea base */}
      <line
        x1={20}
        y1={BASE_Y}
        x2={W - 20}
        y2={BASE_Y}
        stroke={theme.colors.line}
        strokeWidth={2}
      />

      {/* Área bajo la curva */}
      <path d={AREA} fill="url(#area-fill)" clipPath="url(#area-reveal)" />

      {/* La curva, dibujándose */}
      <path
        d={CURVE}
        stroke={theme.colors.accent}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - draw}
        style={{ filter: accentGlow(0.5) }}
      />

      {/* Punto del pico, latiendo */}
      <g opacity={peakReached}>
        <circle
          cx={PEAK.x}
          cy={PEAK.y}
          r={16 * pulse}
          fill={theme.colors.accent}
          opacity={0.18}
        />
        <circle cx={PEAK.x} cy={PEAK.y} r={8} fill={theme.colors.accent} />
      </g>

      {/* Punto de la caída */}
      <circle
        cx={DROP.x}
        cy={DROP.y}
        r={7}
        fill={theme.colors.danger}
        opacity={interpolate(draw, [0.82, 0.92], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* Etiquetas */}
      <ChartLabel
        x={PEAK.x}
        y={PEAK.y}
        dx={-30}
        dy={-24}
        text="producto ganador"
        color={theme.colors.accent}
        delay={delay + 105}
      />
      {/* dx negativo: la etiqueta se ancla hacia dentro para no salirse del SVG */}
      <ChartLabel
        x={DROP.x}
        y={DROP.y}
        dx={-22}
        dy={52}
        text="todos lo copian"
        color={theme.colors.danger}
        delay={delay + 175}
      />
    </svg>
  );
};
