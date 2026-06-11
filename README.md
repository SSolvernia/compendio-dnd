# Compendio · D&D 2024 (en español)

Aplicación web (PWA) que reúne un **compendio de Dungeons & Dragons (reglas 2024 / 5.5e) en español**: una biblioteca de conjuros filtrable y guías de clases fáciles de leer. Construida con Next.js y sin base de datos (todo son datos estáticos).

> Proyecto de fans, sin ánimo de lucro y de código abierto.

## Secciones

- **Inicio** (`/`) — portada con acceso a las secciones.
- **Grimorio** (`/grimorio`) — 391 conjuros filtrables por clase, nivel de conjuro, escuela, ritual, concentración y componentes, con buscador y ficha de detalle (unidades en pies/metros).
- **Clases** (`/clases`) — guías de clase con descripción, ficha, equipo, tabla de progresión interactiva, rasgos en acordeón y subclases. Disponibles: **Monje, Pícaro, Hechicero** (las clases lanzadoras incluyen tabla de espacios de conjuro y metamagia).
- **Ficha** (`/personaje`) — hoja de personaje interactiva con **cálculo automático**, con un diseño inspirado en la hoja oficial 2024: banda de identidad+combate arriba, columna de características con salvaciones y habilidades agrupadas por característica, y stats/rasgos/conjuros/equipo a la derecha. Modificadores, bonificador por competencia, CA, salvaciones, habilidades, PG, percepción pasiva, CD y ataque de conjuros y espacios de conjuro se calculan solos (reglas 2024), con ayudas explicativas al pasar el cursor. Incluye selector de conjuros (integrado con el Grimorio), equipo, dotes y exportar/importar la ficha en JSON. La ficha vive en memoria (la persistencia llegará en una fase futura).

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
    personaje/page.js
  components/   SiteNav · SpellLibrary · Filters · SpellCard · SpellDetail · ClassGuide
    character/  CharacterSheet + Identity · AbilityColumn · CombatBar · StatsRow ·
                Spells · SpellPicker · Equipment · Features · SheetToolbar · ui
  lib/          dnd.js (conjuros) · clases.js (índice de clases)
    character/  constants · calculations · derive · schema · io (motor de cálculo, puro y sin React)
  data/
    spells.json
    clases/     monje.json · picaro.json · hechicero.json   (guías editoriales)
    srd/        clases.json · especies.json · trasfondos.json · dotes.json · herramientas.json · equipo.json  (datos mecánicos del SRD)
scripts/        extract-srd.mjs · slice-srd.mjs · assemble-classes.mjs · validate-srd.mjs · class-tables.mjs
reference/      material local NO versionado (PDF fuente, texto extraído); solo se versiona ATRIBUCION.txt
public/         sw.js · icon-192.png · icon-512.png · icon-512-maskable.png
```

> Convención del código: identificadores y nombres de archivo en inglés; el contenido (textos
> de UI, claves de los JSON de datos del SRD y códigos de dominio como `FUE/DES`) en español.

## Datos del SRD (pipeline reproducible)

Los datos mecánicos de la ficha (`src/data/srd/`, **commiteados**) se extraen del **SRD 5.2.1
en español** una sola vez con `pdftotext` (poppler). La carpeta `reference/` es material de
trabajo local y **no se versiona**: la app solo necesita los JSON ya commiteados. Para
regenerarlos:

```bash
cp ~/Downloads/SP_SRD_CC_v5.2.1.pdf reference/   # copia el fuente (no se versiona)
npm run srd:extract      # pdftotext -> reference/clean/*.txt + secciones troceadas
# (la prosa de clases/especies/trasfondos/dotes se transforma a JSON en src/data/srd/)
npm run srd:build        # ensambla clases.json y valida invariantes (12 clases, salvaciones, lanzadores…)
```

Sin `reference/` presente, `srd:build` no sobrescribe nada: el ensamblador aborta y el
validador solo comprueba el esquema de los JSON commiteados (omite la comparación contra el
PDF). Las tablas de espacios de conjuro 2024 están fijadas como canónicas en
`src/lib/character/constants.js` (3 tablas: completo/semi/pacto), no se parsean del PDF.

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
| Datos de juego de la ficha (clases, especies, trasfondos, dotes, equipo) | [SRD 5.2.1 (español)](https://www.dndbeyond.com/srd), Wizards of the Coast | CC BY 4.0 |
| Texto de las clases (español) | [nivel20.com](https://nivel20.com/games/dnd-2024) (TwinCoders) | Marcas/IP de WotC bajo la *Fan Site Policy* |
| Ilustraciones de clase | [D&D Beyond](https://www.dndbeyond.com/) | © Wizards of the Coast |
| Tipografías | [Cinzel](https://fonts.google.com/specimen/Cinzel) y [EB Garamond](https://fonts.google.com/specimen/EB+Garamond) (Google Fonts) | SIL Open Font License 1.1 |
| Icono / favicon | Proyecto propio *dark-dawn-dnd* | Del autor |
| Framework e librerías | [Next.js](https://nextjs.org/), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/) | MIT |

### Atribución de los datos de conjuros (CC BY 4.0)

Los conjuros provienen del **SRD 5.2 © Wizards of the Coast**, publicado bajo
**[Creative Commons Attribution 4.0](https://creativecommons.org/licenses/by/4.0/)**,
con traducción y estructura del proyecto **DnD-5.5-Spells-ES** (también CC BY 4.0).

### Atribución de los datos de juego de la ficha (SRD 5.2.1, CC BY 4.0)

Los datos mecánicos de la ficha de personaje (`src/data/srd/`) y el texto de
`reference/clean/` derivan del SRD 5.2.1, con la atribución requerida:

> Esta obra incluye material procedente del documento de referencia del sistema
> 5.2.1 ("SRD 5.2.1") de Wizards of the Coast LLC, disponible en
> <https://www.dndbeyond.com/srd>. La licencia sobre el SRD 5.2.1 se concede de
> acuerdo con la licencia internacional de atribución/reconocimiento 4.0 de
> Creative Commons, disponible en <https://creativecommons.org/licenses/by/4.0/legalcode>.

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
