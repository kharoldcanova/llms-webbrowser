# llms-webbrowser

Explorador web de LLMs construido con HTML, CSS y un único archivo JavaScript. Sin frameworks ni bundler: se sirve como sitio estático con Node.

## Estado

Proyecto en fase inicial. Solo existe la documentación base; la implementación (`index.html`, `styles.css`, `app.js`) aún no está creada.

## Requisitos

- Node.js 18+ (probado con v26.8.2)

## Cómo ejecutar

No hay build, ni instalación de dependencias, ni tests. Sirve el directorio y abre el navegador:

```bash
npx serve .
# o
npx http-server .
```

Si prefieres no depender de la red, abre `index.html` directamente con `file://` (válido mientras no uses `fetch` ni módulos ES).

## Estructura

```
index.html      # única página
styles.css      # todos los estilos
app.js          # toda la lógica (un solo archivo)
```

## Convenciones

- El JavaScript vive en **un solo archivo** (`app.js`). No se divide en módulos salvo pedido explícito.
- Sin frameworks, sin bundler, sin paso de compilación.
- Los cambios se registran en `CHANGELOG.md` y el trabajo en curso en `STATE.md`.
