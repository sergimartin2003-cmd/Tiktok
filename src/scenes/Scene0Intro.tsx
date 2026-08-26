// =============================================================================
// Escena 0 — INTRO (≈ 7 s)
// Rótulo pequeño arriba · titular "E-COMMERCE" · subtítulo gris con el gancho
// "No lo es." que aparece con retardo y en color de acento.
// =============================================================================

import React from "react";
import { Reveal } from "../components/anim";
import { SafeZone } from "../components/SafeZone";
import { HEADING_WEIGHT, theme } from "../theme";

export const Scene0Intro: React.FC = () => {
  return (
    <SafeZone>
      {/* Rótulo pequeño superior */}
      <Reveal delay={0}>
        <div
          style={{
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: 5,
            color: theme.colors.muted,
            textTransform: "uppercase",
            marginBottom: 60,
          }}
        >
          Explicando modelos de negocio · Parte 1
        </div>
      </Reveal>

      {/* Titular grande */}
      <Reveal delay={8}>
        <div
          style={{
            fontSize: 132,
            fontWeight: HEADING_WEIGHT,
            letterSpacing: -3,
            color: theme.colors.text,
            textTransform: "uppercase",
            lineHeight: 1,
            marginBottom: 70,
            whiteSpace: "nowrap", // "E-COMMERCE" en una sola línea
          }}
        >
          E-commerce
        </div>
      </Reveal>

      {/* Subtítulo gris + gancho en acento */}
      <Reveal delay={22}>
        <div
          style={{
            fontSize: 46,
            fontWeight: 500,
            color: theme.colors.muted,
            lineHeight: 1.35,
            maxWidth: 820,
          }}
        >
          Todo el mundo cree que es montar una tienda bonita y esperar.{" "}
          {/* El gancho aparece más tarde y en color de acento */}
          <Reveal delay={55} y={0} style={{ display: "inline-block" }}>
            <span style={{ color: theme.colors.accent, fontWeight: 700 }}>
              No lo es.
            </span>
          </Reveal>
        </div>
      </Reveal>
    </SafeZone>
  );
};
