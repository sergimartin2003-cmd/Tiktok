# Explicando modelos de negocio · Parte 1: E-commerce

Fondo visual (cinético) para un vídeo vertical de TikTok hecho con
[Remotion](https://www.remotion.dev). El vídeo **no lleva voz**: es tipografía
en movimiento + animaciones pensadas para sincronizarse con una locución que
grabas por separado.

- **Formato:** vertical 1080×1920 (9:16), 30 fps.
- **Composición única:** `EcommercePart1`.
- **Duración:** se deriva automáticamente de las duraciones por escena
  (ver `src/timing.ts`). Con los valores iniciales, ≈ 63 s.

## Previsualizar

```bash
npm install     # solo la primera vez
npm run dev      # abre Remotion Studio en el navegador
```

En el Studio verás la composición `EcommercePart1`. Puedes moverte por la línea
de tiempo, reproducir y ver cada escena.

## Sincronizar los tiempos con tu voz

Toda la línea de tiempo se controla desde **un solo sitio**:

`src/timing.ts` → el array `sceneDurationsInSeconds` (en **segundos**):

```ts
export const sceneDurationsInSeconds: number[] = [7, 13, 13, 12, 12, 6];
//                                                 │   │   │   │   │   └ CIERRE
//                                                 │   │   │   │   └──── NINGÚN PRODUCTO DURA
//                                                 │   │   │   └──────── DROPSHIPPING vs STOCK
//                                                 │   │   └──────────── LA ATENCIÓN
//                                                 │   └──────────────── EL MARGEN
//                                                 └──────────────────── INTRO
```

Cambia cualquier número para que una escena dure más o menos según tu narración.
**No hace falta tocar nada más**: la duración total de la composición y el punto
de inicio de cada escena se recalculan solos.

> Si además quieres afinar *dentro* de una escena (cuándo entra cada texto),
> cada escena vive en `src/scenes/SceneXxxx.tsx` y usa `delay` en frames
> (30 frames = 1 segundo) sobre el componente `<Reveal>`.

## Cambiar el color de acento

`src/theme.ts` → `colors.accent`. Cambia esa línea y el color de acento se
actualiza en todo el vídeo (verde ácido `#C6FF3D` por defecto).

## Renderizar el MP4 final

```bash
npm run render
```

Genera `out/EcommercePart1.mp4` (H.264). Equivale a:

```bash
npx remotion render EcommercePart1 out/EcommercePart1.mp4 --codec=h264
```

## Estructura

```
src/
  Root.tsx            Registra la composición (duración derivada de timing.ts)
  Composition.tsx     Ensambla las escenas con <Sequence> según timing.ts
  timing.ts           ⏱️  Duraciones por escena (AJUSTA AQUÍ los tiempos)
  theme.ts            🎨 Tokens de diseño (AJUSTA AQUÍ el color de acento)
  components/
    anim.tsx          Reveal (entradas con spring) + useCountUp (números)
    SafeZone.tsx      Respeta las safe zones de TikTok (aire arriba/abajo)
    Grain.tsx         Grano sutil sobre el fondo
  scenes/
    Scene0Intro.tsx        INTRO
    Scene1Margen.tsx       EL MARGEN (count-up)
    Scene2Atencion.tsx     LA ATENCIÓN
    Scene3Comparativa.tsx  DROPSHIPPING vs STOCK
    Scene4Ciclo.tsx        NINGÚN PRODUCTO DURA (curva del ciclo de vida)
    Scene5Cierre.tsx       CIERRE (freeze final)
```

## Safe zones

El texto importante se mantiene en la franja central segura: ~120 px libres
arriba y ~420 px libres abajo (donde van los botones de la app y tu subtítulo).
Ajustables en `src/theme.ts` → `safe`.
