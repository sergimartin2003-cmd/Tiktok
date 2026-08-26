// =============================================================================
// Root.tsx — Registro de la composición única "EcommercePart1"
// -----------------------------------------------------------------------------
// La duración total se DERIVA de timing.ts (suma de las duraciones por escena),
// nunca está hardcodeada. Cambia los segundos en timing.ts y la duración de la
// composición se ajusta sola.
// =============================================================================

import React from "react";
import { Composition } from "remotion";
import { EcommercePart1 } from "./Composition";
import { theme } from "./theme";
import { FPS, totalDurationInFrames } from "./timing";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="EcommercePart1"
      component={EcommercePart1}
      durationInFrames={totalDurationInFrames}
      fps={FPS}
      width={theme.video.width}
      height={theme.video.height}
    />
  );
};
