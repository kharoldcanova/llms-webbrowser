# STATE — llms-webbrowser

## Objetivo actual

Laboratorio para probar `runonweb` en el navegador. Página operativa con tres demos verificados.

## Hecho

- Vite + `runonweb@0.1.0` instalados; scripts `dev` / `build` / `preview`.
- `index.html`, `styles.css`, `app.js` con tres demos: emojis, similitud de embeddings, quitar fondo.
- Badge de dispositivo (WebGPU / f16 / WASM) usando `runonweb/core`.
- Progreso de descarga real por tarjeta, reutilización de instancias y botones bloqueados durante la inferencia.
- Verificado en Chromium headless (WASM): emojis `🍕❤️`, similitud 48.6 % / 384 dims, PNG con alfa (175k px transparentes).

## Pendiente

- Probar en un navegador con WebGPU real (no verificado aún).
- Decidir si se añaden más demos (`ocr`, `stt`, `tts`, `detect`, `classify`, `translate`).

## Zonas frágiles

- `app.js` debe seguir siendo un archivo único; no introducir carpetas `src/` ni componentes.
- `runonweb` exporta `.ts` sin compilar: sin Vite no resuelve.
- Inferencias simultáneas compiten por el contexto global de ONNX Runtime; no paralelizar demos.
- Modelos grandes: 219 MB en quitar fondo. No confundir lentitud con fallo.
