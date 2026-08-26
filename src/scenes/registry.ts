// =============================================================================
// scenes/registry.ts — Lista ordenada de escenas.
// El orden de este array DEBE coincidir con `sceneDurationsInSeconds` (timing.ts).
// Se usa tanto para montar el vídeo final como para generar las composiciones
// de preview individuales de cada escena.
// =============================================================================

import type React from "react";
import type { SceneProps } from "./types";
import { Scene0Intro } from "./Scene0Intro";
import { Scene1Margen } from "./Scene1Margen";
import { Scene2Atencion } from "./Scene2Atencion";
import { Scene3Comparativa } from "./Scene3Comparativa";
import { Scene4Ciclo } from "./Scene4Ciclo";
import { Scene5Cierre } from "./Scene5Cierre";

export type { SceneProps };

export type SceneEntry = {
  /** Id de la composición de preview en el Studio. */
  id: string;
  component: React.FC<SceneProps>;
};

export const SCENES: SceneEntry[] = [
  { id: "S0-Intro", component: Scene0Intro },
  { id: "S1-Margen", component: Scene1Margen },
  { id: "S2-Atencion", component: Scene2Atencion },
  { id: "S3-Comparativa", component: Scene3Comparativa },
  { id: "S4-Ciclo", component: Scene4Ciclo },
  { id: "S5-Cierre", component: Scene5Cierre },
];
