// =============================================================================
// Escena 5 — CIERRE (6 s · 360 frames a 60 fps)
// -----------------------------------------------------------------------------
// Ritmo rápido de remate: tres líneas con punch scale y un flash de acento al
// entrar. Después todo se funde y queda la frase final, que entra grande con
// light sweep y se QUEDA FIJA el último segundo (freeze de cierre).
//
// ⏱️ Los `delay` están en FRAMES a 60 fps (60 = 1 segundo).
// =============================================================================

import React from "react";
import { AbsoluteFill, interpolate, interpolateColors, useCurrentFrame } from "remotion";
import { SceneLayout } from "../components/SceneLayout";
import { Enter } from "../motion/Enter";
import { LightSweep } from "../motion/LightSweep";
import { EASE, SPRING_PUNCH, accentGlow, theme } from "../theme";
import type { SceneProps } from "./types";

// Momentos clave
const FADE_LINES_AT = 150; // las tres líneas se funden
const FINAL_AT = 178; // entra la frase final
const FREEZE_FRAMES = 60; // último segundo congelado

const PUNCHLINES = [
  { text: "Compra barato.", delay: 12, keepAccent: false },
  { text: "Vende con margen.", delay: 46, keepAccent: false },
  { text: "Domina la atención.", delay: 80, keepAccent: true },
];

/** Línea de remate: entra con punch y un flash de acento que se apaga. */
const PunchLine: React.FC<{
  text: string;
  delay: number;
  keepAccent: boolean;
}> = ({ text, delay, keepAccent }) => {
  const frame = useCurrentFrame();

  // FLASH DE ACENTO: entra en verde y se asienta en blanco.
  // (la tercera línea se queda en acento: es la conclusión)
  const color = keepAccent
    ? theme.colors.accent
    : interpolateColors(
        frame,
        [delay, delay + 20],
        [theme.colors.accent, theme.colors.text],
      );

  const glow = interpolate(frame, [delay, delay + 24], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <Enter delay={delay} y={0} scale={0.78} config={SPRING_PUNCH}>
      <div
        style={{
          fontSize: 66,
          fontWeight: 900,
          textTransform: "uppercase",
          letterSpacing: -1,
          color,
          filter: accentGlow(keepAccent ? 0.9 : glow),
        }}
      >
        {text}
      </div>
    </Enter>
  );
};

export const Scene5Cierre: React.FC<SceneProps> = ({ durationInFrames }) => {
  const frame = useCurrentFrame();

  // Las tres líneas se funden para dejar sola a la frase final.
  const linesOpacity = interpolate(
    frame,
    [FADE_LINES_AT, FADE_LINES_AT + 26],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: EASE },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* El push se detiene antes del final: el último segundo queda FIJO. */}
      <SceneLayout
        durationInFrames={durationInFrames}
        pushTo={1.03}
        pushOverFrames={durationInFrames - FREEZE_FRAMES}
      >
        <div style={{ position: "relative", width: "100%" }}>
          {/* --- Las tres líneas de remate ------------------------------- */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 18,
              alignItems: "center",
              opacity: linesOpacity,
            }}
          >
            {PUNCHLINES.map((line) => (
              <PunchLine
                key={line.text}
                text={line.text}
                delay={line.delay}
                keepAccent={line.keepAccent}
              />
            ))}
          </div>

          {/* --- La frase final: entra y SE QUEDA ------------------------- */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Enter delay={FINAL_AT} y={26} scale={0.9}>
              <LightSweep delay={FINAL_AT + 34} duration={60}>
                <div
                  style={{
                    fontSize: 84,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    letterSpacing: -2,
                    color: theme.colors.text,
                    lineHeight: 1.08,
                    maxWidth: 880,
                  }}
                >
                  Lo demás es decoración.
                </div>
              </LightSweep>
            </Enter>
          </div>
        </div>
      </SceneLayout>
    </AbsoluteFill>
  );
};
