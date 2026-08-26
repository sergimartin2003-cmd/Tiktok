// =============================================================================
// Composition.tsx — Ensamblado de la composición "EcommercePart1"
// -----------------------------------------------------------------------------
// Cada escena se coloca en su <Sequence> con `from` y `durationInFrames`
// calculados desde timing.ts. Si cambias un número en `sceneDurationsInSeconds`
// (timing.ts), TODA la línea de tiempo se recoloca aquí automáticamente.
// =============================================================================

import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { Grain } from "./components/Grain";
import { theme } from "./theme";
import {
  sceneDurationsInFrames,
  sceneStartsInFrames,
} from "./timing";

import { Scene0Intro } from "./scenes/Scene0Intro";
import { Scene1Margen } from "./scenes/Scene1Margen";
import { Scene2Atencion } from "./scenes/Scene2Atencion";
import { Scene3Comparativa } from "./scenes/Scene3Comparativa";
import { Scene4Ciclo } from "./scenes/Scene4Ciclo";
import { Scene5Cierre } from "./scenes/Scene5Cierre";

// El orden de este array define el orden de la línea de tiempo y debe coincidir
// con el orden de `sceneDurationsInSeconds` en timing.ts.
const scenes: React.FC[] = [
  Scene0Intro,
  Scene1Margen,
  Scene2Atencion,
  Scene3Comparativa,
  Scene4Ciclo,
  Scene5Cierre,
];

export const EcommercePart1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      {/* Grano sutil por encima del fondo, por debajo del texto */}
      <Grain />

      {scenes.map((Scene, index) => (
        <Sequence
          key={index}
          from={sceneStartsInFrames[index]}
          durationInFrames={sceneDurationsInFrames[index]}
        >
          <Scene />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
