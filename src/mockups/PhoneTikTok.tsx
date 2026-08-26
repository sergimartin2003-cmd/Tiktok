// =============================================================================
// mockups/PhoneTikTok.tsx — Móvil + feed de TikTok, dibujados en código.
// Marco de dispositivo, isla dinámica, barra de progreso, rail de iconos
// (corazón, comentarios, compartir) y dos "vídeos" apilados por los que se
// hace scroll. Ninguna imagen externa: todo divs y SVG.
// =============================================================================

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { theme } from "../theme";
import { useEnter } from "../motion/hooks";

const SCREEN_W = 320;
const SCREEN_H = 660;

/** Iconos del rail lateral, dibujados a mano en SVG. */
const HeartIcon: React.FC<{ liked: number }> = ({ liked }) => (
  <svg width={38} height={38} viewBox="0 0 24 24">
    <path
      d="M12 21s-7.5-4.7-9.4-9A5.2 5.2 0 0 1 12 6.5 5.2 5.2 0 0 1 21.4 12c-1.9 4.3-9.4 9-9.4 9z"
      fill={liked > 0.5 ? theme.colors.accent : "rgba(255,255,255,0.92)"}
    />
  </svg>
);

const CommentIcon: React.FC = () => (
  <svg width={38} height={38} viewBox="0 0 24 24">
    <path
      d="M4 4h16v12H8l-4 4z"
      fill="rgba(255,255,255,0.92)"
    />
  </svg>
);

const ShareIcon: React.FC = () => (
  <svg width={38} height={38} viewBox="0 0 24 24">
    <path d="M3 12l18-8-6.5 8L21 20z" fill="rgba(255,255,255,0.92)" />
  </svg>
);

const RailButton: React.FC<{
  children: React.ReactNode;
  label: string;
  scale?: number;
  glow?: number;
}> = ({ children, label, scale = 1, glow = 0 }) => (
  <div
    style={{
      textAlign: "center",
      transform: `scale(${scale})`,
      filter: glow > 0 ? `drop-shadow(0 0 12px ${theme.colors.accent}88)` : undefined,
    }}
  >
    {children}
    <div
      style={{
        fontSize: 15,
        fontWeight: 600,
        color: "rgba(255,255,255,0.9)",
        marginTop: 2,
      }}
    >
      {label}
    </div>
  </div>
);

/** Un "vídeo" del feed. El segundo es el que engancha (producto + precio). */
const FeedItem: React.FC<{ variant: "a" | "b"; liked?: number }> = ({
  variant,
  liked = 0,
}) => {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 90) * 10;
  // Latido al darle "me gusta"
  const beat = 1 + liked * (Math.sin(frame / 9) * 0.5 + 0.5) * 0.16;

  return (
    <div
      style={{
        width: SCREEN_W,
        height: SCREEN_H,
        position: "relative",
        overflow: "hidden",
        background:
          variant === "a"
            ? "linear-gradient(160deg, #23262B 0%, #15171A 100%)"
            : "linear-gradient(160deg, #1B2410 0%, #101206 100%)",
      }}
    >
      {/* Formas abstractas: el "contenido" del vídeo, siempre en movimiento */}
      {variant === "a" ? (
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 180 + drift,
            width: 240,
            height: 240,
            borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.13)",
          }}
        />
      ) : (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `translateY(${drift}px)`,
          }}
        >
          {/* El mismo producto de la escena del margen: continuidad visual */}
          <svg width={190} height={210} viewBox="0 0 200 240">
            <path
              d="M52,92 L148,92 L182,200 L18,200 Z"
              fill={theme.colors.accent}
              opacity={0.14}
            />
            <path
              d="M50,90 L150,90 L126,30 L74,30 Z"
              stroke={theme.colors.text}
              strokeWidth={5}
              strokeLinejoin="round"
              fill="none"
            />
            <circle cx={100} cy={104} r={8} fill={theme.colors.accent} />
            <path d="M100,90 L100,200" stroke={theme.colors.muted} strokeWidth={5} />
            <path
              d="M64,202 L136,202"
              stroke={theme.colors.text}
              strokeWidth={7}
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Rail lateral de iconos */}
      <div
        style={{
          position: "absolute",
          right: 12,
          bottom: 96,
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <RailButton label={liked > 0.5 ? "12,5K" : "12,4K"} scale={beat} glow={liked}>
          <HeartIcon liked={liked} />
        </RailButton>
        <RailButton label="843">
          <CommentIcon />
        </RailButton>
        <RailButton label="1,2K">
          <ShareIcon />
        </RailButton>
      </div>

      {/* Pie: usuario y descripción */}
      <div style={{ position: "absolute", left: 16, bottom: 54, width: 210 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#fff" }}>
          @tutienda
        </div>
        <div
          style={{
            fontSize: 15,
            fontWeight: 500,
            color: "rgba(255,255,255,0.78)",
            marginTop: 4,
          }}
        >
          {variant === "a"
            ? "esto nadie te lo cuenta"
            : "la lámpara de 29 € que no para de venderse"}
        </div>
      </div>
    </div>
  );
};

export const PhoneTikTok: React.FC<{
  delay?: number;
  /** Desplazamiento vertical del feed (lo controla la escena). */
  scrollY: number;
  /** 0 → 1: el corazón se enciende. */
  liked?: number;
  /** Escala extra (micro-zoom en el momento clave). */
  zoom?: number;
}> = ({ delay = 0, scrollY, liked = 0, zoom = 1 }) => {
  const frame = useCurrentFrame();
  const enter = useEnter(delay);

  // Barra de progreso del vídeo: corre en bucle.
  const progress = ((frame - delay) % 240) / 240;

  return (
    <div
      style={{
        opacity: interpolate(enter, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(
          enter,
          [0, 1],
          [50, 0],
        )}px) scale(${interpolate(enter, [0, 1], [0.92, 1]) * zoom})`,
        willChange: "transform, opacity",
      }}
    >
      <div
        style={{
          width: SCREEN_W + 22,
          height: SCREEN_H + 22,
          borderRadius: 46,
          padding: 11,
          background: "linear-gradient(160deg, #2A2A2A 0%, #121212 100%)",
          border: "1px solid rgba(255,255,255,0.14)",
          boxShadow:
            "0 50px 90px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)",
          position: "relative",
        }}
      >
        {/* Pantalla */}
        <div
          style={{
            width: SCREEN_W,
            height: SCREEN_H,
            borderRadius: 36,
            overflow: "hidden",
            position: "relative",
            backgroundColor: "#000",
          }}
        >
          {/* Los dos vídeos apilados: el scroll los desplaza */}
          <div style={{ transform: `translateY(${scrollY}px)` }}>
            <FeedItem variant="a" />
            <FeedItem variant="b" liked={liked} />
          </div>

          {/* Barra de progreso del vídeo */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 18,
              height: 3,
              backgroundColor: "rgba(255,255,255,0.18)",
            }}
          >
            <div
              style={{
                width: `${progress * 100}%`,
                height: "100%",
                backgroundColor: "#fff",
              }}
            />
          </div>

          {/* Isla dinámica */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 92,
              height: 26,
              borderRadius: 13,
              backgroundColor: "#000",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export const PHONE_SCREEN_HEIGHT = SCREEN_H;
