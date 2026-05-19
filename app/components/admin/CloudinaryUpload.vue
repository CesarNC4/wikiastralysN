<template>
  <div class="cl-upload" :class="{ dragging, disabled: !cloudName || !uploadPreset }">

    <!-- Preview mode -->
    <div v-if="modelValue" class="cl-preview">
      <img :src="modelValue" class="cl-img" :alt="label" />
      <div class="cl-preview-overlay">
        <button class="cl-change" @click="triggerInput">Cambiar</button>
        <button class="cl-remove" @click="$emit('update:modelValue', '')">✕ Quitar</button>
      </div>
    </div>

    <!-- Upload zone -->
    <div v-else
      class="cl-zone"
      :class="{ uploading }"
      @click="triggerInput"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <div v-if="uploading" class="cl-progress">
        <div class="cl-spinner"></div>
        <span>{{ progressText }}</span>
      </div>
      <template v-else>
        <span class="cl-icon">{{ icon }}</span>
        <span class="cl-label">{{ label }}</span>
        <span class="cl-hint">Arrastra o haz clic · JPG, PNG, WEBP · máx {{ maxMbLabel }}</span>
      </template>
    </div>

    <input
      ref="inputRef"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      class="cl-input-hidden"
      @change="onFileChange"
    />

    <p v-if="uploadError" class="cl-error">{{ uploadError }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue:   { type: String,  default: '' },
  label:        { type: String,  default: 'Subir imagen' },
  icon:         { type: String,  default: '🖼' },
  folder:       { type: String,  default: 'wikiastralys' },  // carpeta en Cloudinary
  maxMb:        { type: Number,  default: 10 },
})

defineEmits(['update:modelValue'])
const emit = defineEmits(['update:modelValue'])

// Lee las variables de entorno públicas del runtimeConfig
const config       = useRuntimeConfig()
const cloudName    = config.public.cloudinaryCloudName
const uploadPreset = config.public.cloudinaryUploadPreset

const inputRef    = ref(null)
const dragging    = ref(false)
const uploading   = ref(false)
const uploadError = ref('')
const progressText = ref('Subiendo...')

const maxMbLabel = computed(() => `${props.maxMb}MB`)

function triggerInput() {
  if (uploading.value) return
  inputRef.value?.click()
}

function onDrop(e) {
  dragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) upload(file)
}

function onFileChange(e) {
  const file = e.target.files?.[0]
  if (file) upload(file)
  e.target.value = ''
}

async function upload(file) {
  uploadError.value = ''

  if (!cloudName || !uploadPreset) {
    uploadError.value = 'Faltan CLOUDINARY_CLOUD_NAME y CLOUDINARY_UPLOAD_PRESET en .env'
    return
  }

  if (file.size > props.maxMb * 1024 * 1024) {
    uploadError.value = `El archivo supera los ${props.maxMb}MB.`
    return
  }

  uploading.value  = true
  progressText.value = 'Subiendo...'

  const fd = new FormData()
  fd.append('file',           file)
  fd.append('upload_preset',  uploadPreset)
  fd.append('folder',         props.folder)

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: fd }
    )
    if (!res.ok) throw new Error(`Cloudinary error ${res.status}`)
    const data = await res.json()
    // Usar URL con transformación: auto calidad, auto formato
    const url = data.secure_url.replace('/upload/', '/upload/q_auto,f_auto/')
    emit('update:modelValue', url)
  } catch (e) {
    uploadError.value = e.message || 'Error al subir la imagen.'
  } finally {
    uploading.value = false
  }
}
</script>

<style scoped>
.cl-upload { display: flex; flex-direction: column; gap: 6px; }

.cl-zone {
  background: #0e0b07;
  border: 1px dashed #2a2010;
  border-radius: 3px;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
  min-height: 90px;
  justify-content: center;
  text-align: center;
}
.cl-zone:hover, .cl-upload.dragging .cl-zone { border-color: #c8a84b; background: #12100a; }
.cl-zone.uploading { cursor: default; }

.cl-icon  { font-size: 1.4rem; line-height: 1; }
.cl-label { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em; color:#5a4a30; text-transform:uppercase; }
.cl-hint  { font-family:'Crimson Pro',serif; font-size:0.78rem; color:#3a2a10; }

.cl-progress { display:flex; flex-direction:column; align-items:center; gap:10px; }
.cl-spinner  {
  width:20px; height:20px; border:2px solid #2a2010;
  border-top-color:#c8a84b; border-radius:50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.cl-progress span { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em; color:#4a3a20; }

.cl-preview {
  position: relative;
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid #2a2010;
}
.cl-img { width:100%; max-height:180px; object-fit:cover; object-position:top; display:block; }
.cl-preview-overlay {
  position: absolute;
  inset: 0;
  background: rgba(14,11,7,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s;
}
.cl-preview:hover .cl-preview-overlay { opacity: 1; }

.cl-change {
  font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em;
  padding:7px 14px; background:#c8a84b; border:none; color:#0e0b07;
  border-radius:2px; cursor:pointer; transition:background 0.2s;
}
.cl-change:hover { background:#e0c060; }
.cl-remove {
  font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.15em;
  padding:7px 14px; background:transparent; border:1px solid #e24b4a;
  color:#e24b4a; border-radius:2px; cursor:pointer; transition:all 0.2s;
}
.cl-remove:hover { background:#e24b4a; color:#fff; }

.cl-input-hidden { display:none; }
.cl-error { color:#e24b4a; font-size:0.82rem; font-style:italic; }
</style>
