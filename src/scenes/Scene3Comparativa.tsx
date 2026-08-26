// =============================================================================
// Escena 3 — DROPSHIPPING vs STOCK (≈ 12 s)
// Comparativa en dos columnas que se dibujan. La columna B (STOCK PROPIO) se
// ilumina al final: es la conclusión.
// =============================================================================

import React from "react";
import type { SceneProps } from "./types";
import { interpolate, useCurrentFrame } from "remotion";
import { Reveal } from "../components/anim";
import { SafeZone } from "../components/SafeZone";
import { theme } from "../theme";

const Column: React.FC<{
  title: string;
  items: string[];
  baseDelay: number;
  illumination: number; // 0 → 1, cuánto está iluminada la columna
}> = ({ title, items, baseDelay, illumination }) => {
  // La iluminación mezcla el borde y el título hacia el color de acento.
  const borderOpacity = interpolate(illumination, [0, 1], [0.08, 1]);
  const titleColor = illumination > 0.5 ? theme.colors.accent : theme.colors.text;
  const glow = interpolate(illumination, [0, 1], [0, 40]);

  return (
    <div
      style={{
        flex: 1,
        padding: "40px 34px",
        borderRadius: 20,
        border: `2px solid rgba(198,255,61,${borderOpacity})`,
        boxShadow: `0 0 ${glow}px rgba(198,255,61,${illumination * 0.35})`,
        display: "flex",
        flexDirection: "column",
        gap: 26,
      }}
    >
      <Reveal delay={baseDelay}>
        <div
          style={{
            fontSize: 40,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
            color: titleColor,
            marginBottom: 10,
          }}
        >
          {title}
        </div>
      </Reveal>
      {items.map((item, index) => (
        <Reveal key={index} delay={baseDelay + 18 + index * 18} y={16}>
          <div
            style={{
              fontSize: 34,
              fontWeight: 500,
              color: theme.colors.muted,
              lineHeight: 1.3,
              textAlign: "left",
            }}
          >
            {item}
          </div>
        </Reveal>
      ))}
    </div>
  );
};

export const Scene3Comparativa: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();

  // La columna B se ilumina hacia el final de la escena.
  const illumination = interpolate(frame, [230, 265], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SafeZone>
      <div style={{ display: "flex", gap: 34, width: "100%", alignItems: "stretch" }}>
        <Column
          title="Dropshipping"
          items={[
            "Sin stock",
            "El proveedor envía",
            "Empiezas sin arriesgar",
            "Pero tarda y pierdes control",
          ]}
          baseDelay={10}
          illumination={0}
        />
        <Column
          title="Stock propio"
          items={[
            "Compras tú",
            "Guardas tú",
            "Envías en un día",
            "El cliente vuelve",
          ]}
          baseDelay={110}
          illumination={illumination}
        />
      </div>
    </SafeZone>
  );
};
