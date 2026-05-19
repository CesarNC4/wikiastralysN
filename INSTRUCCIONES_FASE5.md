# Fase 5 — Cloudinary: instrucciones completas

---

## 1. Crear cuenta en Cloudinary (gratis)

1. Ve a https://cloudinary.com y crea una cuenta gratuita
2. En el dashboard verás tu **Cloud Name** (algo como `dxyz1234`)
3. Ve a **Settings → Upload → Upload presets**
4. Clic en **"Add upload preset"**
5. Configura:
   - **Preset name**: `wikiastralys` (o el nombre que quieras)
   - **Signing Mode**: `Unsigned` ← **importante**, sin esto no funciona desde el browser
   - **Folder**: `wikiastralys` (opcional, para organizar)
6. Guarda el preset

---

## 2. Agregar variables al .env

```env
CLOUDINARY_CLOUD_NAME=tu_cloud_name_aqui
CLOUDINARY_UPLOAD_PRESET=wikiastralys
```

---

## 3. Agregar variables en Vercel

En el dashboard de Vercel → tu proyecto → **Settings → Environment Variables**:

| Key | Value |
|-----|-------|
| `CLOUDINARY_CLOUD_NAME` | tu cloud name |
| `CLOUDINARY_UPLOAD_PRESET` | wikiastralys |

---

## 4. Reemplazar el nuxt.config.ts

Usa el `nuxt.config.ts` incluido en este zip (agrega el `runtimeConfig` con las variables públicas).

---

## 5. Usar el componente en los formularios

El componente `CloudinaryUpload` reemplaza cualquier `<input>` de URL de imagen.

**Antes** (en cualquier `[id].vue` del admin):
```vue
<Field label="URL Imagen"><input v-model="f.imagen_url" placeholder="https://..." /></Field>
<img v-if="f.imagen_url" :src="f.imagen_url" class="img-preview" />
```

**Después**:
```vue
<Field label="Imagen">
  <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/personajes" />
</Field>
```

**Props disponibles:**

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `v-model` | String | `''` | URL de la imagen (se llena automáticamente al subir) |
| `label` | String | `'Subir imagen'` | Texto en la zona de drop |
| `icon` | String | `'🖼'` | Emoji en la zona de drop |
| `folder` | String | `'wikiastralys'` | Carpeta en Cloudinary |
| `maxMb` | Number | `10` | Tamaño máximo en MB |

---

## 6. Carpetas sugeridas por sección

Usar carpetas distintas facilita organizar en Cloudinary:

```
wikiastralys/personajes
wikiastralys/naciones
wikiastralys/razas
wikiastralys/organizaciones
wikiastralys/familias
wikiastralys/bestiario
wikiastralys/lord-demonio
wikiastralys/armas
wikiastralys/magia
wikiastralys/lore
wikiastralys/banners
```

---

## 7. Qué hace el componente

- **Drag & drop** o clic para abrir el selector de archivo
- Acepta JPG, PNG, WEBP, GIF
- Sube directo a Cloudinary desde el browser (sin pasar por tu servidor)
- La URL resultante incluye `q_auto,f_auto` — Cloudinary comprime y convierte automáticamente a WebP cuando el browser lo soporta
- Al subir exitosamente, actualiza el `v-model` con la URL final
- Si ya hay una imagen, muestra preview con botones "Cambiar" y "Quitar"

---

## 8. Spring Boot — confirmación de retiro

No quedan referencias a Spring Boot en el proyecto Nuxt. El backend está completamente desacoplado.
Puedes archivar o eliminar el repositorio `wikiastralys-master` con seguridad.
