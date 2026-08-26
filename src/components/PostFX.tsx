// =============================================================================
// components/PostFX.tsx — Post-producción: grano + viñeta.
// Va SIEMPRE por encima de todo, a nivel de composición. Es lo que une las
// escenas y les da textura de pieza rodada en vez de plantilla web.
// =============================================================================

import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";

/** Grano de película: la semilla cambia cada frame para que "hierva". */
const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  // Cambiamos la semilla cada 2 frames: grano vivo pero no epiléptico.
  const seed = Math.floor(frame / 2);

  return (
    <AbsoluteFill
      style={{
        opacity: 0.055,
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }}
    >
      <svg width="100%" height="100%">
        <filter id={`grain-${seed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves={2}
            seed={seed}
            stitchTiles="stitch"
          />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
      </svg>
    </AbsoluteFill>
  );
};

/** Viñeta: oscurece las esquinas y centra la mirada. */
const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        "radial-gradient(ellipse 75% 60% at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)",
      pointerEvents: "none",
    }}
  />
);

export const PostFX: React.FC = () => (
  <>
    <Vignette />
    <Grain />
  </>
);
