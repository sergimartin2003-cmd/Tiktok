// =============================================================================
// SafeZone.tsx — Contenedor que respeta las SAFE ZONES de TikTok.
// Deja aire arriba (theme.safe.top) y mucho aire abajo (theme.safe.bottom,
// donde van los botones de la app y tu subtítulo), y centra el contenido
// importante en la franja segura.
// =============================================================================

import React from "react";
import { AbsoluteFill } from "remotion";
import { theme } from "../theme";

export const SafeZone: React.FC<{
  children: React.ReactNode;
  justify?: React.CSSProperties["justifyContent"];
}> = ({ children, justify = "center" }) => {
  return (
    <AbsoluteFill
      style={{
        paddingTop: theme.safe.top,
        paddingBottom: theme.safe.bottom,
        paddingLeft: theme.safe.horizontal,
        paddingRight: theme.safe.horizontal,
        display: "flex",
        flexDirection: "column",
        justifyContent: justify,
        alignItems: "center",
        textAlign: "center",
        fontFamily: theme.fonts.family,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
