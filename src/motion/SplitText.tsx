// =============================================================================
// motion/SplitText.tsx — Tipografía cinética.
// Parte un texto en palabras o caracteres y los entra en cascada (stagger),
// cada uno con su spring y su blur-to-focus. Es lo que hace que un titular
// "se escriba en el aire" en vez de aparecer de golpe.
// =============================================================================

import React from "react";
import { interpolate } from "remotion";
import { SPRING_SOFT, STAGGER_CHAR_FRAMES, STAGGER_FRAMES } from "../theme";
import { useEnter } from "./hooks";

const Piece: React.FC<{
  delay: number;
  y: number;
  blur: number;
  config: { damping: number; mass: number; stiffness: number };
  children: React.ReactNode;
}> = ({ delay, y, blur, config, children }) => {
  const progress = useEnter(delay, config);
  return (
    <span
      style={{
        display: "inline-block",
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [y, 0])}px)`,
        filter: `blur(${interpolate(progress, [0, 1], [blur, 0])}px)`,
        willChange: "transform, opacity, filter",
      }}
    >
      {children}
    </span>
  );
};

export const SplitText: React.FC<{
  text: string;
  /** "char" para titulares cortos, "word" para frases. */
  by?: "char" | "word";
  delay?: number;
  /** Retardo entre piezas. Por defecto depende del modo. */
  stagger?: number;
  y?: number;
  blur?: number;
  config?: { damping: number; mass: number; stiffness: number };
  style?: React.CSSProperties;
}> = ({
  text,
  by = "word",
  delay = 0,
  stagger,
  y = 26,
  blur = 8,
  config = SPRING_SOFT,
  style,
}) => {
  const step =
    stagger ?? (by === "char" ? STAGGER_CHAR_FRAMES : STAGGER_FRAMES);

  if (by === "char") {
    const chars = Array.from(text);
    return (
      <span style={style}>
        {chars.map((char, index) => (
          <Piece
            key={index}
            delay={delay + index * step}
            y={y}
            blur={blur}
            config={config}
          >
            {/* Espacio duro para que no colapse el hueco entre palabras */}
            {char === " " ? " " : char}
          </Piece>
        ))}
      </span>
    );
  }

  const words = text.split(" ");
  return (
    <span style={style}>
      {words.map((word, index) => (
        <React.Fragment key={index}>
          <Piece
            delay={delay + index * step}
            y={y}
            blur={blur}
            config={config}
          >
            {word}
          </Piece>
          {index < words.length - 1 ? " " : null}
        </React.Fragment>
      ))}
    </span>
  );
};
