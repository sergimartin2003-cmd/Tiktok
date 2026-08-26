// =============================================================================
// Escena 2 — LA ATENCIÓN (13 s · 780 frames a 60 fps)
// -----------------------------------------------------------------------------
// Móvil dibujado en código con un feed de TikTok. El dedo hace scroll hacia
// arriba y FRENA EN SECO sobre el vídeo (spring de frenada) — ese es el momento
// "le paró el dedo": micro-zoom sobre el móvil y corazón encendido.
// El texto entra por bloques a un lado; "atención" lleva subrayado que se dibuja.
//
// ⏱️ Los `delay` están en FRAMES a 60 fps (60 = 1 segundo).
// =============================================================================

import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { SceneLayout } from "../components/SceneLayout";
import { PHONE_SCREEN_HEIGHT, PhoneTikTok } from "../mockups/PhoneTikTok";
import { Enter } from "../motion/Enter";
import { SplitText } from "../motion/SplitText";
import { useParallax, useProgress } from "../motion/hooks";
import { EASE, SPRING_BRAKE, accentGlow, theme } from "../theme";
import type { SceneProps } from "./types";

// Momento clave: cuándo empieza el swipe y cuándo ha frenado del todo.
const SWIPE_AT = 205;
const BRAKE_AT = 265;

/** El dedo: un círculo translúcido que empuja el feed hacia arriba. */
const Thumb: React.FC<{ y: number; opacity: number }> = ({ y, opacity }) => (
  <div
    style={{
      position: "absolute",
      left: 150,
      top: y,
      width: 92,
      height: 92,
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.16)",
      border: "2px solid rgba(255,255,255,0.35)",
      opacity,
      filter: "blur(0.5px)",
    }}
  />
);

export const Scene2Atencion: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drift = useParallax(durationInFrames, -30);

  // SCROLL CON FRENADA: arranca rápido y se detiene en seco sobre el vídeo B.
  const swipe = spring({
    frame: frame - SWIPE_AT,
    fps,
    config: SPRING_BRAKE,
    durationInFrames: 70,
  });
  const scrollY = interpolate(swipe, [0, 1], [0, -PHONE_SCREEN_HEIGHT]);

  // El dedo acompaña al scroll y luego se levanta.
  const thumbY = interpolate(swipe, [0, 1], [470, 210]);
  const thumbOpacity = interpolate(
    frame,
    [SWIPE_AT - 15, SWIPE_AT, BRAKE_AT, BRAKE_AT + 25],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // MICRO-ZOOM: marca el instante en que el dedo se para.
  const zoom = interpolate(
    frame,
    [BRAKE_AT - 10, BRAKE_AT + 12, BRAKE_AT + 70],
    [1, 1.06, 1.02],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE },
  );

  // El corazón se enciende justo después de frenar.
  const liked = useProgress(BRAKE_AT + 30, 20, EASE);

  // Subrayado de "atención".
  const underline = useProgress(500, 28, EASE);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <SceneLayout durationInFrames={durationInFrames}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 44,
            transform: `translateY(${drift}px)`,
          }}
        >
          {/* --- EL MÓVIL --------------------------------------------------- */}
          <div style={{ position: "relative" }}>
            <PhoneTikTok delay={0} scrollY={scrollY} liked={liked} zoom={zoom} />
            <Thumb y={thumbY} opacity={thumbOpacity} />
          </div>

          {/* --- EL TEXTO, POR BLOQUES -------------------------------------- */}
          <div
            style={{
              width: 480,
              textAlign: "left",
              display: "flex",
              flexDirection: "column",
              gap: 52,
            }}
          >
            <div style={{ fontSize: 46, fontWeight: 700, color: theme.colors.text, lineHeight: 1.25 }}>
              <SplitText
                text="Nadie llega solo a tu tienda."
                by="word"
                delay={60}
                stagger={4}
                y={18}
                blur={5}
              />
            </div>

            <div style={{ fontSize: 46, fontWeight: 700, color: theme.colors.text, lineHeight: 1.25 }}>
              <SplitText
                text="Llega porque un vídeo le paró el dedo."
                by="word"
                delay={165}
                stagger={4}
                y={18}
                blur={5}
              />
            </div>

            <Enter delay={400} y={22}>
              <div style={{ fontSize: 42, fontWeight: 600, color: theme.colors.muted, lineHeight: 1.3 }}>
                Esto no va de vender productos. Va de captar{" "}
                {/* La palabra clave: acento + subrayado que se dibuja */}
                <span style={{ position: "relative", display: "inline-block" }}>
                  <span
                    style={{
                      color: theme.colors.accent,
                      fontWeight: 800,
                      filter: accentGlow(0.6),
                    }}
                  >
                    atención
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      bottom: -8,
                      height: 4,
                      width: "100%",
                      backgroundColor: theme.colors.accent,
                      transform: `scaleX(${underline})`,
                      transformOrigin: "left",
                    }}
                  />
                </span>{" "}
                <span style={{ color: theme.colors.text, fontWeight: 700 }}>
                  y convertirla en compra.
                </span>
              </div>
            </Enter>
          </div>
        </div>
      </SceneLayout>
    </AbsoluteFill>
  );
};
