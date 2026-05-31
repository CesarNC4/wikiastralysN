<template>
  <div class="rich-editor">
    <div v-if="editor" class="rich-toolbar">
      <button type="button" :class="{ active: editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">B</button>
      <button type="button" :class="{ active: editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">I</button>
      <button type="button" :class="{ active: editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
      <button type="button" :class="{ active: editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">H3</button>
      <button type="button" :class="{ active: editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">• Lista</button>
      <button type="button" :class="{ active: editor.isActive('blockquote') }" @click="editor.chain().focus().toggleBlockquote().run()">❝</button>
      <button type="button" @click="editor.chain().focus().setHorizontalRule().run()">—</button>
      <span class="toolbar-sep"></span>
      <button type="button" @click="editor.chain().focus().undo().run()">↩</button>
      <button type="button" @click="editor.chain().focus().redo().run()">↪</button>
    </div>
    <EditorContent :editor="editor" class="rich-content" />
  </div>
</template>

<script setup>
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Escribe aquí...' },
})
const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Placeholder.configure({ placeholder: props.placeholder }),
  ],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(() => props.modelValue, (val) => {
  if (editor.value && editor.value.getHTML() !== val) {
    editor.value.commands.setContent(val, false)
  }
})

onBeforeUnmount(() => editor.value?.destroy())
</script>

<style scoped>
.rich-editor {
  border: 1px solid #2a2010;
  border-radius: 2px;
  background: #0e0b07;
  overflow: hidden;
}
.rich-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 6px 10px;
  background: #12100a;
  border-bottom: 1px solid #2a2010;
  flex-wrap: wrap;
}
.rich-toolbar button {
  background: transparent;
  border: 1px solid transparent;
  color: #5a4a30;
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  padding: 4px 9px;
  border-radius: 2px;
  cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
  white-space: nowrap;
}
.rich-toolbar button:hover { color: #a89070; border-color: #2a2010; }
.rich-toolbar button.active { color: #c8a84b; border-color: #c8a84b; }
.toolbar-sep { width: 1px; height: 18px; background: #2a2010; margin: 0 4px; }

.rich-content {
  padding: 12px 14px;
  min-height: 160px;
  color: #e8dfc8;
  font-family: 'Crimson Pro', Georgia, serif;
  font-size: 0.95rem;
  line-height: 1.7;
  outline: none;
}
</style>

<style>
/* Estilos globales del editor (no scoped — Tiptap inyecta clases en el DOM) */
.rich-content .ProseMirror { outline: none; }
.rich-content .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #2a2010;
  pointer-events: none;
  float: left;
  height: 0;
}
.rich-content h2 { font-family: 'Cinzel', serif; font-size: 1rem; letter-spacing: 0.08em; color: #c8a84b; margin: 1rem 0 0.4rem; }
.rich-content h3 { font-family: 'Cinzel', serif; font-size: 0.85rem; letter-spacing: 0.08em; color: #a89070; margin: 0.8rem 0 0.3rem; }
.rich-content p { margin: 0 0 0.6rem; }
.rich-content ul { padding-left: 1.4rem; margin: 0.4rem 0; }
.rich-content li { margin-bottom: 0.2rem; }
.rich-content blockquote { border-left: 2px solid #c8a84b; padding-left: 12px; color: #7a6a50; font-style: italic; margin: 0.6rem 0; }
.rich-content hr { border: none; border-top: 1px solid #2a2010; margin: 1rem 0; }
.rich-content strong { color: #f0e4c0; }
.rich-content em { color: #a89070; }
</style>
