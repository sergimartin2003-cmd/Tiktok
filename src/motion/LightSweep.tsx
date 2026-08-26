// =============================================================================
// motion/LightSweep.tsx — Destello que cruza un texto/elemento.
// Duplica el contenido en color de acento y lo enmascara con un gradiente que
// barre de izquierda a derecha. Sutil: es un brillo, no un flash.
// =============================================================================

import React from "react";
import { EASE_IN_OUT, theme } from "../theme";
import { useProgress } from "./hooks";

export const LightSweep: React.FC<{
  delay?: number;
  duration?: number;
  /** Color del destello (por defecto, el acento). */
  color?: string;
  /** Ancho del haz, en % del elemento. */
  width?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  delay = 0,
  duration = 45,
  color = theme.colors.accent,
  width = 14,
  style,
  children,
}) => {
  const progress = useProgress(delay, duration, EASE_IN_OUT);

  // El haz entra por fuera del elemento y sale por el otro lado.
  const position = -30 + progress * 160;
  const active = progress > 0 && progress < 1;

  const mask = `linear-gradient(100deg, transparent ${
    position - width
  }%, rgba(0,0,0,1) ${position}%, transparent ${position + width}%)`;

  return (
    <span style={{ position: "relative", display: "inline-block", ...style }}>
      {children}
      {active ? (
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            color,
            WebkitMaskImage: mask,
            maskImage: mask,
            pointerEvents: "none",
          }}
        >
          {children}
        </span>
      ) : null}
    </span>
  );
};
