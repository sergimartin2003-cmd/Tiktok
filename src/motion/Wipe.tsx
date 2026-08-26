// =============================================================================
// motion/Wipe.tsx — Reveals con máscara (clip-path).
// El contenido no aparece: se DESTAPA, como una cortina que barre.
// =============================================================================

import React from "react";
import { EASE } from "../theme";
import { useProgress } from "./hooks";

type Direction = "left" | "right" | "up" | "down";

const clipFor = (direction: Direction, progress: number): string => {
  const hidden = (1 - progress) * 100;
  switch (direction) {
    case "left":
      return `inset(0 ${hidden}% 0 0)`; // se destapa hacia la derecha
    case "right":
      return `inset(0 0 0 ${hidden}%)`;
    case "up":
      return `inset(0 0 ${hidden}% 0)`; // se destapa hacia abajo
    case "down":
      return `inset(${hidden}% 0 0 0)`;
  }
};

export const Wipe: React.FC<{
  delay?: number;
  duration?: number;
  direction?: Direction;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  delay = 0,
  duration = 24,
  direction = "left",
  style,
  children,
}) => {
  const progress = useProgress(delay, duration, EASE);

  return (
    <div
      style={{
        clipPath: clipFor(direction, progress),
        WebkitClipPath: clipFor(direction, progress),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
