# Wikiastralys — Contexto técnico del proyecto

## Qué es
Wiki personal para una historia de fantasía épica llamada **Astralys**. Sin fines de lucro, solo entretenimiento. Es una wiki de autor — solo el creador puede editar, el público solo puede leer.

---

## Stack
- **Nuxt 4.4.5** + Vue 3.5 + pnpm
- **Supabase** — PostgreSQL como base de datos, Auth para autenticación del admin
- **Vercel** — deploy automático desde GitHub (plan gratuito, repo privado)
- **Cloudinary** — almacenamiento de imágenes (plan gratuito, 25GB)
- **YouTube No Listado** — para audio (canciones de IA) y video
- **VS Code** como editor

**Ubicación local:** `C:\Users\cesar\Downloads\LORE\Wikiastralys\wikiastralys-nuxt`

---

## Diseño

Estética fantasía épica oscura — paleta "Void Astralys" (violeta-carmesí). Usar siempre las CSS custom properties, nunca valores hardcoded.

| Token CSS | Valor | Uso |
|-----------|-------|-----|
| `--bg` | `#06040f` | Fondo base |
| `--s1` | `#0c0a1a` | Superficies |
| `--s2` | `#130f24` | Superficies elevadas |
| `--bd` | `#1e1a36` | Bordes sutiles |
| `--bd-strong` | `#2a2450` | Bordes visibles |
| `--t1` | `#edeaff` | Texto principal |
| `--t2` | `#7a72a8` | Texto secundario |
| `--t3` | `#44406a` | Texto terciario |
| `--accent` | `#c42040` | Carmesí — acento principal |
| `--accent-dim` | `rgba(196,32,64,0.10)` | Glow de acento |
| `--gold` | `#9e7824` | Dorado — solo decorativo |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Easing estándar |
| `--ease-inout` | `cubic-bezier(0.77, 0, 0.175, 1)` | Easing en movimiento |

**Tipografías** (via `@nuxtjs/google-fonts`):
- **Cormorant Garamond** — display/hero, títulos grandes (300, 400, 600, 700)
- **Cinzel** — labels, nav, eyebrows, Cinzel uppercase (400, 600, 700)
- **Crimson Pro** — cuerpo de texto, inputs (300, 400, itálicas)

---

## Variables de entorno (.env)

```env
SUPABASE_URL=https://xjalihfqzitkxlskxyih.supabase.co
SUPABASE_KEY=eyJ...  (anon key — pestaña "Legacy anon, service_role API keys")
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_UPLOAD_PRESET=wikiastralys
```

Las variables de Cloudinary también deben estar en Vercel → Settings → Environment Variables.

---

## Estructura de archivos

```
app/
├── app.vue
├── assets/
│   └── css/
│       ├── main.css              — estilos globales públicos
│       ├── admin-form.css        — estilos compartidos de formularios admin
│       └── admin-relations.css   — estilos para paneles de relaciones en admin
├── components/
│   ├── AppNav.vue                — navegación pública con dropdown y link /busqueda
│   ├── WikiList.vue              — lista reutilizable para vistas públicas
│   ├── WikiDetail.vue            — detalle reutilizable para vistas públicas
│   ├── WikiSection.vue           — sección de contenido reutilizable
│   └── admin/
│       ├── AdminListPage.vue     — tabla reutilizable para listas del admin
│       ├── Field.vue             — wrapper label+slot para formularios
│       └── CloudinaryUpload.vue  — uploader drag&drop a Cloudinary
├── composables/
│   └── useAdminCrud.ts           — useAdminForm() y useAdminList()
├── layouts/
│   ├── default.vue               — layout público
│   └── admin.vue                 — layout admin (nav + tabs + logout)
├── middleware/
│   └── admin.ts                  — protege todas las rutas /admin/*
└── pages/
    ├── index.vue                 — inicio público
    ├── busqueda/index.vue        — búsqueda global pública (13 tablas)
    ├── personajes/               — vistas públicas (index + [id])
    ├── capitulos/
    ├── naciones/
    ├── razas/
    ├── organizaciones/
    ├── familias/
    ├── bestiario/
    ├── lord-demonio/
    ├── armas/
    ├── magia/
    ├── minerales/
    ├── misiones/
    ├── conceptos/
    ├── banda-sonora/
    ├── lore/
    ├── economia/
    └── admin/
        ├── index.vue             — dashboard con contadores reales
        ├── login.vue             — login con Supabase Auth
        ├── personajes/           — lista + formulario 14 tabs
        ├── capitulos/
        ├── naciones/
        ├── razas/
        ├── organizaciones/
        ├── familias/
        ├── bestiario/
        ├── lord-demonio/
        ├── armas/
        ├── magia/
        ├── minerales/
        ├── misiones/
        ├── conceptos/
        ├── lore/
        ├── canciones/
        ├── monedas/
        ├── timeline/
        ├── gremio/
        ├── notas/
        └── taller/               — editor de tramas (arcos, hojas, consistencia)
```

---

## nuxt.config.ts

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@nuxtjs/google-fonts'],
  css: ['~/assets/css/main.css'],
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/admin/login',
      callback: '/admin',
      exclude: ['/', '/personajes/**', '/capitulos/**', '/naciones/**', '/razas/**',
        '/organizaciones/**', '/familias/**', '/bestiario/**', '/lord-demonio/**',
        '/armas/**', '/magia/**', '/minerales/**', '/misiones/**', '/conceptos/**',
        '/banda-sonora', '/lore/**', '/economia', '/timeline', '/busqueda'],
    },
  },
  googleFonts: {
    families: {
      Cinzel: [400, 600, 700],
      'Crimson Pro': { wght: [300, 400], ital: [300, 400] }
    }
  },
  runtimeConfig: {
    public: {
      cloudinaryCloudName:    process.env.CLOUDINARY_CLOUD_NAME    ?? '',
      cloudinaryUploadPreset: process.env.CLOUDINARY_UPLOAD_PRESET ?? '',
    }
  }
})
```

---

## Autenticación

- Supabase Auth con email/contraseña
- Un solo usuario admin creado en Supabase → Authentication → Users
- El middleware `admin.ts` protege todas las rutas `/admin/*`
- El login vive en `/admin/login` y redirige a `/admin` al autenticarse
- RLS activado en Supabase: SELECT público para `anon`, INSERT/UPDATE/DELETE solo para `authenticated`

---

## Patrones de código

### Páginas públicas
Usan `useSupabaseClient()` directamente en el `<script setup>`. Sin stores, sin composables propios para lectura.

### Páginas admin — lista
```vue
<template>
  <AdminListPage title="X" base-path="/admin/x" :items="items" :columns="COLS"
    :loading="loading" :delete-error="deleteError" @delete="eliminar" />
</template>
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const { items, loading, deleteError, eliminar } = useAdminList('tabla', 'id, nombre, ...', 'nombre')
const COLS = [{ key: 'nombre', label: 'Nombre' }, ...]
</script>
```

### Páginas admin — formulario
```vue
<script setup>
definePageMeta({ layout: 'admin', middleware: 'admin' })
const f = ref({ nombre: '', ... })
const { id, isEdit, loading, saving, error, cargar, guardar } = useAdminForm('tabla', f)
onMounted(cargar)
</script>
```

`guardar(rutaDeVuelta, campoObligatorio)` hace insert o update según `isEdit`.

### Formularios con subtablas (relaciones)
Los que tienen relaciones (naciones → razas, organizaciones → miembros, etc.) cargan las subtablas por separado después del `cargar()` principal y hacen CRUD directo contra Supabase. Ver `organizaciones/[id].vue` como referencia.

### Estilos en formularios admin
Siempre usar:
```vue
<style scoped src="~/assets/css/admin-form.css" />
```
Y si tiene paneles de relaciones:
```vue
<style scoped src="~/assets/css/admin-relations.css" />
```

### CloudinaryUpload
```vue
<Field label="Imagen">
  <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/seccion" />
</Field>
```
Lee `cloudinaryCloudName` y `cloudinaryUploadPreset` del `useRuntimeConfig().public`. Sube directo desde el browser con upload preset unsigned.

---

## Base de datos — tablas principales

| Tabla | Descripción |
|-------|-------------|
| `personajes` | Personaje principal con ~30 columnas |
| `estadisticas` | Stats de combate 1:1 con personajes |
| `habilidades` | Lista de habilidades por personaje |
| `equipamiento` | Items de equipamiento por personaje |
| `relaciones` | Vínculos entre personajes/orgs |
| `eventos_personaje` | Línea de tiempo personal |
| `personaje_narrativa` | Data de autor: arco, estado, notas privadas |
| `personaje_narrativa_hito` | Hitos narrativos del personaje |
| `capitulos` | Capítulos de la historia |
| `actos` | Subdivisiones de capítulos |
| `naciones` | Naciones del mundo |
| `razas` | Razas del mundo |
| `organizaciones` | Organizaciones con rangos y facciones |
| `familias` | Familias nobles con árbol genealógico |
| `familia_arbol` | Nodos del árbol familiar |
| `gremio` | El Gremio de Aventureros (registro único) |
| `bestias` | Bestiario |
| `lord_demonio` | Lords Demonio |
| `armas_artefactos` | Armas y artefactos |
| `magia_fundamentos` | Sistema de magia por categorías |
| `minerales` | Minerales del mundo |
| `misiones` | Misiones del gremio |
| `conceptos` | Conceptos del mundo agrupados por categoría |
| `paginas_lore` | Páginas de lore con hasta 6 secciones |
| `canciones` | Banda sonora con URL (YouTube o Cloudinary) |
| `sistema_monetario` | Monedas y economía |
| `timeline_eventos` | Eventos históricos |
| `nota_privada` | Notas de autor por entidad (solo admin) |
| `trama_arcos` | Arcos narrativos |
| `trama_hojas` | Hojas de trama dentro de arcos |
| `hoja_personaje` | Personajes involucrados en una hoja |
| `hoja_cancion` | Canciones de una hoja |
| `hoja_dependencia` | Prerequisitos entre hojas |

### Tablas de relación N:M frecuentes
- `nacion_raza`, `nacion_organizacion`
- `personaje_nacion`, `personaje_raza`, `personaje_organizacion`
- `personaje_cancion`, `capitulo_cancion`, `acto_cancion`
- `capitulo_personaje`
- `org_rangos`, `org_facciones`, `org_jerarquia`, `org_historial`
- `gremio_rangos`, `gremio_facciones`, `gremio_jerarquia`, `gremio_historial`
- `familia_facciones`, `familia_jerarquia`, `familia_arbol`

---

## Taller de Tramas (/admin/taller)

Panel split: sidebar con árbol de arcos/hojas + panel principal.

- **Arcos** (`trama_arcos`) → tienen hojas hijas
- **Hojas** (`trama_hojas`) → tienen personajes, canciones y dependencias
- **Consistencia** — detecta hojas bloqueadas por prerequisitos, hojas sin capítulo, personajes muertos sin hito de muerte
- **Borradores** — capítulos ocultos, actos pendientes, hojas en Idea/En desarrollo

---

## Convenciones importantes

- Los nombres de tablas son **snake_case** exactos — cualquier discrepancia rompe las queries
- `bestiario` en las rutas pero la tabla se llama `bestias`
- `armas` en las rutas pero la tabla se llama `armas_artefactos`
- `monedas` en las rutas pero la tabla se llama `sistema_monetario`
- `magia` en las rutas pero la tabla se llama `magia_fundamentos`
- `lore` en las rutas pero la tabla se llama `paginas_lore`
- `canciones` tiene campo `titulo` (no `nombre`) — afecta búsquedas y eliminaciones
- `timeline_eventos` tiene campo `titulo` (no `nombre`)
- `nota_privada` usa ruta `/admin/notas/nueva` (no `/nuevo`) para evitar conflicto con `[id]`
- El gremio es un registro único — `index.vue` detecta si existe y redirige al edit
- `personaje_narrativa` tiene unique constraint en `personaje_id` — usar upsert con `onConflict: 'personaje_id'`
- `estadisticas` también usa upsert con `onConflict: 'personaje_id'`

---

## Lo que NO existe todavía (posibles próximas features)

- Editor de texto enriquecido (actualmente todos los campos largos son `<textarea>`)
- Búsqueda global desde el admin (solo existe en el público `/busqueda`)
- Paginación en las listas del admin (actualmente carga todo)
- Historial de cambios / versiones
- Modo lectura offline / PWA

---

## Reglas de comportamiento para Claude

1. **No programar sin contexto** — leer archivos relevantes antes de escribir código. Si falta contexto, preguntar.
2. **Respuestas cortas** — 1-3 oraciones. Sin preámbulos ni resumen final. No repetir lo que dijo el usuario.
3. **No reescribir archivos completos** — usar Edit (reemplazo parcial). Write solo si el cambio es >80% del archivo.
4. **No releer archivos ya leídos** — si ya se leyó en esta conversación, no volver a leer salvo que haya cambiado.
5. **Validar antes de declarar hecho** — nunca decir "listo" sin evidencia de que funciona.
6. **Cero charla aduladora** — sin "Excelente pregunta", "Gran idea", "Perfecto". Directo al trabajo.
7. **Soluciones simples** — implementar lo mínimo que resuelve el problema. Sin abstracciones, helpers ni features no pedidos.
8. **No pelear con el usuario** — si el usuario dice "hazlo así", hacerlo. Mencionar concerns en 1 oración y proceder.
9. **Leer solo lo necesario** — usar offset y limit. Si se sabe la ruta exacta, usar Read directo sin Glob+Grep previo.
10. **No narrar el plan antes de ejecutar** — solo ejecutar. El usuario ve los tool calls.
11. **Paralelizar tool calls** — leer múltiples archivos independientes en un solo mensaje.
12. **No duplicar código en la respuesta** — si se editó un archivo, no copiar el resultado en texto. El usuario lo ve en el diff.
13. **No usar Agent cuando Grep/Read basta** — Agent solo para búsquedas amplias o tareas complejas de múltiples pasos.
