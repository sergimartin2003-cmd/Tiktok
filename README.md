# Explicando modelos de negocio · Parte 1: E-commerce

Fondo visual (motion design) para un vídeo vertical de TikTok hecho con
[Remotion](https://www.remotion.dev). El vídeo **no lleva voz**: es tipografía
cinética + animaciones pensadas para sincronizarse con una locución que grabas
por separado.

- **Formato:** vertical **1080×1920 (9:16) a 60 fps**.
- **Composición final:** `EcommercePart1`.
- **Duración:** se deriva de las duraciones por escena (`src/timing.ts`).
  Con los valores iniciales: 63 s de escenas − 5 transiciones de 0,5 s ≈ **60,5 s**.

## Previsualizar

```bash
npm install     # solo la primera vez
npm run dev     # abre Remotion Studio
```

En el Studio hay **una composición por escena** además del vídeo final, para
poder validar cada una aislada:

| Composición | Qué es |
| --- | --- |
| `EcommercePart1` | El vídeo completo, con transiciones |
| `S0-Intro` | Intro |
| `S1-Margen` | El margen (la escena estrella) |
| `S2-Atencion` | La atención (móvil + feed) |
| `S3-Comparativa` | Dropshipping vs Stock (Shopify + click) |
| `S4-Ciclo` | Ningún producto dura (gráfica) |
| `S5-Cierre` | Cierre |

## ⏱️ Sincronizar los tiempos con tu voz

Toda la línea de tiempo se controla desde **un solo sitio**:

`src/timing.ts` → el array `sceneDurationsInSeconds` (en **segundos**):

```ts
export const sceneDurationsInSeconds: number[] = [7, 13, 13, 12, 12, 6];
//                                                │   │   │   │   │   └ CIERRE
//                                                │   │   │   │   └──── NINGÚN PRODUCTO DURA
//                                                │   │   │   └──────── DROPSHIPPING vs STOCK
//                                                │   │   └──────────── LA ATENCIÓN
//                                                │   └──────────────── EL MARGEN
//                                                └──────────────────── INTRO
```

Cambia cualquier número y **no hace falta tocar nada más**: los frames de cada
escena (`segundos × 60`), el punto de inicio de cada `<Sequence>`, el solape de
las transiciones y la duración total de la composición se recalculan solos.

También puedes ajustar `TRANSITION_DURATION_IN_SECONDS` (el solape entre escenas).

### Afinar dentro de una escena

Cada escena vive en `src/scenes/SceneXxxx.tsx` y usa `delay` **en frames a
60 fps** (60 frames = 1 segundo) sobre los componentes de entrada. Los momentos
clave están marcados con constantes al principio de cada archivo, por ejemplo:

```ts
const SWIPE_AT = 205;  // el dedo empieza el scroll
const BRAKE_AT = 265;  // frena en seco  ← "le paró el dedo"
```

## 🎨 Cambiar el color de acento

`src/theme.ts` → `colors.accent`. Cambia esa línea y el acento se actualiza en
todo el vídeo (titulares, glows, subrayados, gráfica, botón de Shopify, barra
del margen...). Verde ácido `#C6FF3D` por defecto.

En ese mismo archivo están las curvas de movimiento compartidas
(`SPRING_SOFT`, `SPRING_PUNCH`, `SPRING_BRAKE`, `ENTER_FRAMES`, `EASE`): tócalas
y cambia el carácter del movimiento de toda la pieza a la vez.

## Renderizar el MP4 final

```bash
npm run render
```

Genera `out/EcommercePart1.mp4` — **1080×1920, 60 fps, H.264, crf 18**. Equivale a:

```bash
npx remotion render EcommercePart1 out/EcommercePart1.mp4 --codec=h264 --crf=18
```

Para renderizar una escena suelta:

```bash
npx remotion render S1-Margen out/S1-Margen.mp4 --codec=h264 --crf=18
```

## Estructura

```
src/
  Root.tsx              Composiciones (vídeo final + una por escena)
  Composition.tsx       Montaje con <TransitionSeries> (sin cortes secos)
  timing.ts             ⏱️  Duraciones por escena — AJUSTA AQUÍ los tiempos
  theme.ts              🎨 Color de acento, tipografía y curvas de movimiento

  motion/               La "física" común a todas las escenas
    hooks.ts            useEnter, useProgress, useCameraPush, useParallax
    Enter.tsx           Entrada estándar: spring + micro scale + blur-to-focus
    SplitText.tsx       Tipografía cinética (stagger por palabra o carácter)
    LightSweep.tsx      Destello de acento que cruza un texto
    Wipe.tsx            Reveals con máscara (clip-path)
    Odometer.tsx        Números que ruedan como un odómetro
    FakeCursor.tsx      Puntero falso: spring, estela y ripple de click

  components/
    SceneLayout.tsx     Safe zones de TikTok + camera push
    PostFX.tsx          Grano vivo + viñeta (encima de todo)
    EditorialGrid.tsx   Rejilla que se dibuja y se atenúa
    LifecycleChart.tsx  La curva del producto ganador

  mockups/              Interfaces dibujadas en código (cero imágenes)
    ProductCard.tsx     Tarjeta de producto flotante (lámpara en SVG)
    PhoneTikTok.tsx     Móvil + feed de TikTok con rail de iconos
    BrowserShopify.tsx  Ventana de navegador con interfaz tipo Shopify
    DropshipFlow.tsx    Proveedor → flecha lenta → cliente

  scenes/               Una escena por archivo
```

## Criterios de movimiento

- **Nada aparece de golpe**: todo entra con spring y en cascada (stagger).
- **Cero elementos estáticos**: camera push en cada escena, parallax por capas
  y micro-movimientos permanentes.
- **Safe zones de TikTok**: ~120 px libres arriba y ~420 px abajo (botones de la
  app y tu subtítulo). Ajustables en `src/theme.ts` → `safe`.
- **Un solo acento**: el verde solo se usa para lo que importa; el rojo atenuado,
  solo para lo negativo.
