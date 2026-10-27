# llms-webbrowser

Laboratorio mínimo para probar [**runonweb**](https://runonweb.ai): inferencia de modelos de IA directamente en el navegador, sin API keys, backend ni subida de archivos. Todo corre local con WebGPU o WASM.

La página expone tres demos autocontenidos que ejercitan la librería de extremo a extremo:

| Demo | API usada | Modelo |
| --- | --- | --- |
| Texto → emojis | `Emojifier` de `runonweb/emoji` | `midudev/text2emoji-tiny` (~4 MB) |
| Similitud de embeddings | `TextEmbedder` + `cosineSimilarity` de `runonweb/embed` | `all-MiniLM-L6-v2` (~23 MB) |
| Quitar fondo | `RemoveBackground` de `runonweb/remove-bg` | `BEN2-ONNX` (~219 MB) |

## Requisitos

- Node.js 18+ (probado con v26.8.2)
- Un navegador moderno. Con WebGPU (Chrome/Edge recientes) usa la GPU; si no hay, cae a WASM automáticamente.

## Instalación y uso

```bash
npm install
npm run dev        # servidor de desarrollo Vite
npm run build      # build de producción en dist/
npm run preview    # sirve el build
```

Las páginas se abren en `http://localhost:5173` por defecto.

> `runonweb` se publica como ESM **con los `.ts` sin compilar** en sus `exports`, por lo que necesita un bundler (Vite) para resolverse. No funciona abriendo `index.html` con `file://` ni con un servidor estático simple.

## Comportamiento esperado

- La **primera** vez que se usa cada demo, el modelo se descarga desde Hugging Face y queda en la caché del navegador (Cache Storage). Las siguientes ejecuciones son instantáneas.
- Cada tarjeta muestra el progreso de descarga real (`status`, `%`, bytes, archivo).
- El badge superior indica el dispositivo resuelto por la librería: `WebGPU`, `WebGPU · f16` o `WASM (sin WebGPU)`.
- El botón se deshabilita mientras corre la inferencia; las instancias de modelo se reutilizan entre ejecuciones.

## Estructura

```
index.html      # única página con las tres tarjetas
styles.css      # todos los estilos
app.js          # toda la lógica (archivo único, imports dinámicos)
package.json    # scripts: dev / build / preview
```

`index.html` y `styles.css` están en la raíz; `app.js` se carga como módulo ES.

## Agregar un demo

1. Añade una `<section class="card">` en `index.html` con sus `id` únicos.
2. En `app.js`, importa el submódulo **de forma dinámica** dentro del handler (`await import('runonweb/<modulo>')`) para no cargar todo al inicio.
3. Reutiliza las utilidades existentes: `run`, `onProgress`, `setStatus`, `setBar`, `fmtBytes`.
4. Guarda la instancia en una variable de módulo (`xxx ??= new Xxx({ onProgress })`) para aprovechar la caché de modelo.

Consulta la API disponible en `node_modules/runonweb/src/<modulo>/index.ts` o en https://runonweb.ai/docs.

## Notas

- `runonweb` también ofrece `stt`, `tts`, `ocr`, `detect`, `caption`, `depth`, `classify`, `translate`, `clean` e `image` (esta última requiere WebGPU).
- El captioning usa un modelo con licencia LFM Open License v1.0 (gratis bajo USD 10M de ingresos anuales). No se usa en esta página.
