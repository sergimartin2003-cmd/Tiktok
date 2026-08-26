// =============================================================================
// Grain.tsx — Textura de grano MUY sutil sobre el fondo casi negro.
// SVG feTurbulence (sin assets externos). Opacidad muy baja para no ensuciar.
// =============================================================================

import React from "react";
import { AbsoluteFill } from "remotion";

export const Grain: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        opacity: 0.05,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%">
        <filter id="grain-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </AbsoluteFill>
  );
};
