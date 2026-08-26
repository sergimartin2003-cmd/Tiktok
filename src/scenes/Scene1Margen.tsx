// =============================================================================
// Escena 1 — EL MARGEN (≈ 13 s) · la escena estrella
// "El producto no es el negocio." · la cuenta del margen aparece por pasos
// con números que cuentan (count-up) · cierre con la línea destacada.
// =============================================================================

import React from "react";
import type { SceneProps } from "./types";
import { Reveal, useCountUp } from "../components/anim";
import { SafeZone } from "../components/SafeZone";
import { theme } from "../theme";

// Formatea en euros usando el signo menos tipográfico (−) para los negativos.
const formatEuro = (value: number): string => {
  if (value < 0) {
    return `−${Math.abs(value)} €`;
  }
  return `${value} €`;
};

// Una fila de la cuenta: etiqueta a la izquierda, importe (count-up) a la derecha.
const MarginRow: React.FC<{
  label: string;
  amount: number;
  delay: number;
  color: string;
}> = ({ label, amount, delay, color }) => {
  const value = useCountUp(amount, delay, 22);
  return (
    <Reveal delay={delay}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          width: 640,
          padding: "18px 0",
          borderBottom: `2px solid rgba(255,255,255,0.07)`,
        }}
      >
        <span
          style={{
            fontSize: 44,
            fontWeight: 500,
            color: theme.colors.muted,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontSize: 62,
            fontWeight: 800,
            color,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatEuro(value)}
        </span>
      </div>
    </Reveal>
  );
};

export const Scene1Margen: React.FC<SceneProps> = () => {
  return (
    <SafeZone>
      {/* Frase de apoyo */}
      <Reveal delay={0}>
        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: theme.colors.text,
            marginBottom: 70,
          }}
        >
          El producto no es el negocio.
        </div>
      </Reveal>

      {/* La cuenta del margen, paso a paso */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <MarginRow label="Coste" amount={8} delay={20} color={theme.colors.text} />
        <MarginRow label="Venta" amount={29} delay={50} color={theme.colors.text} />
        <MarginRow
          label="Margen"
          amount={21}
          delay={85}
          color={theme.colors.accent}
        />
        {/* El −10 € en rojo atenuado */}
        <MarginRow
          label="Publicidad"
          amount={-10}
          delay={120}
          color={theme.colors.danger}
        />
      </div>

      {/* Línea de cierre destacada */}
      <Reveal delay={175}>
        <div
          style={{
            marginTop: 80,
            fontSize: 40,
            fontWeight: 600,
            color: theme.colors.text,
            lineHeight: 1.4,
            maxWidth: 760,
          }}
        >
          Comprar barato · Vender caro ·{" "}
          <span style={{ color: theme.colors.accent }}>
            Saber cuánto gastar en que te vean
          </span>
        </div>
      </Reveal>
    </SafeZone>
  );
};
