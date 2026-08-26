// =============================================================================
// Escena 5 — CIERRE (≈ 6 s)
// Tres líneas de remate en secuencia rápida · frase final grande
// "Lo demás es decoración." que queda FIJA el último segundo (freeze de cierre).
// =============================================================================

import React from "react";
import { Reveal } from "../components/anim";
import { SafeZone } from "../components/SafeZone";
import { theme } from "../theme";

const punchlines: { text: string; accent?: boolean }[] = [
  { text: "Compra barato." },
  { text: "Vende con margen." },
  { text: "Domina la atención.", accent: true },
];

export const Scene5Cierre: React.FC = () => {
  return (
    <SafeZone>
      {/* Tres líneas de remate, ritmo rápido */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24, marginBottom: 80 }}>
        {punchlines.map((line, index) => (
          <Reveal key={index} delay={5 + index * 16} y={18}>
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: -0.5,
                color: line.accent ? theme.colors.accent : theme.colors.text,
              }}
            >
              {line.text}
            </div>
          </Reveal>
        ))}
      </div>

      {/* Frase final grande — aparece y se queda fija hasta el final. */}
      <Reveal delay={60}>
        <div
          style={{
            fontSize: 78,
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: -1,
            color: theme.colors.text,
            lineHeight: 1.1,
            maxWidth: 860,
          }}
        >
          Lo demás es decoración.
        </div>
      </Reveal>
    </SafeZone>
  );
};
