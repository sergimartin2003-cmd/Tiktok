// =============================================================================
// Escena 4 — NINGÚN PRODUCTO DURA (12 s · 720 frames a 60 fps)
// -----------------------------------------------------------------------------
// Titular con entrada potente (palabra a palabra + punch) · gráfica del ciclo
// de vida que se dibuja sola con área de acento y etiquetas en el pico y en la
// caída · dos líneas de texto secuenciales.
//
// ⏱️ Los `delay` están en FRAMES a 60 fps (60 = 1 segundo).
// =============================================================================

import React from "react";
import { AbsoluteFill } from "remotion";
import { LifecycleChart } from "../components/LifecycleChart";
import { SceneLayout } from "../components/SceneLayout";
import { Enter } from "../motion/Enter";
import { SplitText } from "../motion/SplitText";
import { useParallax } from "../motion/hooks";
import { SPRING_PUNCH, theme } from "../theme";
import type { SceneProps } from "./types";

export const Scene4Ciclo: React.FC<SceneProps> = ({ durationInFrames }) => {
  const drift = useParallax(durationInFrames, -28);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <SceneLayout durationInFrames={durationInFrames}>
        <div style={{ transform: `translateY(${drift}px)` }}>
          {/* Titular: entrada potente, palabra a palabra */}
          <div
            style={{
              fontSize: 88,
              fontWeight: 900,
              textTransform: "uppercase",
              letterSpacing: -2,
              color: theme.colors.text,
              lineHeight: 1.02,
              marginBottom: 34,
            }}
          >
            <SplitText
              text="Ningún producto dura."
              by="word"
              delay={0}
              stagger={6}
              y={44}
              blur={12}
              config={SPRING_PUNCH}
            />
          </div>

          {/* La gráfica del ciclo de vida */}
          <Enter delay={60} y={24}>
            <LifecycleChart delay={85} drawDuration={190} />
          </Enter>

          {/* Texto secuencial */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 34,
              maxWidth: 860,
              marginTop: 18,
            }}
          >
            <div
              style={{
                fontSize: 42,
                fontWeight: 500,
                color: theme.colors.muted,
                lineHeight: 1.3,
              }}
            >
              <SplitText
                text="El que hoy funciona, en dos meses lo copia todo el mundo."
                by="word"
                delay={400}
                stagger={4}
                y={18}
                blur={5}
              />
            </div>

            <div
              style={{
                fontSize: 46,
                fontWeight: 700,
                color: theme.colors.text,
                lineHeight: 1.3,
              }}
            >
              <SplitText
                text="Esto no se monta una vez. Se ajusta cada semana."
                by="word"
                delay={520}
                stagger={4}
                y={18}
                blur={5}
              />
            </div>
          </div>
        </div>
      </SceneLayout>
    </AbsoluteFill>
  );
};
