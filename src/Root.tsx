// =============================================================================
// Root.tsx — Composiciones registradas.
// -----------------------------------------------------------------------------
// 1) "EcommercePart1"  → el vídeo final completo (lo que renderizas).
// 2) "S0-Intro", "S1-Margen", ...  → una composición POR ESCENA, para poder
//    validar cada escena aislada en el Studio sin esperar a toda la pieza.
//
// Todas las duraciones se derivan de timing.ts. Nada hardcodeado.
// =============================================================================

import React from "react";
import { AbsoluteFill, Composition } from "remotion";
import { EcommercePart1 } from "./Composition";
import { PostFX } from "./components/PostFX";
import { SCENES } from "./scenes/registry";
import { theme } from "./theme";
import { FPS, sceneDurationsInFrames, totalDurationInFrames } from "./timing";

/** Envoltorio de preview: una escena sola, con su fondo y su post. */
const ScenePreview: React.FC<{ sceneIndex: number }> = ({ sceneIndex }) => {
  const Scene = SCENES[sceneIndex].component;
  const duration = sceneDurationsInFrames[sceneIndex];

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <Scene durationInFrames={duration} />
      <PostFX />
    </AbsoluteFill>
  );
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ---- EL VÍDEO FINAL ---------------------------------------------- */}
      <Composition
        id="EcommercePart1"
        component={EcommercePart1}
        durationInFrames={totalDurationInFrames}
        fps={FPS}
        width={theme.video.width}
        height={theme.video.height}
      />

      {/* ---- PREVIEW POR ESCENA (para validar una a una) ------------------ */}
      {SCENES.map((scene, index) => (
        <Composition
          key={scene.id}
          id={scene.id}
          component={ScenePreview}
          defaultProps={{ sceneIndex: index }}
          durationInFrames={sceneDurationsInFrames[index]}
          fps={FPS}
          width={theme.video.width}
          height={theme.video.height}
        />
      ))}
    </>
  );
};
