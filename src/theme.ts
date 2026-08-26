// =============================================================================
// theme.ts — TOKENS DE DISEÑO
// -----------------------------------------------------------------------------
// 🎨 ¿Quieres cambiar el COLOR DE ACENTO de todo el vídeo? Cambia UNA sola línea:
//    colors.accent  (más abajo). Todo lo demás (glows, subrayados, gráficas,
//    columnas iluminadas...) se adapta solo.
// =============================================================================

import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

// Cargamos Inter (sans-serif geométrica) desde Google Fonts.
// Solo los pesos y el subset que usamos (latin): menos peticiones al renderizar.
const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const theme = {
  video: {
    width: 1080,
    height: 1920,
  },

  colors: {
    background: "#0A0A0A", // casi negro
    text: "#F5F5F5", // blanco para texto principal
    muted: "#8A8A8A", // gris para texto de apoyo
    line: "rgba(255,255,255,0.09)", // hairlines / rejilla

    // 🎯 COLOR DE ACENTO — cámbialo aquí y se actualiza en todo el proyecto.
    accent: "#C6FF3D",

    // Rojo atenuado: solo para lo negativo (el "−10 €", "pierdes control").
    danger: "#C86B6B",

    surface: "#141414", // superficies de mockups (ventanas, tarjetas)
    surfaceHi: "#1D1D1D", // superficie un punto más clara
  },

  fonts: {
    family: fontFamily,
  },

  // SAFE ZONES de TikTok: aire arriba (rótulos de la app) y mucho aire abajo
  // (botones de la interfaz + tu subtítulo). Todo lo importante vive dentro.
  safe: {
    top: 120,
    bottom: 420,
    horizontal: 90,
  },
} as const;

// --- CONSISTENCIA DE MOVIMIENTO ---------------------------------------------
// Mismas curvas y mismos tiempos en TODAS las escenas: así se siente una pieza
// única y no seis escenas sueltas.

/** Entrada estándar de un elemento: ~15 frames a 60 fps. */
export const ENTER_FRAMES = 15;

/** Retardo entre elementos de una cascada (stagger). */
export const STAGGER_FRAMES = 5;

/** Stagger más fino, para texto letra a letra. */
export const STAGGER_CHAR_FRAMES = 2;

/** Spring suave y sobrio: sin rebotes exagerados. El movimiento base del vídeo. */
export const SPRING_SOFT = { damping: 200, mass: 0.7, stiffness: 120 } as const;

/** Spring con un punto de vida, para "punch" y elementos que aterrizan. */
export const SPRING_PUNCH = { damping: 14, mass: 0.6, stiffness: 180 } as const;

/** Spring de frenada: arranca rápido y se detiene en seco (scroll del dedo). */
export const SPRING_BRAKE = { damping: 26, mass: 1.1, stiffness: 90 } as const;

/** Easing estándar para interpolaciones no-spring (barridos, dibujos, fades). */
export const EASE = Easing.bezier(0.22, 1, 0.36, 1); // "out expo" suave
export const EASE_IN_OUT = Easing.inOut(Easing.cubic);

export const HEADING_WEIGHT = 800;
export const BODY_WEIGHT = 500;

/** Glow discreto para elementos en color de acento (y SOLO para ellos). */
export const accentGlow = (strength = 1): string =>
  `drop-shadow(0 0 ${10 * strength}px ${theme.colors.accent}55) drop-shadow(0 0 ${
    28 * strength
  }px ${theme.colors.accent}22)`;
