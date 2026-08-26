// =============================================================================
// Composition.tsx — Montaje final de "EcommercePart1".
// -----------------------------------------------------------------------------
// Las escenas se encadenan con <TransitionSeries> (@remotion/transitions):
// nunca hay cortes secos. Cada escena recibe su duración desde timing.ts, y las
// transiciones solapan escenas (por eso la duración total resta ese solape).
// =============================================================================

import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { PostFX } from "./components/PostFX";
import { SCENES } from "./scenes/registry";
import { theme } from "./theme";
import {
  TRANSITION_DURATION_IN_FRAMES,
  sceneDurationsInFrames,
} from "./timing";

// Timing común a todas las transiciones (deriva de timing.ts).
const timing = linearTiming({
  durationInFrames: TRANSITION_DURATION_IN_FRAMES,
});

/**
 * Una transición por cada corte entre escenas (5 cortes para 6 escenas).
 * El tipo de corte se elige por INTENCIÓN NARRATIVA, no al azar.
 */
const transitionAfterScene = (index: number): React.ReactNode => {
  const key = `transition-${index}`;
  switch (index) {
    case 0: // INTRO → MARGEN: bajamos a la cuenta
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={slide({ direction: "from-bottom" })}
          timing={timing}
        />
      );
    case 1: // MARGEN → ATENCIÓN: cambio de tema, barrido limpio
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={wipe({ direction: "from-left" })}
          timing={timing}
        />
      );
    case 2: // ATENCIÓN → COMPARATIVA: desplazamiento lateral
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={slide({ direction: "from-right" })}
          timing={timing}
        />
      );
    case 3: // COMPARATIVA → CICLO: el tiempo pasa (barrido de reloj)
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={clockWipe({
            width: theme.video.width,
            height: theme.video.height,
          })}
          timing={timing}
        />
      );
    default: // CICLO → CIERRE: remate
      return (
        <TransitionSeries.Transition
          key={key}
          presentation={slide({ direction: "from-bottom" })}
          timing={timing}
        />
      );
  }
};

export const EcommercePart1: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <TransitionSeries>
        {SCENES.flatMap((scene, index) => {
          const duration = sceneDurationsInFrames[index];
          const Scene = scene.component;

          const sequence = (
            <TransitionSeries.Sequence
              key={scene.id}
              durationInFrames={duration}
            >
              <Scene durationInFrames={duration} />
            </TransitionSeries.Sequence>
          );

          // Tras cada escena (menos la última) va su transición.
          if (index === SCENES.length - 1) {
            return [sequence];
          }

          return [sequence, transitionAfterScene(index)];
        })}
      </TransitionSeries>

      {/* Post: viñeta + grano, por encima de todo. */}
      <PostFX />
    </AbsoluteFill>
  );
};
