# AGENTS.md

Laboratorio de **runonweb** (ML on-device en el navegador): HTML + CSS + **un solo** `app.js`, servido con **Vite**. Node es solo tooling de build; no hay backend.

## Reglas que un agente suele romper

- **`app.js` es un archivo único.** No crear `src/`, componentes ni módulos propios. Toda la lógica va ahí; los imports dinámicos a `runonweb/*` son la única modularización.
- **Vite es obligatorio.** `runonweb` publica ESM con `.ts` sin compilar en sus `exports`; sin bundler no resuelve. Nunca proponer `file://` ni un servidor estático simple como forma de ejecución.
- **Solo se instala `runonweb` (+ `vite` como devDependency).** No agregar frameworks (React/Vue/Tailwind), TypeScript, linters ni librerías de UI sin autorización explícita.
- **No inventar tests ni `npm test`.** No hay runner: la verificación es `npm run dev` + abrir la página y comprobar consola, salida y layout. Un cambio solo se da por válido tras verlo en el navegador.
- **`import 'runonweb'` no existe** como entrypoint raíz. Siempre submódulo: `runonweb/emoji`, `runonweb/embed`, `runonweb/remove-bg`, `runonweb/core`, `runonweb/ocr`, `runonweb/stt`, `runonweb/tts`, `runonweb/detect`, `runonweb/caption`, `runonweb/depth`, `runonweb/classify`, `runonweb/translate`, `runonweb/clean`, `runonweb/image`.
- **Carga diferida obligatoria.** Los modelos se importan con `await import('runonweb/<modulo>')` dentro del handler del botón, no con imports estáticos (excepto `runonweb/core`, que es liviano).
- **No lanzar inferencias en paralelo.** ONNX Runtime Web usa un contexto global y la librería serializa con una cola; disparar dos demos a la vez provoca esperas y errores `Session already started`. Los botones se deshabilitan mientras corren.
- **Español** en documentación, comentarios y textos de UI; identificadores y nombres de API en inglés.

## Comandos

```bash
npm install        # instala runonweb + vite
npm run dev        # Vite en http://localhost:5173
npm run build      # bundle a dist/
npm run preview    # sirve dist/
```

## Arquitectura

```
index.html   # 3 tarjetas demo; cada una con sus id (btn, bar, status, out)
styles.css   # variables CSS en :root, tarjetas, barra de progreso, checkerboard
app.js       # utilidades + un handler por demo + badge de dispositivo
```

Flujo de cada demo: `run(botón, statusId, task)` deshabilita el botón, ejecuta `task`, captura errores y lo rehabilita. Dentro: `import()` dinámico → instancia cacheada (`xxx ??= new Xxx({ onProgress })`) → `await load()` → método de inferencia → render.

## API de runonweb: detalles que importan

- Patrón uniforme: una **clase** (`Emojifier`, `TextEmbedder`, `RemoveBackground`, `TextToSpeech`) con `load()`, método de inferencia y `dispose()`; y una **función de conveniencia** (`emojify`, `embed`, `removeBackground`) que crea, ejecuta y descarta. En la página se usan las clases para reutilizar el modelo.
- `onProgress` recibe `{ status, progress, loaded, total, file }`; `progress` es porcentaje 0-100. El status final es `'done'`.
- `device` (`'webgpu' | 'wasm' | null`) solo es válido **después** de `load()`.
- En `embed`, WebGPU usa `fp16` y WASM `q8`; `q8` en WebGPU produce similitudes basura. No forzar `dtype` a mano.
- `runonweb/core` expone `isWebGPUAvailable()`, `supportsShaderF16()`, `resolveDevice()`, `formatBytes()` y utilidades de caché (`listCachedModels`, `clearAllModelCache`, `storageEstimate`).
- El tipado real de la API está en `node_modules/runonweb/src/<modulo>/index.ts` (es la fuente de verdad; el README del paquete puede quedarse corto).

## Al verificar

- Esperar descargas grandes la primera vez (4 MB / 23 MB / 219 MB). No asumir que algo está roto porque tarda.
- Sin WebGPU (headless, CI, Firefox) la librería cae a WASM y **sí funciona**; solo es más lento. Un warning `No available adapters` en consola es normal en ese caso.
- Comprobar que un PNG de salida tiene alfa real, no solo que el elemento `<img>` tenga `src`.
- Si `dist/` se genera, no se commitea (ya está en `.gitignore`).

## Flujo de trabajo

1. Rebanadas verticales pequeñas; un demo completo (HTML + CSS + handler verificado en navegador) por commit.
2. Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`.
3. Al cerrar cada rebanada, actualizar `STATE.md`; al completar funcionalidad, `CHANGELOG.md`.
4. Nunca commitear con errores en consola ni con un demo roto.

## Documentación del proyecto

`README.md` (uso y demos) · `STATE.md` (trabajo en curso) · `CHANGELOG.md` · `ARCHITECTURE.md` / `DESIGN.md` solo si la complejidad lo exige.
