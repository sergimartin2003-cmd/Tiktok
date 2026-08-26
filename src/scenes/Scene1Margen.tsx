// =============================================================================
// Escena 1 — EL MARGEN (13 s · 780 frames a 60 fps) · LA ESCENA ESTRELLA
// -----------------------------------------------------------------------------
// Tarjeta de producto flotante + HUD financiero que se construye por pasos con
// dígitos rodando (odómetro) + barra que RECALCULA el margen real al restar la
// publicidad + remate palabra a palabra.
//
// ⏱️ Los `delay` están en FRAMES a 60 fps (60 = 1 segundo).
// =============================================================================

import React from "react";
import { AbsoluteFill, interpolate } from "remotion";
import { SceneLayout } from "../components/SceneLayout";
import { ProductCard } from "../mockups/ProductCard";
import { Enter } from "../motion/Enter";
import { Odometer } from "../motion/Odometer";
import { SplitText } from "../motion/SplitText";
import { useEnter, useParallax, useProgress } from "../motion/hooks";
import { EASE, accentGlow, theme } from "../theme";
import type { SceneProps } from "./types";

// --- Cifras del ejemplo (cambia aquí si quieres otros números) --------------
const COSTE = 8;
const VENTA = 29;
const MARGEN = 21;
const PUBLICIDAD = 10;
const MARGEN_REAL = MARGEN - PUBLICIDAD;

/** Una fila del HUD: etiqueta a la izquierda, importe con odómetro a la derecha. */
const HudRow: React.FC<{
  label: string;
  amount: number;
  delay: number;
  color: string;
  /** Entra cayendo desde arriba (la publicidad "cae" del margen). */
  fromAbove?: boolean;
  glow?: boolean;
}> = ({ label, amount, delay, color, fromAbove = false, glow = false }) => (
  <Enter delay={delay} y={fromAbove ? -54 : 40}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        width: 520,
        padding: "12px 0",
        borderBottom: `2px solid ${theme.colors.line}`,
      }}
    >
      <span
        style={{
          fontSize: 32,
          fontWeight: 600,
          color: theme.colors.muted,
          textTransform: "uppercase",
          letterSpacing: 2,
          paddingBottom: 8,
        }}
      >
        {label}
      </span>
      <Odometer
        target={amount}
        delay={delay + 4}
        duration={38}
        fontSize={58}
        suffix=" €"
        style={{
          fontWeight: 800,
          color,
          filter: glow ? accentGlow(0.8) : undefined,
        }}
      />
    </div>
  </Enter>
);

/**
 * Barra del margen: representa la VENTA completa. El coste ocupa su parte y el
 * margen el resto. Cuando entra la publicidad, el margen SE ENCOGE en directo.
 */
const MarginBar: React.FC<{ delay: number; shrinkAt: number }> = ({
  delay,
  shrinkAt,
}) => {
  const enter = useEnter(delay);
  const shrink = useProgress(shrinkAt, 40, EASE);

  const WIDTH = 880;
  const unit = WIDTH / VENTA;

  const costWidth = COSTE * unit;
  const marginWidth = interpolate(shrink, [0, 1], [MARGEN, MARGEN_REAL]) * unit;
  const adsWidth = interpolate(shrink, [0, 1], [0, PUBLICIDAD]) * unit;

  return (
    <div
      style={{
        width: WIDTH,
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(enter, [0, 1], [26, 0])}px)`,
      }}
    >
      <div
        style={{
          display: "flex",
          height: 26,
          borderRadius: 13,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Lo que te cuesta el producto */}
        <div style={{ width: costWidth, backgroundColor: "#2E2E2E" }} />
        {/* Tu margen (se encoge al pagar publicidad) */}
        <div
          style={{
            width: marginWidth,
            backgroundColor: theme.colors.accent,
            filter: accentGlow(0.5),
          }}
        />
        {/* Lo que se lleva la publicidad */}
        <div style={{ width: adsWidth, backgroundColor: theme.colors.danger }} />
      </div>

      {/* Etiqueta del margen REAL, cuando ya se ha recalculado */}
      <div
        style={{
          marginTop: 16,
          fontSize: 34,
          fontWeight: 700,
          color: theme.colors.text,
          opacity: shrink,
        }}
      >
        Margen real{" "}
        <span style={{ color: theme.colors.accent }}>{MARGEN_REAL} €</span>
      </div>
    </div>
  );
};

export const Scene1Margen: React.FC<SceneProps> = ({ durationInFrames }) => {
  const drift = useParallax(durationInFrames, -26);

  // La línea que conecta los importes con el margen.
  const connector = useProgress(200, 46, EASE);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <SceneLayout durationInFrames={durationInFrames}>
        <div style={{ transform: `translateY(${drift}px)` }}>
          {/* Frase de apoyo */}
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: theme.colors.text,
              marginBottom: 42,
            }}
          >
            <SplitText
              text="El producto no es el negocio."
              by="word"
              delay={0}
              stagger={4}
              y={20}
              blur={6}
            />
          </div>

          {/* Producto + cuenta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 40,
              marginBottom: 44,
            }}
          >
            <ProductCard delay={30} />

            <div style={{ position: "relative" }}>
              {/* Conector vertical: enlaza los importes con el margen */}
              <div
                style={{
                  position: "absolute",
                  left: -26,
                  top: 60,
                  width: 3,
                  height: 190,
                  backgroundColor: theme.colors.accent,
                  transform: `scaleY(${connector})`,
                  transformOrigin: "top",
                  opacity: 0.55,
                }}
              />

              <HudRow
                label="Coste"
                amount={COSTE}
                delay={100}
                color={theme.colors.text}
              />
              <HudRow
                label="Venta"
                amount={VENTA}
                delay={170}
                color={theme.colors.text}
              />
              <HudRow
                label="Margen"
                amount={MARGEN}
                delay={250}
                color={theme.colors.accent}
                glow
              />
              <HudRow
                label="Publicidad"
                amount={-PUBLICIDAD}
                delay={330}
                color={theme.colors.danger}
                fromAbove
              />
            </div>
          </div>

          {/* La barra recalcula el margen real en directo */}
          <MarginBar delay={400} shrinkAt={455} />

          {/* Remate, palabra a palabra */}
          <div
            style={{
              marginTop: 48,
              fontSize: 38,
              fontWeight: 600,
              color: theme.colors.text,
              lineHeight: 1.4,
              maxWidth: 860,
            }}
          >
            <SplitText
              text="Comprar barato · Vender caro ·"
              by="word"
              delay={560}
              stagger={5}
              y={16}
              blur={4}
            />{" "}
            <span style={{ color: theme.colors.accent }}>
              <SplitText
                text="Saber cuánto gastar en que te vean"
                by="word"
                delay={600}
                stagger={5}
                y={16}
                blur={4}
              />
            </span>
          </div>
        </div>
      </SceneLayout>
    </AbsoluteFill>
  );
};
