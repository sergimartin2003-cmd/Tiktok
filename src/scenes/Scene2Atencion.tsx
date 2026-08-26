// =============================================================================
// Escena 2 — LA ATENCIÓN (≈ 13 s)
// Tres bloques de texto que entran uno a uno. La palabra "atención" se resalta
// en color de acento cada vez que aparece.
// =============================================================================

import React from "react";
import type { SceneProps } from "./types";
import { Reveal } from "../components/anim";
import { SafeZone } from "../components/SafeZone";
import { theme } from "../theme";

// Resalta la palabra "atención" (en color de acento) dentro de un texto.
const Highlight: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(atención)/gi);
  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === "atención" ? (
          <span key={index} style={{ color: theme.colors.accent, fontWeight: 800 }}>
            {part}
          </span>
        ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
        ),
      )}
    </>
  );
};

const blocks: string[] = [
  "Nadie llega solo a tu tienda.",
  "Llega porque un vídeo le paró el dedo.",
  "Esto no va de vender productos. Va de captar atención y convertirla en compra.",
];

export const Scene2Atencion: React.FC<SceneProps> = () => {
  return (
    <SafeZone justify="center">
      <div style={{ display: "flex", flexDirection: "column", gap: 56, maxWidth: 840 }}>
        {blocks.map((block, index) => (
          <Reveal key={index} delay={10 + index * 70}>
            <div
              style={{
                fontSize: index === 2 ? 50 : 56,
                fontWeight: 700,
                color: theme.colors.text,
                lineHeight: 1.3,
              }}
            >
              <Highlight text={block} />
            </div>
          </Reveal>
        ))}
      </div>
    </SafeZone>
  );
};
