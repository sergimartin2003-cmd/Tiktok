// =============================================================================
// components/EditorialGrid.tsx — Rejilla fina que se DIBUJA y se desvanece.
// Da la sensación editorial (retícula de revista) sin llamar la atención.
// Vive en la capa de fondo: se mueve menos que el primer plano (parallax) y
// lleva un blur mínimo para separar planos.
// =============================================================================

import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { EASE, theme } from "../theme";
import { useParallax, useProgress } from "../motion/hooks";

const VERTICALS = [0.16, 0.38, 0.62, 0.84];
const HORIZONTALS = [0.22, 0.5, 0.78];

export const EditorialGrid: React.FC<{
  durationInFrames: number;
  delay?: number;
  /** Opacidad a la que se queda la rejilla tras dibujarse. */
  restOpacity?: number;
}> = ({ durationInFrames, delay = 0, restOpacity = 0.5 }) => {
  // Parallax: el fondo se desplaza MENOS que el primer plano.
  const drift = useParallax(durationInFrames, -18);

  // Tras dibujarse, la rejilla baja de intensidad y se queda de fondo.
  const fade = interpolate(
    useProgress(delay + 40, 50, EASE),
    [0, 1],
    [1, restOpacity],
  );

  return (
    <AbsoluteFill
      style={{
        transform: `translateY(${drift}px)`,
        filter: "blur(0.4px)",
        pointerEvents: "none",
      }}
    >
      {VERTICALS.map((position, index) => (
        <VerticalLine
          key={`v-${position}`}
          position={position}
          delay={delay + index * 5}
          fade={fade}
        />
      ))}
      {HORIZONTALS.map((position, index) => (
        <HorizontalLine
          key={`h-${position}`}
          position={position}
          delay={delay + 10 + index * 5}
          fade={fade}
        />
      ))}
    </AbsoluteFill>
  );
};

const VerticalLine: React.FC<{
  position: number;
  delay: number;
  fade: number;
}> = ({ position, delay, fade }) => {
  const draw = useProgress(delay, 40, EASE);
  return (
    <div
      style={{
        position: "absolute",
        left: `${position * 100}%`,
        top: 0,
        width: 1,
        height: "100%",
        backgroundColor: theme.colors.line,
        transform: `scaleY(${draw})`,
        transformOrigin: "top",
        opacity: fade,
      }}
    />
  );
};

const HorizontalLine: React.FC<{
  position: number;
  delay: number;
  fade: number;
}> = ({ position, delay, fade }) => {
  const draw = useProgress(delay, 40, EASE);
  return (
    <div
      style={{
        position: "absolute",
        top: `${position * 100}%`,
        left: 0,
        height: 1,
        width: "100%",
        backgroundColor: theme.colors.line,
        transform: `scaleX(${draw})`,
        transformOrigin: "left",
        opacity: fade,
      }}
    />
  );
};
