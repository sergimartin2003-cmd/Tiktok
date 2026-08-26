// =============================================================================
// theme.ts — TOKENS DE DISEÑO
// -----------------------------------------------------------------------------
// 🎨 ¿Quieres cambiar el COLOR DE ACENTO de todo el vídeo? Cambia UNA sola línea:
//    colors.accent  (más abajo). Todo lo demás se adapta solo.
// =============================================================================

import { loadFont } from "@remotion/google-fonts/Inter";

// Cargamos Inter (sans-serif geométrica) desde Google Fonts.
// loadFont() gestiona internamente la carga de la fuente en preview y render.
// Cargamos SOLO los pesos y el subset que usamos (latin) para que la carga sea
// rápida y ligera (menos peticiones de red al renderizar).
const { fontFamily } = loadFont("normal", {
  weights: ["500", "600", "700", "800"],
  subsets: ["latin"],
});

export const theme = {
  // Dimensiones del vídeo (vertical 9:16 para TikTok).
  video: {
    width: 1080,
    height: 1920,
  },

  colors: {
    background: "#0A0A0A", // casi negro
    text: "#F5F5F5", // blanco para texto principal
    muted: "#8A8A8A", // gris para texto de apoyo

    // 🎯 COLOR DE ACENTO — cámbialo aquí y se actualiza en todo el proyecto.
    // Verde ácido por defecto.
    accent: "#C6FF3D",

    // Rojo atenuado, se usa SOLO para el "−10 €" de la escena del margen.
    danger: "#C86B6B",
  },

  fonts: {
    // Familia tipográfica ya lista para usar en cualquier `fontFamily`.
    family: fontFamily,
  },

  // SAFE ZONES de TikTok: dejamos aire arriba (rótulos de la app) y bastante
  // abajo (botones de la interfaz + tu subtítulo/locución). Todo el texto
  // importante vive dentro de esta franja central segura.
  safe: {
    top: 120, // px libres arriba
    bottom: 420, // px libres abajo
    horizontal: 90, // margen lateral
  },
} as const;

// Peso alto para titulares en mayúsculas.
export const HEADING_WEIGHT = 800;
export const BODY_WEIGHT = 500;
