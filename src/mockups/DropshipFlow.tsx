// =============================================================================
// mockups/DropshipFlow.tsx — Mini-diagrama del dropshipping.
// Proveedor → flecha LARGA y LENTA → cliente. La lentitud es intencionada:
// es lo que transmite "tarda y pierdes el control".
// =============================================================================

import React from "react";
import { interpolate } from "remotion";
import { EASE, theme } from "../theme";
import { useEnter, useProgress } from "../motion/hooks";

const W = 400;
const H = 120;

/** Icono de proveedor: nave/almacén. */
const SupplierIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={46} height={46} viewBox="0 0 24 24" fill="none">
    <path d="M3 10 L12 4 L21 10 V21 H3 Z" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
    <path d="M9 21 v-6 h6 v6" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
  </svg>
);

/** Icono de cliente: persona. */
const CustomerIcon: React.FC<{ color: string }> = ({ color }) => (
  <svg width={46} height={46} viewBox="0 0 24 24" fill="none">
    <circle cx={12} cy={8} r={3.6} stroke={color} strokeWidth={1.8} />
    <path d="M4.5 20.5 a7.5 7.5 0 0 1 15 0" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
  </svg>
);

export const DropshipFlow: React.FC<{
  delay?: number;
  /** Frames que tarda la flecha en dibujarse. Cuanto más alto, más "lento". */
  travelDuration?: number;
}> = ({ delay = 0, travelDuration = 160 }) => {
  const enter = useEnter(delay);

  // La flecha se dibuja MUY despacio: ahí está el mensaje.
  const draw = useProgress(delay + 20, travelDuration, EASE);

  const startX = 58;
  const endX = W - 58;
  const y = H / 2;
  const packageX = interpolate(draw, [0, 1], [startX, endX]);

  return (
    <div
      style={{
        width: W,
        height: H,
        position: "relative",
        opacity: interpolate(enter, [0, 1], [0, 1]),
      }}
    >
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {/* Carril de fondo */}
        <line
          x1={startX}
          y1={y}
          x2={endX}
          y2={y}
          stroke={theme.colors.line}
          strokeWidth={2}
          strokeDasharray="5 6"
        />
        {/* Recorrido ya hecho */}
        <line
          x1={startX}
          y1={y}
          x2={packageX}
          y2={y}
          stroke={theme.colors.muted}
          strokeWidth={2.5}
        />
        {/* El paquete, viajando despacio */}
        <rect
          x={packageX - 9}
          y={y - 9}
          width={18}
          height={18}
          rx={3}
          fill={theme.colors.muted}
          opacity={draw > 0.02 && draw < 0.99 ? 1 : 0.35}
        />
        {/* Punta de flecha */}
        <path
          d={`M${endX - 10},${y - 7} L${endX},${y} L${endX - 10},${y + 7}`}
          stroke={theme.colors.muted}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={draw}
        />
      </svg>

      {/* Iconos en los extremos */}
      <div style={{ position: "absolute", left: 0, top: y - 23 }}>
        <SupplierIcon color={theme.colors.muted} />
      </div>
      <div style={{ position: "absolute", right: 0, top: y - 23 }}>
        <CustomerIcon color={draw > 0.95 ? theme.colors.text : theme.colors.muted} />
      </div>

      {/* Etiquetas */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          fontSize: 17,
          fontWeight: 600,
          color: theme.colors.muted,
        }}
      >
        Proveedor
      </div>
      <div
        style={{
          position: "absolute",
          right: 4,
          bottom: 0,
          fontSize: 17,
          fontWeight: 600,
          color: theme.colors.muted,
        }}
      >
        Cliente
      </div>
    </div>
  );
};
