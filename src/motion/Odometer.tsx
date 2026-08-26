// =============================================================================
// motion/Odometer.tsx — Números que ruedan como un odómetro.
// Cada dígito es una tira vertical 0-9 que se desplaza. Al contar, las unidades
// giran rápido y las decenas despacio, igual que un contador mecánico.
// =============================================================================

import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { EASE } from "../theme";

/** Una columna de dígitos que rueda hasta `position` (valor continuo). */
const DigitColumn: React.FC<{
  position: number;
  maxIndex: number;
  height: number;
}> = ({ position, maxIndex, height }) => {
  // La tira contiene 0,1,2...9,0,1,2... tantas veces como haga falta para
  // llegar al valor final SIN retroceder al pasar de 9 a 0.
  const strip = Array.from({ length: maxIndex + 2 }, (_, i) => i % 10);

  return (
    <span
      style={{
        display: "inline-block",
        height,
        overflow: "hidden",
        verticalAlign: "bottom",
      }}
    >
      <span
        style={{
          display: "block",
          transform: `translateY(${-position * height}px)`,
          willChange: "transform",
        }}
      >
        {strip.map((digit, index) => (
          <span
            key={index}
            style={{
              display: "block",
              height,
              lineHeight: `${height}px`,
            }}
          >
            {digit}
          </span>
        ))}
      </span>
    </span>
  );
};

export const Odometer: React.FC<{
  /** Valor final al que cuenta. */
  target: number;
  delay?: number;
  duration?: number;
  fontSize: number;
  /** Texto tras el número (p. ej. " €"). */
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ target, delay = 0, duration = 40, fontSize, suffix, style }) => {
  const frame = useCurrentFrame();

  const absTarget = Math.abs(target);
  const value = interpolate(frame, [delay, delay + duration], [0, absTarget], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: EASE,
  });

  const height = Math.round(fontSize * 1.12);
  const digitCount = String(Math.round(absTarget)).length;

  // De la cifra más significativa a la menos significativa.
  const places = Array.from({ length: digitCount }, (_, i) => digitCount - 1 - i);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        fontVariantNumeric: "tabular-nums",
        fontSize,
        lineHeight: `${height}px`,
        ...style,
      }}
    >
      {target < 0 ? <span>−</span> : null}
      {places.map((place) => {
        const divisor = Math.pow(10, place);
        const exact = value / divisor;

        // MECÁNICA DE ODÓMETRO REAL:
        // - las unidades giran de forma continua,
        // - las decenas (y superiores) SOLO giran durante el acarreo, es decir
        //   en el último 10% de la vuelta de la rueda de abajo.
        // Sin esto, al llegar a 29 las decenas mostrarían un "3" (bug clásico).
        const position =
          place === 0
            ? exact
            : Math.floor(exact) +
              Math.min(1, Math.max(0, (exact - Math.floor(exact) - 0.9) * 10));

        return (
          <DigitColumn
            key={place}
            position={position}
            maxIndex={Math.ceil(absTarget / divisor)}
            height={height}
          />
        );
      })}
      {suffix ? (
        <span style={{ marginLeft: "0.16em" }}>{suffix.trim()}</span>
      ) : null}
    </span>
  );
};
