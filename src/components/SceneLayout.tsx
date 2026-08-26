// =============================================================================
// components/SceneLayout.tsx — Envoltorio de escena.
// 1) Respeta las SAFE ZONES de TikTok (aire arriba y abajo).
// 2) Aplica el CAMERA PUSH: toda la escena escala muy levemente durante su
//    duración, para que la imagen nunca esté quieta.
// =============================================================================

import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";
import { useCameraPush } from "../motion/hooks";

export const SceneLayout: React.FC<{
  /** Duración de la escena en frames (viene de timing.ts). */
  durationInFrames: number;
  justify?: React.CSSProperties["justifyContent"];
  /** Escala final del camera push. */
  pushTo?: number;
  /**
   * Frames durante los que se aplica el push. Por defecto, toda la escena.
   * Ponlo más corto para CONGELAR la imagen al final (freeze de cierre).
   */
  pushOverFrames?: number;
  children: React.ReactNode;
}> = ({
  durationInFrames,
  justify = "center",
  pushTo = 1.04,
  pushOverFrames,
  children,
}) => {
  const scale = useCameraPush(pushOverFrames ?? durationInFrames, 1, pushTo);

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, willChange: "transform" }}>
      <AbsoluteFill
        style={{
          paddingTop: theme.safe.top,
          paddingBottom: theme.safe.bottom,
          paddingLeft: theme.safe.horizontal,
          paddingRight: theme.safe.horizontal,
          display: "flex",
          flexDirection: "column",
          justifyContent: justify,
          alignItems: "center",
          textAlign: "center",
          fontFamily: theme.fonts.family,
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
