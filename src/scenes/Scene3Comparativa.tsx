// =============================================================================
// Escena 3 — DROPSHIPPING vs STOCK PROPIO (12 s · 720 frames a 60 fps)
// -----------------------------------------------------------------------------
// Split screen: las dos columnas se SEPARAN desde el centro.
//  · Izquierda: diagrama proveedor → flecha lenta → cliente (transmite "tarda").
//  · Derecha: EL MOMENTO SHOPIFY. Ventana de navegador, el cursor falso entra,
//    va al botón, hace CLICK (ripple + botón hundido + check) y sale el toast.
// Al final la derecha se ILUMINA y la izquierda se atenúa: es la conclusión.
//
// La maquetación usa coordenadas absolutas dentro de un lienzo de 900×720
// para poder apuntar el cursor a un punto EXACTO (el botón).
//
// ⏱️ Los `delay` están en FRAMES a 60 fps (60 = 1 segundo).
// =============================================================================

import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SceneLayout } from "../components/SceneLayout";
import {
  BROWSER_WIDTH,
  BUTTON_CENTER,
  BrowserShopify,
} from "../mockups/BrowserShopify";
import { DropshipFlow } from "../mockups/DropshipFlow";
import { Enter } from "../motion/Enter";
import { FakeCursor } from "../motion/FakeCursor";
import { useEnter, useProgress } from "../motion/hooks";
import { EASE, accentGlow, theme } from "../theme";
import type { SceneProps } from "./types";

// --- Lienzo y posiciones (coordenadas absolutas) ----------------------------
const CANVAS_W = 900;
const CANVAS_H = 720;
const COL_W = BROWSER_WIDTH; // 435
const LEFT_X = 0;
const RIGHT_X = CANVAS_W - COL_W; // 465
const VISUAL_Y = 84;
const ITEMS_Y = 418;

// El botón "Publicar", en coordenadas del lienzo. Aquí apunta el cursor.
const BUTTON_X = RIGHT_X + BUTTON_CENTER.x;
const BUTTON_Y = VISUAL_Y + BUTTON_CENTER.y;

// --- Momentos clave ---------------------------------------------------------
const CURSOR_IN = 250; // el cursor empieza a moverse hacia el botón
const CLICK_AT = 330; // click
const ILLUMINATE_AT = 545; // la derecha se ilumina, la izquierda se atenúa

const LEFT_ITEMS = [
  "Sin stock",
  "El proveedor envía",
  "Empiezas sin arriesgar",
  "Pero tarda y pierdes control", // ← el último, en rojo atenuado
];

const RIGHT_ITEMS = [
  "Compras tú",
  "Guardas tú",
  "Envías en un día",
  "El cliente vuelve",
];

const ColumnTitle: React.FC<{
  text: string;
  delay: number;
  accent?: boolean;
}> = ({ text, delay, accent = false }) => (
  <Enter delay={delay} y={20}>
    <div
      style={{
        fontSize: 38,
        fontWeight: 800,
        letterSpacing: 1,
        textTransform: "uppercase",
        color: accent ? theme.colors.accent : theme.colors.text,
        filter: accent ? accentGlow(0.7) : undefined,
      }}
    >
      {text}
    </div>
  </Enter>
);

const ItemList: React.FC<{
  items: string[];
  delay: number;
  lastIsDanger?: boolean;
}> = ({ items, delay, lastIsDanger = false }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
    {items.map((item, index) => {
      const isDanger = lastIsDanger && index === items.length - 1;
      return (
        <Enter key={item} delay={delay + index * 14} y={18} x={-14}>
          <div
            style={{
              fontSize: 32,
              fontWeight: 600,
              lineHeight: 1.25,
              textAlign: "left",
              color: isDanger ? theme.colors.danger : theme.colors.muted,
            }}
          >
            {item}
          </div>
        </Enter>
      );
    })}
  </div>
);

export const Scene3Comparativa: React.FC<SceneProps> = ({
  durationInFrames,
}) => {
  // Las columnas se separan desde el centro.
  const separate = useEnter(0);
  const spread = interpolate(separate, [0, 1], [212, 0]);

  // Click: el botón se HUNDE en un pulso corto y, justo después, queda publicado.
  const frame = useCurrentFrame();
  const pressed = interpolate(
    frame,
    [CLICK_AT - 3, CLICK_AT, CLICK_AT + 9],
    [0, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const published = useProgress(CLICK_AT + 10, 14, EASE);

  // Conclusión visual: la derecha se ilumina, la izquierda se apaga.
  const illumination = useProgress(ILLUMINATE_AT, 45, EASE);
  const leftDim = interpolate(illumination, [0, 1], [1, 0.35]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <SceneLayout durationInFrames={durationInFrames}>
        <div
          style={{ width: CANVAS_W, height: CANVAS_H, position: "relative" }}
        >
          {/* ================= COLUMNA A · DROPSHIPPING ==================== */}
          <div
            style={{
              position: "absolute",
              left: LEFT_X,
              top: 0,
              width: COL_W,
              transform: `translateX(${spread}px)`,
              opacity: leftDim,
            }}
          >
            <ColumnTitle text="Dropshipping" delay={30} />

            {/* Proveedor → flecha lenta → cliente */}
            <div style={{ position: "absolute", top: VISUAL_Y + 90, left: 0 }}>
              <DropshipFlow delay={70} travelDuration={200} />
            </div>

            <div style={{ position: "absolute", top: ITEMS_Y, left: 0 }}>
              <ItemList items={LEFT_ITEMS} delay={110} lastIsDanger />
            </div>
          </div>

          {/* ================= COLUMNA B · STOCK PROPIO ==================== */}
          <div
            style={{
              position: "absolute",
              left: RIGHT_X,
              top: 0,
              width: COL_W,
              transform: `translateX(${-spread}px)`,
            }}
          >
            <ColumnTitle
              text="Stock propio"
              delay={150}
              accent={illumination > 0.4}
            />

            {/* EL MOMENTO SHOPIFY */}
            <div style={{ position: "absolute", top: VISUAL_Y, left: 0 }}>
              <BrowserShopify
                delay={185}
                pressed={pressed}
                published={published}
              />
            </div>

            <div style={{ position: "absolute", top: ITEMS_Y, left: 0 }}>
              <ItemList items={RIGHT_ITEMS} delay={395} />
            </div>

            {/* Halo de conclusión sobre la columna ganadora */}
            <div
              style={{
                position: "absolute",
                left: -18,
                top: VISUAL_Y - 76,
                width: COL_W + 36,
                height: CANVAS_H - 40,
                borderRadius: 26,
                border: `2px solid ${theme.colors.accent}`,
                opacity: illumination * 0.85,
                boxShadow: `0 0 ${illumination * 60}px ${theme.colors.accent}33`,
                pointerEvents: "none",
              }}
            />
          </div>

          {/* ================= EL CURSOR FALSO ============================= */}
          <FakeCursor
            appearAt={CURSOR_IN - 20}
            path={[
              { x: 880, y: 610, at: 0 }, // espera fuera
              { x: BUTTON_X - 6, y: BUTTON_Y - 4, at: CURSOR_IN }, // va al botón
              { x: 828, y: 470, at: CLICK_AT + 90 }, // se retira
            ]}
            clicks={[{ at: CLICK_AT }]}
          />
        </div>
      </SceneLayout>
    </AbsoluteFill>
  );
};
