# Compendio · D&D 2024 (en español)

Aplicación web (PWA) que reúne un **compendio de Dungeons & Dragons (reglas 2024 / 5.5e) en español**: una biblioteca de conjuros filtrable y guías de clases fáciles de leer. Construida con Next.js y sin base de datos (todo son datos estáticos).

> Proyecto de fans, sin ánimo de lucro y de código abierto.

## Secciones

- **Inicio** (`/`) — portada con acceso a las secciones.
- **Grimorio** (`/grimorio`) — 391 conjuros filtrables por clase, nivel de conjuro, escuela, ritual, concentración y componentes, con buscador y ficha de detalle (unidades en pies/metros).
- **Clases** (`/clases`) — guías de clase con descripción, ficha, equipo, tabla de progresión interactiva, rasgos en acordeón y subclases. Disponibles: **Monje, Pícaro, Hechicero** (las clases lanzadoras incluyen tabla de espacios de conjuro y metamagia).

## Cómo ejecutarlo

```bash
npm install
npm run dev      # http://localhost:3000
```

Producción: `npm run build && npm start`.

## PWA

- `src/app/manifest.js` genera el `manifest.webmanifest` (instalable, tema oscuro, iconos en `public/`).
- `public/sw.js` es un service worker con estrategia *stale-while-revalidate* para GET del mismo origen: tras la primera visita, las páginas y recursos ya vistos funcionan sin conexión. Se registra desde `src/app/layout.js` (sin `useEffect`).

## Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS v4**
- Datos estáticos en `src/data/` · filtrado y acordeones con `useState`/`useMemo` (sin `useEffect`)

## Estructura

```
src/
  app/
    layout.js · page.js · manifest.js · icon.png · apple-icon.png
    grimorio/page.js
    clases/page.js · clases/<slug>/page.js
  components/   SiteNav · SpellLibrary · Filters · SpellCard · SpellDetail · ClassGuide
  lib/          dnd.js (conjuros) · clases.js (índice de clases)
  data/
    spells.json
    clases/     monje.json · picaro.json · hechicero.json
public/         sw.js · icon-192.png · icon-512.png · icon-512-maskable.png
```

## Añadir una clase

1. Crea `src/data/clases/<slug>.json` siguiendo el esquema de los existentes (`descripcion`, `ficha`, `equipo`, `tabla`, `rasgos`, `subclase`, y para lanzadores `magia` y `metamagia`).
2. Marca la clase con `disponible: true` (y `color`/`lema`) en `src/lib/clases.js`.
3. Crea la ruta `src/app/clases/<slug>/page.js` que importe el JSON y renderice `<ClassGuide data={...} />`.

El componente `ClassGuide` se adapta a los datos: no hace falta tocarlo.

## Créditos y licencias

Este proyecto se apoya en trabajo de otras personas y organizaciones. Gracias a todas ellas.

| Recurso | Fuente | Licencia / uso |
| --- | --- | --- |
| Datos de conjuros (español) | [Jtachan/DnD-5.5-Spells-ES](https://github.com/Jtachan/DnD-5.5-Spells-ES) | CC BY 4.0 |
| Reglas base de los conjuros | SRD 5.2, Wizards of the Coast | CC BY 4.0 |
| Texto de las clases (español) | [nivel20.com](https://nivel20.com/games/dnd-2024) (TwinCoders) | Marcas/IP de WotC bajo la *Fan Site Policy* |
| Ilustraciones de clase | [D&D Beyond](https://www.dndbeyond.com/) | © Wizards of the Coast |
| Tipografías | [Cinzel](https://fonts.google.com/specimen/Cinzel) y [EB Garamond](https://fonts.google.com/specimen/EB+Garamond) (Google Fonts) | SIL Open Font License 1.1 |
| Icono / favicon | Proyecto propio *dark-dawn-dnd* | Del autor |
| Framework e librerías | [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) | MIT |

### Atribución de los datos de conjuros (CC BY 4.0)

Los conjuros provienen del **SRD 5.2 © Wizards of the Coast**, publicado bajo
**[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)**,
con traducción y estructura del proyecto **DnD-5.5-Spells-ES** (también CC BY 4.0).

## Licencia

- **Código fuente:** [MIT](./LICENSE).
- **Contenido de juego e ilustraciones:** **no** están cubiertos por la licencia MIT. Pertenecen a Wizards of the Coast (y, en el caso de los textos en español, a nivel20.com / TwinCoders) y se incluyen con fines informativos y no comerciales. Los datos de conjuros se rigen por CC BY 4.0.

Si reutilizas o despliegas este proyecto, mantén las atribuciones y respeta la
[Fan Content Policy de Wizards of the Coast](https://company.wizards.com/en/legal/fancontentpolicy)
y la licencia CC BY 4.0 de los datos de conjuros.

## Aviso legal

Wizards of the Coast, Dungeons & Dragons y sus logotipos son marcas registradas
de Wizards of the Coast LLC. Este proyecto **no está afiliado, avalado ni
patrocinado** por Wizards of the Coast. Es una herramienta de fans, sin ánimo de
lucro, creada bajo la política de contenido de fans de Wizards.

## Contribuir

Las contribuciones son bienvenidas: nuevas clases, correcciones de erratas o
mejoras de interfaz. Abre un *issue* o un *pull request*. Ten en cuenta que el
contenido de juego debe respetar las licencias y atribuciones anteriores.
