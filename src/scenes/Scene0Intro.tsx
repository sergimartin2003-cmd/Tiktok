// =============================================================================
// Escena 0 — INTRO (7 s · 420 frames a 60 fps)
// -----------------------------------------------------------------------------
// Rejilla editorial que se dibuja y se atenúa · rótulo con wipe · "E-COMMERCE"
// letra a letra saliendo de desenfoque + destello de acento · subtítulo por
// palabras y, con retardo dramático, "No lo es." con punch scale.
//
// ⏱️ Los `delay` están en FRAMES a 60 fps (60 = 1 segundo).
// =============================================================================

import React from "react";
import { AbsoluteFill } from "remotion";
import { EditorialGrid } from "../components/EditorialGrid";
import { SceneLayout } from "../components/SceneLayout";
import { Enter } from "../motion/Enter";
import { LightSweep } from "../motion/LightSweep";
import { SplitText } from "../motion/SplitText";
import { Wipe } from "../motion/Wipe";
import { useParallax } from "../motion/hooks";
import { HEADING_WEIGHT, SPRING_PUNCH, accentGlow, theme } from "../theme";

export const Scene0Intro: React.FC<{ durationInFrames: number }> = ({
  durationInFrames,
}) => {
  // Primer plano: se desplaza MÁS que la rejilla del fondo (profundidad).
  const foreground = useParallax(durationInFrames, -34);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* --- CAPA DE FONDO: rejilla editorial con parallax --------------- */}
      <EditorialGrid durationInFrames={durationInFrames} delay={0} />

      {/* --- CAPA DE PRIMER PLANO --------------------------------------- */}
      <SceneLayout durationInFrames={durationInFrames}>
        <div style={{ transform: `translateY(${foreground}px)` }}>
          {/* Rótulo superior: se destapa de izquierda a derecha */}
          <Wipe delay={10} duration={34} direction="left">
            <div
              style={{
                fontSize: 30,
                fontWeight: 600,
                letterSpacing: 5,
                color: theme.colors.muted,
                textTransform: "uppercase",
                marginBottom: 54,
                whiteSpace: "nowrap",
              }}
            >
              Explicando modelos de negocio · Parte 1
            </div>
          </Wipe>

          {/* Titular: letra a letra, saliendo de desenfoque, + light sweep */}
          <LightSweep delay={100} duration={55}>
            <SplitText
              text="E-COMMERCE"
              by="char"
              delay={40}
              stagger={3}
              y={40}
              blur={14}
              style={{
                display: "block",
                fontSize: 132,
                fontWeight: HEADING_WEIGHT,
                letterSpacing: -3,
                color: theme.colors.text,
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            />
          </LightSweep>

          {/* Subtítulo por palabras */}
          <div
            style={{
              marginTop: 56,
              fontSize: 46,
              fontWeight: 500,
              color: theme.colors.muted,
              lineHeight: 1.35,
              maxWidth: 820,
            }}
          >
            <SplitText
              text="Todo el mundo cree que es montar una tienda bonita y esperar."
              by="word"
              delay={120}
              stagger={4}
              y={18}
              blur={5}
            />
          </div>

          {/* EL GANCHO: retardo dramático + punch scale + glow de acento */}
          <Enter
            delay={215}
            y={0}
            scale={0.72}
            config={SPRING_PUNCH}
            style={{ marginTop: 34 }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 900,
                letterSpacing: -1,
                color: theme.colors.accent,
                filter: accentGlow(1),
              }}
            >
              No lo es.
            </div>
          </Enter>
        </div>
      </SceneLayout>
    </AbsoluteFill>
  );
};
