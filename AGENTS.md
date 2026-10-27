# AGENTS.md

Sitio estático: HTML + CSS + **un solo** archivo JavaScript. Node se usa únicamente para servir el directorio, no como runtime de aplicación.

## Reglas que un agente suele romper

- **`app.js` es un archivo único.** No lo dividas en módulos, imports ni carpetas `src/`. Toda la lógica va ahí salvo pedido explícito.
- **No hay build, ni tests, ni linter, ni `package.json`.** No inventes `npm test`, `npm run build` ni scripts; no ejecutes instalaciones de dependencias.
- **Sin frameworks ni bundler.** Nada de React, Vite, Tailwind, TypeScript ni `npm install` sin autorización. CSS y JS planos.
- **No conviertas esto en una app Node.** Nada de Express/servidor propio; solo archivos estáticos.
- **Español** en documentación, commits y comentarios. Código y nombres de identificadores en inglés.

## Comandos

```bash
npx serve .                     # servir y probar en el navegador
git add -A && git commit -m "feat: ..."
```

No existe otra herramienta de verificación: **validar un cambio = abrirlo en el navegador** y comprobar consola y layout.

## Estructura

```
index.html   # única página
styles.css   # todos los estilos
app.js       # toda la lógica
```

Todo en la raíz. No crear subcarpetas de assets hasta que haga falta.

## Flujo de trabajo

1. Divide el trabajo en rebanadas verticales pequeñas y preséntalas antes de escribir código.
2. Un commit atómico por rebanada, Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `refactor:`).
3. Al cerrar cada rebanada, actualiza `STATE.md`; al completar funcionalidad, `CHANGELOG.md`.
4. Nunca commitear con errores visibles en consola.

## Documentación del proyecto

`README.md` (uso) · `STATE.md` (trabajo en curso, zonas frágiles) · `CHANGELOG.md` · `ROADMAP.md` · `ARCHITECTURE.md` / `DESIGN.md` solo cuando la complejidad lo exija.
