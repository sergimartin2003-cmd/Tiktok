// =============================================================================
// Escena 4 — NINGÚN PRODUCTO DURA (≈ 12 s)
// Titular · dos líneas secuenciales · una curva sutil que sube y luego cae
// (el ciclo de vida de un producto ganador). Nada recargado.
// =============================================================================

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { Reveal } from "../components/anim";
import { SafeZone } from "../components/SafeZone";
import { theme } from "../theme";

// Curva sube-y-baja dibujada con animación de trazo (strokeDashoffset).
const LifecycleCurve: React.FC<{ delay: number }> = ({ delay }) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [delay, delay + 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={720} height={180} viewBox="0 0 720 180" fill="none">
      {/* Línea base tenue */}
      <line
        x1={0}
        y1={150}
        x2={720}
        y2={150}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={2}
      />
      {/* La curva: sube hasta el pico y vuelve a caer */}
      <path
        d="M0,150 C 180,150 210,30 360,30 C 510,30 540,150 720,150"
        stroke={theme.colors.accent}
        strokeWidth={5}
        strokeLinecap="round"
        pathLength={1}
        strokeDasharray={1}
        strokeDashoffset={1 - progress}
      />
    </svg>
  );
};

export const Scene4Ciclo: React.FC = () => {
  return (
    <SafeZone>
      {/* Titular */}
      <Reveal delay={0}>
        <div
          style={{
            fontSize: 92,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: -1,
            color: theme.colors.text,
            marginBottom: 60,
          }}
        >
          Ningún producto dura.
        </div>
      </Reveal>

      {/* La curva del ciclo de vida */}
      <Reveal delay={30} style={{ marginBottom: 60 }}>
        <LifecycleCurve delay={40} />
      </Reveal>

      {/* Líneas secuenciales */}
      <div style={{ display: "flex", flexDirection: "column", gap: 40, maxWidth: 820 }}>
        <Reveal delay={95}>
          <div style={{ fontSize: 44, fontWeight: 500, color: theme.colors.muted, lineHeight: 1.35 }}>
            El que hoy funciona, en dos meses lo copia todo el mundo.
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div style={{ fontSize: 46, fontWeight: 700, color: theme.colors.text, lineHeight: 1.35 }}>
            Esto no se monta una vez. Se ajusta cada semana.
          </div>
        </Reveal>
      </div>
    </SafeZone>
  );
};
