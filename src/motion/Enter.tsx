// =============================================================================
// motion/Enter.tsx — La aparición estándar del vídeo.
// Nada aparece de golpe: todo entra con spring + desplazamiento + micro scale,
// y opcionalmente saliendo de desenfoque (blur-to-focus).
// =============================================================================

import React from "react";
import { interpolate } from "remotion";
import { SPRING_SOFT } from "../theme";
import { useEnter } from "./hooks";

export const Enter: React.FC<{
  /** Frames de retardo desde el inicio de la escena. */
  delay?: number;
  /** Desplazamiento vertical de entrada (px). */
  y?: number;
  /** Desplazamiento horizontal de entrada (px). */
  x?: number;
  /** Escala inicial (1 = sin escala). */
  scale?: number;
  /** Desenfoque inicial en px (blur-to-focus). */
  blur?: number;
  config?: { damping: number; mass: number; stiffness: number };
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({
  delay = 0,
  y = 24,
  x = 0,
  scale = 0.985,
  blur = 0,
  config = SPRING_SOFT,
  style,
  children,
}) => {
  const progress = useEnter(delay, config);

  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const translateY = interpolate(progress, [0, 1], [y, 0]);
  const translateX = interpolate(progress, [0, 1], [x, 0]);
  const currentScale = interpolate(progress, [0, 1], [scale, 1]);
  const currentBlur = interpolate(progress, [0, 1], [blur, 0]);

  return (
    <div
      style={{
        opacity,
        transform: `translate(${translateX}px, ${translateY}px) scale(${currentScale})`,
        filter: blur > 0 ? `blur(${currentBlur}px)` : undefined,
        willChange: "transform, opacity, filter",
        ...style,
      }}
    >
      {children}
    </div>
  );
};
