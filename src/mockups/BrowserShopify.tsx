// =============================================================================
// mockups/BrowserShopify.tsx — Ventana de navegador con interfaz tipo Shopify.
// Chrome realista (semáforo rojo/amarillo/verde + barra de URL), barra lateral,
// listado de productos y el botón de publicar. Todo en divs/SVG.
// El botón reacciona al click del cursor falso: se hunde y pasa a "publicado".
// =============================================================================

import React from "react";
import { interpolate } from "remotion";
import { accentGlow, theme } from "../theme";
import { useEnter } from "../motion/hooks";

export const BROWSER_WIDTH = 435;
export const BROWSER_HEIGHT = 300;

/**
 * Centro del botón "Publicar" en coordenadas de la VENTANA.
 * El cursor falso apunta aquí. Sidebar (78) + posición dentro del contenido.
 */
export const BUTTON_CENTER = { x: 310, y: 204 };

const TrafficLight: React.FC<{ color: string }> = ({ color }) => (
  <div
    style={{ width: 11, height: 11, borderRadius: "50%", backgroundColor: color }}
  />
);

/** Fila de producto del listado. */
const ProductRow: React.FC<{ delay: number; highlighted?: boolean }> = ({
  delay,
  highlighted = false,
}) => {
  const enter = useEnter(delay);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "7px 0",
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateX(${interpolate(enter, [0, 1], [14, 0])}px)`,
      }}
    >
      <div
        style={{
          width: 26,
          height: 26,
          borderRadius: 6,
          backgroundColor: highlighted
            ? `${theme.colors.accent}33`
            : "rgba(255,255,255,0.08)",
          border: highlighted ? `1px solid ${theme.colors.accent}66` : "none",
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            height: 7,
            width: highlighted ? "68%" : "52%",
            borderRadius: 4,
            backgroundColor: "rgba(255,255,255,0.22)",
          }}
        />
        <div
          style={{
            height: 6,
            width: "34%",
            borderRadius: 4,
            backgroundColor: "rgba(255,255,255,0.1)",
            marginTop: 5,
          }}
        />
      </div>
    </div>
  );
};

export const BrowserShopify: React.FC<{
  delay?: number;
  /** 0 → 1: el botón se hunde (lo dispara el click del cursor). */
  pressed?: number;
  /** 0 → 1: el producto ya está publicado (botón con check + toast). */
  published?: number;
}> = ({ delay = 0, pressed = 0, published = 0 }) => {
  const enter = useEnter(delay);

  return (
    <div
      style={{
        width: BROWSER_WIDTH,
        height: BROWSER_HEIGHT,
        borderRadius: 14,
        overflow: "hidden",
        backgroundColor: theme.colors.surface,
        border: "1px solid rgba(255,255,255,0.1)",
        boxShadow: "0 34px 70px rgba(0,0,0,0.65)",
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(enter, [0, 1], [34, 0])}px) scale(${interpolate(
          enter,
          [0, 1],
          [0.94, 1],
        )})`,
        position: "relative",
      }}
    >
      {/* --- Chrome del navegador ---------------------------------------- */}
      <div
        style={{
          height: 34,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          backgroundColor: "#1F1F1F",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
        }}
      >
        <TrafficLight color="#FF5F57" />
        <TrafficLight color="#FEBC2E" />
        <TrafficLight color="#28C840" />
        <div
          style={{
            flex: 1,
            height: 18,
            marginLeft: 8,
            borderRadius: 9,
            backgroundColor: "rgba(255,255,255,0.07)",
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            fontSize: 11,
            fontWeight: 500,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          tutienda.com/admin/productos
        </div>
      </div>

      {/* --- Cuerpo: barra lateral + contenido ---------------------------- */}
      <div style={{ display: "flex", height: BROWSER_HEIGHT - 34 }}>
        {/* Barra lateral */}
        <div
          style={{
            width: 78,
            backgroundColor: "#181818",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "12px 10px",
            display: "flex",
            flexDirection: "column",
            gap: 9,
          }}
        >
          {[0, 1, 2, 3, 4].map((item) => (
            <div
              key={item}
              style={{
                height: 9,
                borderRadius: 4,
                width: item === 1 ? "100%" : "72%",
                backgroundColor:
                  item === 1
                    ? `${theme.colors.accent}55`
                    : "rgba(255,255,255,0.1)",
              }}
            />
          ))}
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, padding: "14px 16px", position: "relative" }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: theme.colors.text,
              marginBottom: 8,
            }}
          >
            Productos
          </div>

          <ProductRow delay={delay + 18} highlighted />
          <ProductRow delay={delay + 28} />
          <ProductRow delay={delay + 38} />

          {/* --- EL BOTÓN ------------------------------------------------- */}
          <div
            style={{
              position: "absolute",
              left: 166,
              top: 150,
              width: 132,
              height: 40,
              borderRadius: 9,
              backgroundColor: theme.colors.accent,
              color: "#0A0A0A",
              fontSize: 15,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              // Se hunde al pulsar
              transform: `scale(${1 - pressed * 0.07}) translateY(${pressed * 2}px)`,
              filter: accentGlow(0.35 + published * 0.3),
              boxShadow: `0 ${8 - pressed * 5}px ${
                18 - pressed * 10
              }px rgba(198,255,61,0.25)`,
            }}
          >
            {published > 0.5 ? (
              <>
                {/* Check dibujado */}
                <svg width={16} height={16} viewBox="0 0 24 24">
                  <path
                    d="M4 12.5 L9.5 18 L20 6.5"
                    stroke="#0A0A0A"
                    strokeWidth={3.4}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
                Publicado
              </>
            ) : (
              "Publicar"
            )}
          </div>

          {/* --- TOAST de confirmación ------------------------------------ */}
          <div
            style={{
              position: "absolute",
              right: 14,
              bottom: 12,
              padding: "8px 12px",
              borderRadius: 8,
              backgroundColor: "rgba(20,20,20,0.96)",
              border: `1px solid ${theme.colors.accent}55`,
              fontSize: 12,
              fontWeight: 700,
              color: theme.colors.text,
              display: "flex",
              alignItems: "center",
              gap: 6,
              opacity: published,
              transform: `translateY(${(1 - published) * 14}px)`,
            }}
          >
            <span style={{ color: theme.colors.accent }}>✓</span>
            Producto publicado
          </div>
        </div>
      </div>
    </div>
  );
};
