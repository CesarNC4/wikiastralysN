<template>
  <div>
    <div class="form-header">
      <NuxtLink to="/admin/personajes" class="btn-back">← Personajes</NuxtLink>
      <h1 class="form-title">{{ isEdit ? `${f.nombre || 'Editar Personaje'}` : 'Nuevo Personaje' }}</h1>
      <div style="display:flex;gap:8px;margin-left:auto">
        <NuxtLink v-if="isEdit" :to="`/personajes/${id}`" target="_blank" class="btn-back">Ver wiki ↗</NuxtLink>
        <button class="btn-save" :disabled="saving" @click="guardarPersonaje">
          {{ saving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </div>
    <p v-if="error" class="form-error">{{ error }}</p>

    <!-- Tabs -->
    <div class="inner-tabs">
      <button v-for="t in TABS" :key="t.key"
        class="inner-tab" :class="{ active: tab === t.key, autor: t.autor }"
        @click="tab = t.key">{{ t.label }}</button>
    </div>

    <div v-if="loading" class="loading-msg">Cargando...</div>
    <template v-else>

      <!-- ══ BÁSICO ══ -->
      <div v-if="tab === 'basico'" class="form-grid">
        <div>
          <div class="section">
            <div class="sec-title">Información General</div>
            <div class="row2">
              <Field label="Nombre *"><input v-model="f.nombre" /></Field>
              <Field label="Apellido"><input v-model="f.surname" /></Field>
            </div>
            <div class="row2">
              <Field label="Título / Apodo"><input v-model="f.titulo" /></Field>
              <Field label="Subtítulo narrativo"><input v-model="f.subtitulo" placeholder="Ej: El que desafió al Destino" /></Field>
            </div>
            <Field label="Ocupación"><input v-model="f.ocupacion" /></Field>
            <div class="row3">
              <Field label="Edad"><input v-model="f.edad" /></Field>
              <Field label="Género">
                <select v-model="f.genero">
                  <option value="">—</option><option>Masculino</option><option>Femenino</option><option>Otro</option>
                </select>
              </Field>
              <Field label="Altura (m)"><input type="number" step="0.01" v-model.number="f.altura" /></Field>
            </div>
            <div class="row2">
              <Field label="Rango Aventurero">
                <select v-model="f.rango_aventurero">
                  <option value="">—</option>
                  <option>Bronce</option><option>Plata</option><option>Oro</option>
                  <option>Platino</option><option>Diamante</option>
                </select>
              </Field>
              <Field label="Lugar de Nacimiento"><input v-model="f.lugar_nacimiento" /></Field>
            </div>
            <div style="display:flex;gap:16px;align-items:center;margin-top:4px">
              <label class="check-label"><input type="checkbox" v-model="f.es_invocado" /> Invocado de otro mundo</label>
              <Field v-if="f.es_invocado" label="Tipo Invocación" style="flex:1;margin-bottom:0">
                <select v-model="f.tipo_invocacion">
                  <option value="">— Sin especificar —</option>
                  <option value="Natural">Natural (Filaydea / Alice)</option>
                  <option value="Ishkoriana">Ishkoriana (artificial)</option>
                </select>
              </Field>
            </div>
          </div>
        </div>
        <div>
          <div class="section">
            <div class="sec-title">Imágenes</div>
            <Field label="Imagen">
              <CloudinaryUpload v-model="f.imagen_url" label="Imagen" folder="wikiastralys/personajes" />
            </Field>
            <Field label="Banner">
              <CloudinaryUpload v-model="f.banner_url" label="Banner" icon="🖼" folder="wikiastralys/personajes/banners" />
            </Field>
          </div>
          <div class="section">
            <div class="sec-title">Visibilidad</div>
            <label class="check-label"><input type="checkbox" v-model="f.visible" /> Visible al público</label>
          </div>
        </div>
      </div>

      <!-- ══ HISTORIA ══ -->
      <div v-if="tab === 'historia'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Historia Personal</div>
          <Field label="Historia">
            <RichEditor v-model="f.historia" placeholder="Historia del personaje..." />
          </Field>
        </div>
      </div>

      <!-- ══ PERSONALIDAD ══ -->
      <div v-if="tab === 'personalidad'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Psicología</div>
          <Field label="Rasgos de Personalidad"><textarea v-model="f.rasgos_personalidad" rows="5" /></Field>
          <Field label="Filosofía / Principios"><textarea v-model="f.filosofia" rows="4" /></Field>
          <div class="row2">
            <Field label="Motivaciones / Objetivos"><textarea v-model="f.motivacion" rows="4" /></Field>
            <Field label="Miedos"><textarea v-model="f.miedos" rows="4" /></Field>
          </div>
          <div class="row2">
            <Field label="Gustos"><textarea v-model="f.gustos" rows="4" /></Field>
            <Field label="Disgustos"><textarea v-model="f.disgustos" rows="4" /></Field>
          </div>
        </div>
      </div>

      <!-- ══ MAGIA ══ -->
      <div v-if="tab === 'magia'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Sistema Mágico</div>
          <div class="row3">
            <Field label="Magia Principal">
              <select v-model="f.tipo_magia_principal">
                <option value="">—</option>
                <optgroup label="Elemental">
                  <option value="Elemental (Pyro)">🔥 Pyro</option>
                  <option value="Elemental (Hydro)">💧 Hydro</option>
                  <option value="Elemental (Electro)">⚡ Electro</option>
                  <option value="Elemental (Cryo)">❄️ Cryo</option>
                  <option value="Elemental (Dendro)">🌿 Dendro</option>
                  <option value="Elemental (Vento)">🌪️ Vento</option>
                  <option value="Elemental (Geo)">🪨 Geo</option>
                </optgroup>
                <optgroup label="Otras">
                  <option value="Ritual">⚗️ Ritual</option>
                  <option value="Runica">✦ Rúnica</option>
                  <option value="Oscura">🌑 Oscura</option>
                  <option value="Antigua (Lumino)">☀️ Lumino</option>
                  <option value="Antigua (Umbra)">🌑 Umbra</option>
                  <option value="Sin Magia">Sin Magia</option>
                </optgroup>
              </select>
            </Field>
            <Field label="Magia Secundaria">
              <select v-model="f.magia_secundaria">
                <option value="N/A">N/A</option>
                <optgroup label="Elemental">
                  <option value="Elemental (Pyro)">🔥 Pyro</option>
                  <option value="Elemental (Hydro)">💧 Hydro</option>
                  <option value="Elemental (Electro)">⚡ Electro</option>
                  <option value="Elemental (Cryo)">❄️ Cryo</option>
                  <option value="Elemental (Dendro)">🌿 Dendro</option>
                  <option value="Elemental (Vento)">🌪️ Vento</option>
                  <option value="Elemental (Geo)">🪨 Geo</option>
                </optgroup>
                <optgroup label="Otras">
                  <option value="Ritual">⚗️ Ritual</option>
                  <option value="Runica">✦ Rúnica</option>
                  <option value="Oscura">🌑 Oscura</option>
                </optgroup>
              </select>
            </Field>
            <Field label="Nivel de Consciencia">
              <select v-model="f.nivel_de_consciencia">
                <option value="">—</option>
                <option>D</option><option>C</option><option>B</option><option>A</option><option>S</option>
              </select>
            </Field>
          </div>
          <Field label="Circuito Forte"><textarea v-model="f.circuito_forte" rows="3" /></Field>
          <Field label="Essentia"><textarea v-model="f.essentia" rows="3" /></Field>
          <Field label="Zenithra"><textarea v-model="f.zenithra" rows="3" /></Field>
          <Field label="Bendición"><textarea v-model="f.bendicion" rows="3" /></Field>
          <Field label="Segundo Despertar"><textarea v-model="f.segundo_despertar" rows="3" /></Field>
          <Field label="Debilidades"><textarea v-model="f.debilidades" rows="3" /></Field>
        </div>
      </div>

      <!-- ══ HABILIDADES ══ -->
      <div v-if="tab === 'habilidades'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Habilidades y Técnicas</div>
          <p class="hint">Podés vincular a una técnica del catálogo de magia o crear una personalizada.</p>
          <div v-for="(hab, i) in habilidades" :key="i" class="dyn-item">
            <button class="btn-remove" style="position:absolute;top:10px;right:10px" @click="habilidades.splice(i,1)">✕</button>
            <p class="dyn-num">Habilidad #{{ i + 1 }}</p>
            <Field label="Vincular al catálogo de magia (opcional)">
              <select v-model="hab.magia_fundamento_id">
                <option value="">— Habilidad personalizada —</option>
                <option v-for="m in cats.magia" :key="m.id" :value="m.id">
                  [{{ m.categoria }}{{ m.subcategoria ? ` / ${m.subcategoria}` : '' }}] {{ m.nombre }}
                </option>
              </select>
            </Field>
            <div v-if="hab.magia_fundamento_id" class="magia-preview">
              {{ magiaPreview(hab.magia_fundamento_id) }}
            </div>
            <template v-if="!hab.magia_fundamento_id">
              <div class="row3">
                <Field label="Nombre"><input v-model="hab.nombre" /></Field>
                <Field label="Categoría">
                  <select v-model="hab.categoria">
                    <option value="TECNICA">Técnica</option>
                    <option value="TECNICA_AVANZADA">Técnica Avanzada</option>
                    <option value="HABILIDAD_MAGICA">Habilidad Mágica</option>
                    <option value="HABILIDAD_NO_MAGICA">Habilidad No Mágica</option>
                    <option value="RASGO">Rasgo</option>
                    <option value="CONOCIMIENTO">Conocimiento</option>
                  </select>
                </Field>
                <Field label="Tipo">
                  <select v-model="hab.tipo">
                    <option value="basica">Básica</option>
                    <option value="avanzada">Avanzada</option>
                    <option value="magica">Mágica</option>
                    <option value="no_magica">No Mágica</option>
                  </select>
                </Field>
              </div>
            </template>
            <Field :label="hab.magia_fundamento_id ? 'Notas del personaje' : 'Descripción / Nivel de dominio'">
              <textarea v-model="hab.descripcion" rows="3"
                :placeholder="hab.magia_fundamento_id ? 'Nivel de maestría, variaciones propias...' : 'Describe la habilidad...'" />
            </Field>
          </div>
          <button class="btn-add" @click="habilidades.push({ nombre:'', categoria:'TECNICA', tipo:'basica', descripcion:'', magia_fundamento_id:'' })">
            + Agregar Habilidad
          </button>
        </div>
      </div>

      <!-- ══ EQUIPO ══ -->
      <div v-if="tab === 'equipo'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Equipamiento</div>
          <p class="hint">Tipo: Arma, Objeto_magico, Objeto_Importante, Familiares.</p>
          <div v-for="(item, i) in equipamiento" :key="i" class="dyn-item">
            <button class="btn-remove" style="position:absolute;top:10px;right:10px" @click="equipamiento.splice(i,1)">✕</button>
            <p class="dyn-num">Item #{{ i + 1 }}</p>
            <div class="row2">
              <Field label="Nombre"><input v-model="item.nombre" /></Field>
              <Field label="Tipo">
                <select v-model="item.tipo">
                  <option value="">—</option>
                  <option value="Arma">Arma</option>
                  <option value="Objeto_magico">Objeto Mágico</option>
                  <option value="Objeto_Importante">Objeto Importante</option>
                  <option value="Familiares">Familiar / Compañero</option>
                </select>
              </Field>
            </div>
            <Field label="Descripción"><textarea v-model="item.descripcion" rows="3" /></Field>
            <Field label="Poder Especial"><textarea v-model="item.poder_especial" rows="2" /></Field>
          </div>
          <button class="btn-add" @click="equipamiento.push({ nombre:'', tipo:'', descripcion:'', poder_especial:'' })">
            + Agregar Item
          </button>
        </div>
      </div>

      <!-- ══ OBJETOS IMPORTANTES ══ -->
      <div v-if="tab === 'objetos'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Objetos Importantes</div>
          <p v-if="!isEdit" class="hint">💡 Guarda el personaje primero.</p>
          <template v-else>
            <div v-for="(o, i) in objetos" :key="o.id_objeto || i" class="dyn-item">
              <button class="btn-remove" style="position:absolute;top:10px;right:10px" @click="eliminarObjeto(i)">✕</button>
              <div class="row2">
                <Field label="Nombre"><input v-model="o.nombre" /></Field>
                <Field label="Tipo">
                  <select v-model="o.tipo">
                    <option value="">— Sin tipo —</option>
                    <option>Reliquia</option><option>Artefacto</option><option>Recuerdo</option>
                    <option>Herramienta</option><option>Símbolo</option><option>Otro</option>
                  </select>
                </Field>
              </div>
              <Field label="Descripción"><textarea v-model="o.descripcion" rows="3" /></Field>
              <button class="btn-rel-add" :disabled="!o.nombre?.trim()" @click="guardarObjeto(i)">
                {{ o.id_objeto ? 'Actualizar' : 'Guardar objeto' }}
              </button>
            </div>
            <button class="btn-add" @click="objetos.push({ id_objeto: null, nombre:'', tipo:'', descripcion:'' })">
              + Agregar Objeto
            </button>
            <p v-if="objetoMsg" class="rel-msg" :class="objetoOk ? 'ok' : 'err'">{{ objetoMsg }}</p>
          </template>
        </div>
      </div>

      <!-- ══ RELACIONES ══ -->
      <div v-if="tab === 'relaciones'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Vínculos con Personajes y Organizaciones</div>
          <div v-for="(rel, i) in relaciones" :key="i" class="dyn-item">
            <button class="btn-remove" style="position:absolute;top:10px;right:10px" @click="relaciones.splice(i,1)">✕</button>
            <p class="dyn-num">Relación #{{ i + 1 }}</p>
            <Field label="Nombre (personaje u organización)">
              <input v-model="rel.nombre_pj_organizacion" placeholder="Ej: Alhaitham, Orden del Crepúsculo..." />
            </Field>
            <div class="row3">
              <Field label="Tipo relación"><input v-model="rel.tipo_relacion" placeholder="Rival, Mentor, Aliado..." /></Field>
              <Field label="Subtipo">
                <select v-model="rel.subtipo_relacion">
                  <option value="otro">Otro</option>
                  <option value="amigo">Amigo</option>
                  <option value="enemigo">Enemigo</option>
                  <option value="rival">Rival</option>
                  <option value="familia">Familia</option>
                  <option value="organizacion_propia">Org. Propia</option>
                  <option value="organizacion_externa">Org. Externa</option>
                </select>
              </Field>
              <Field label="Vincular personaje (opcional)">
                <select v-model.number="rel.personaje_relacionado_id">
                  <option :value="null">— Sin vínculo —</option>
                  <option v-for="p in cats.personajes" :key="p.id" :value="p.id">
                    {{ p.nombre }}{{ p.surname ? ' ' + p.surname : '' }}
                  </option>
                </select>
              </Field>
            </div>
            <Field label="Descripción"><textarea v-model="rel.descripcion" rows="3" /></Field>
          </div>
          <button class="btn-add" @click="relaciones.push({ nombre_pj_organizacion:'', tipo_relacion:'', subtipo_relacion:'otro', descripcion:'', personaje_relacionado_id: null })">
            + Agregar Relación
          </button>
        </div>
      </div>

      <!-- ══ FAMILIA & ORG (solo lectura) ══ -->
      <div v-if="tab === 'afiliaciones'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Familia</div>
          <p v-if="!isEdit" class="hint">Guarda el personaje primero.</p>
          <template v-else>
            <p v-if="!afilFamilias.length" class="hint">Sin familia asignada. Gestiona desde el formulario de la familia.</p>
            <div v-for="af in afilFamilias" :key="af.id" class="afil-row">
              <span class="rel-name">{{ af.familias?.apellido || af.familias?.nombre }}</span>
              <span v-if="af.titulo_nobiliario" class="rel-tag">{{ af.titulo_nobiliario }}</span>
              <NuxtLink :to="`/admin/familias/${af.familia_id}`" class="btn-edit" style="font-size:9px;padding:5px 12px">Gestionar →</NuxtLink>
            </div>
          </template>
        </div>
        <div class="section">
          <div class="sec-title">Organizaciones y Gremios</div>
          <p v-if="!isEdit" class="hint">Guarda el personaje primero.</p>
          <template v-else>
            <p v-if="!afilOrgs.length" class="hint">Sin organizaciones. Gestiona desde el formulario de la organización.</p>
            <div v-for="af in afilOrgs" :key="af.id" class="afil-row">
              <span class="rel-name">{{ af.orgNombre }}</span>
              <span v-if="af.rangoNombre" class="rel-tag">{{ af.rangoNombre }}</span>
              <NuxtLink :to="`/admin/${af.tipo === 'gremio' ? 'gremio' : 'organizaciones'}/${af.orgId}`" class="btn-edit" style="font-size:9px;padding:5px 12px">Gestionar →</NuxtLink>
            </div>
          </template>
        </div>
      </div>

      <!-- ══ MÚSICA ══ -->
      <div v-if="tab === 'musica'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Banda Sonora del Personaje</div>
          <div class="rel-add" style="margin-bottom:16px">
            <div class="autocomplete-wrap">
              <input v-model="cancionBusqueda" placeholder="Buscar canción..." class="rel-input"
                @input="filtrarCanciones" autocomplete="off" />
              <div v-if="cancionesFiltradas.length" class="autocomplete-list">
                <div v-for="c in cancionesFiltradas" :key="c.id" class="autocomplete-item"
                  @mousedown.prevent="seleccionarCancion(c)">
                  <strong>{{ c.titulo }}</strong>{{ c.artista ? ` — ${c.artista}` : '' }}
                </div>
              </div>
            </div>
            <input v-model="contextoCancion" placeholder="Contexto (opcional)" class="rel-input" style="width:160px" />
            <button class="btn-rel-add" :disabled="!cancionSeleccionada" @click="agregarCancion">+ Agregar</button>
          </div>
          <div v-if="!cancionesPj.length" class="hint">Sin canciones asignadas.</div>
          <div v-for="(c, i) in cancionesPj" :key="c.cancion_id" class="rel-row">
            <span class="rel-name">{{ c.titulo }}</span>
            <span v-if="c.artista" style="color:#5a4a30;font-size:0.9rem">{{ c.artista }}</span>
            <input v-model="c.contexto" placeholder="Contexto..." class="rel-input" style="width:180px" />
            <button class="rel-remove" @click="cancionesPj.splice(i,1)">✕</button>
          </div>
        </div>
      </div>

      <!-- ══ MUNDO ══ -->
      <div v-if="tab === 'mundo'" class="form-grid-single">
        <!-- Naciones -->
        <div class="section">
          <div class="sec-title">Naciones</div>
          <div v-for="(n, i) in naciones" :key="i" class="dyn-item">
            <button class="btn-remove" style="position:absolute;top:10px;right:10px" @click="naciones.splice(i,1)">✕</button>
            <div class="row2">
              <Field label="Nación">
                <select v-model.number="n.nacion_id">
                  <option value="">— Seleccionar —</option>
                  <option v-for="x in cats.naciones" :key="x.id" :value="x.id">{{ x.nombre }}</option>
                </select>
              </Field>
              <Field label="Tipo de vínculo"><input v-model="n.tipo" placeholder="Nacimiento, Residencia..." /></Field>
            </div>
          </div>
          <button class="btn-add" @click="naciones.push({ nacion_id:'', tipo:'Residencia', descripcion:'' })">+ Agregar Nación</button>
        </div>
        <!-- Razas -->
        <div class="section">
          <div class="sec-title">Razas</div>
          <div v-for="(r, i) in razas" :key="i" class="dyn-item">
            <button class="btn-remove" style="position:absolute;top:10px;right:10px" @click="razas.splice(i,1)">✕</button>
            <div class="row3">
              <Field label="Raza">
                <select v-model.number="r.raza_id">
                  <option value="">— Seleccionar —</option>
                  <option v-for="x in cats.razas" :key="x.id" :value="x.id">{{ x.nombre }}</option>
                </select>
              </Field>
              <Field label="¿Mixta?">
                <select v-model="r.es_mixta">
                  <option :value="false">No</option><option :value="true">Sí</option>
                </select>
              </Field>
              <Field label="Nota"><input v-model="r.nota" placeholder="Ej: Mitad elfo por madre" /></Field>
            </div>
          </div>
          <button class="btn-add" @click="razas.push({ raza_id:'', es_mixta:false, nota:'' })">+ Agregar Raza</button>
        </div>
        <!-- Organizaciones -->
        <div class="section">
          <div class="sec-title">Organizaciones</div>
          <div v-for="(o, i) in organizaciones" :key="i" class="dyn-item">
            <button class="btn-remove" style="position:absolute;top:10px;right:10px" @click="organizaciones.splice(i,1)">✕</button>
            <div class="row2">
              <Field label="Organización">
                <select v-model.number="o.organizacion_id">
                  <option value="">— Seleccionar —</option>
                  <option v-for="x in cats.orgs" :key="x.id" :value="x.id">{{ x.nombre }}</option>
                </select>
              </Field>
              <Field label="Rol / Tipo"><input v-model="o.tipo" placeholder="Miembro, Líder..." /></Field>
            </div>
          </div>
          <button class="btn-add" @click="organizaciones.push({ organizacion_id:'', tipo:'Miembro', descripcion:'' })">+ Agregar Organización</button>
        </div>
      </div>

      <!-- ══ EVENTOS ══ -->
      <div v-if="tab === 'eventos'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Eventos Clave del Personaje</div>
          <div v-for="(e, i) in eventos" :key="i" class="dyn-item">
            <button class="btn-remove" style="position:absolute;top:10px;right:10px" @click="eventos.splice(i,1)">✕</button>
            <p class="dyn-num">Evento #{{ i + 1 }}</p>
            <div class="row2">
              <Field label="Fecha"><input v-model="e.fecha" placeholder="Ej: Año 1520" /></Field>
              <Field label="Título"><input v-model="e.titulo" /></Field>
            </div>
            <Field label="Descripción"><textarea v-model="e.descripcion" rows="3" /></Field>
          </div>
          <button class="btn-add" @click="eventos.push({ fecha:'', titulo:'', descripcion:'' })">+ Agregar Evento</button>
        </div>
      </div>

      <!-- ══ STATS ══ -->
      <div v-if="tab === 'stats'" class="form-grid-single">
        <div class="section">
          <div class="sec-title">Atributos</div>
          <div class="stats-with-chart">
            <div class="stats-grid">
              <Field v-for="s in STAT_FIELDS" :key="s.key" :label="s.label">
                <input type="number" :min="s.min" :max="s.max" v-model.number="stats[s.key]" />
              </Field>
            </div>
            <div class="radar-wrap">
              <Radar :data="radarData" :options="radarOptions" />
            </div>
          </div>
        </div>
        <div class="section">
          <div class="sec-title">Rangos de Combate</div>
          <div class="stats-grid">
            <Field v-for="r in RANGO_FIELDS" :key="r.key" :label="r.label">
              <select v-model="stats[r.key]">
                <option value="">—</option>
                <option>S</option><option>A</option><option>B</option><option>C</option><option>D</option>
              </select>
            </Field>
          </div>
        </div>
      </div>

      <!-- ══ NARRATIVA (AUTOR) ══ -->
      <div v-if="tab === 'narrativa'" class="form-grid-single">
        <div class="autor-badge">✍️ Zona del Autor — Contenido Privado</div>
        <p class="hint" style="margin-bottom:20px">Esta información nunca es visible para los lectores.</p>

        <div class="section">
          <div class="sec-title" style="color:#c8a84b">Estado Narrativo</div>
          <div class="row2">
            <Field label="Estado Narrativo">
              <select v-model="narrativa.estado_narrativo">
                <option value="Vivo">🟢 Vivo</option>
                <option value="Muerto">🔴 Muerto</option>
                <option value="Desaparecido">🟡 Desaparecido</option>
                <option value="Transformado">🟣 Transformado</option>
                <option value="Sellado">🔵 Sellado</option>
                <option value="Traidor">🟠 Traidor</option>
                <option value="Ascendido">⭐ Ascendido</option>
                <option value="Corrompido">☠️ Corrompido</option>
                <option value="Desconocido">⬛ Desconocido</option>
              </select>
            </Field>
            <Field label="Tipo de Arco">
              <select v-model="narrativa.tipo_arco">
                <option value="">— Sin definir —</option>
                <option value="Redencion">Redención</option>
                <option value="Caida">Caída</option>
                <option value="Crecimiento">Crecimiento</option>
                <option value="Tragedia">Tragedia</option>
                <option value="Sacrificio">Sacrificio</option>
                <option value="Supervivencia">Supervivencia</option>
                <option value="Transformacion">Transformación</option>
                <option value="Revelacion">Revelación</option>
                <option value="Neutral">Neutral</option>
              </select>
            </Field>
          </div>
          <Field :label="`Narrativa definida — ${narrativa.porcentaje_escrito}%`">
            <div style="display:flex;align-items:center;gap:12px">
              <div class="pct-bar-bg"><div class="pct-bar-fill" :style="`width:${narrativa.porcentaje_escrito}%`"></div></div>
              <input type="number" min="0" max="100" v-model.number="narrativa.porcentaje_escrito" style="width:70px;text-align:center" />
            </div>
          </Field>
          <div class="row2">
            <Field label="Acto Clave">
              <select v-model="narrativa.acto_clave_id">
                <option :value="null">— Sin asignar —</option>
                <option v-for="a in cats.actos" :key="a.id" :value="a.id">{{ a.nombre }}</option>
              </select>
            </Field>
            <Field label="Capítulo Clave">
              <select v-model="narrativa.capitulo_clave_id">
                <option :value="null">— Sin asignar —</option>
                <option v-for="c in cats.capitulos" :key="c.id" :value="c.id">Cap. {{ c.numero }} — {{ c.titulo }}</option>
              </select>
            </Field>
          </div>
          <Field label="Desarrollo del Arco"><textarea v-model="narrativa.desarrollo_arco" rows="4" /></Field>
          <Field label="Destino Final"><textarea v-model="narrativa.destino_final" rows="4" /></Field>
          <Field label="Secretos Pendientes"><textarea v-model="narrativa.secretos_pendientes" rows="3" /></Field>
          <Field label="Revelación de Identidad"><textarea v-model="narrativa.revelacion_identidad" rows="3" /></Field>
          <Field label="Relaciones Ocultas"><textarea v-model="narrativa.relaciones_ocultas" rows="3" /></Field>
          <Field label="Notas del Autor"><textarea v-model="narrativa.notas_autor" rows="4" /></Field>
          <div style="display:flex;align-items:center;gap:12px;margin-top:8px">
            <button class="btn-save" :disabled="savingNarr || !isEdit" @click="guardarNarrativa">
              {{ savingNarr ? 'Guardando...' : 'Guardar Narrativa' }}
            </button>
            <p v-if="!isEdit" class="hint" style="margin:0">Guarda el personaje primero.</p>
            <p v-if="narrMsg" class="rel-msg" :class="narrOk ? 'ok' : 'err'" style="margin:0">{{ narrMsg }}</p>
          </div>
        </div>

        <!-- Hitos -->
        <div class="section">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">
            <div class="sec-title" style="color:#c8a84b;margin-bottom:0">Hitos Narrativos</div>
            <button class="btn-add" style="width:auto;padding:6px 16px" @click="mostrarFormHito = !mostrarFormHito">+ Hito</button>
          </div>
          <p v-if="!hitos.length" class="hint">Sin hitos registrados.</p>
          <div v-for="h in hitos" :key="h.id" class="hito-card">
            <div>
              <div class="hito-titulo">{{ tipoHitoIcon(h.tipo_hito) }} {{ h.titulo }}</div>
              <span class="rel-tag" style="margin-top:4px;display:inline-block">{{ h.tipo_hito }}</span>
              <p v-if="h.descripcion" style="color:#5a4a30;font-size:0.85rem;margin-top:4px">{{ h.descripcion }}</p>
            </div>
            <button class="rel-remove" @click="eliminarHito(h.id)">✕</button>
          </div>
          <div v-if="mostrarFormHito" class="dyn-item" style="margin-top:12px">
            <div class="row2">
              <Field label="Título *"><input v-model="nuevoHito.titulo" /></Field>
              <Field label="Tipo">
                <select v-model="nuevoHito.tipo_hito">
                  <option value="Otro">Otro</option>
                  <option value="Revelacion">Revelación</option>
                  <option value="Muerte">Muerte</option>
                  <option value="Transformacion">Transformación</option>
                  <option value="PuntoDeGiro">Punto de Giro</option>
                  <option value="EncuentroClave">Encuentro Clave</option>
                  <option value="Traicion">Traición</option>
                  <option value="Sacrificio">Sacrificio</option>
                  <option value="Despertar">Despertar</option>
                </select>
              </Field>
            </div>
            <div class="row2">
              <Field label="Acto vinculado">
                <select v-model="nuevoHito.acto_id">
                  <option :value="null">—</option>
                  <option v-for="a in cats.actos" :key="a.id" :value="a.id">{{ a.nombre }}</option>
                </select>
              </Field>
              <Field label="Capítulo vinculado">
                <select v-model="nuevoHito.capitulo_id">
                  <option :value="null">—</option>
                  <option v-for="c in cats.capitulos" :key="c.id" :value="c.id">Cap. {{ c.numero }} — {{ c.titulo }}</option>
                </select>
              </Field>
            </div>
            <Field label="Descripción"><textarea v-model="nuevoHito.descripcion" rows="3" /></Field>
            <div style="display:flex;gap:8px">
              <button class="btn-rel-add" @click="guardarHito">Guardar Hito</button>
              <button class="btn-back" @click="mostrarFormHito = false">Cancelar</button>
            </div>
          </div>
        </div>
      </div>

    </template>
  </div>
</template>

<script setup>
import { Radar } from 'vue-chartjs'
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js'
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend)

definePageMeta({ layout: 'admin', middleware: 'admin' })
const supabase = useSupabaseClient()
const router   = useRouter()
const route    = useRoute()

const id     = computed(() => route.params.id === 'nuevo' ? null : route.params.id)
const isEdit = computed(() => !!id.value)
const tab    = ref('basico')
const loading  = ref(false)
const saving   = ref(false)
const error    = ref('')

const TABS = [
  { key: 'basico',       label: '📋 Básico' },
  { key: 'historia',     label: '📜 Historia' },
  { key: 'personalidad', label: '🧠 Personalidad' },
  { key: 'magia',        label: '✨ Magia' },
  { key: 'habilidades',  label: '⚔️ Habilidades' },
  { key: 'equipo',       label: '🛡️ Equipo' },
  { key: 'objetos',      label: '💎 Objetos' },
  { key: 'relaciones',   label: '🤝 Relaciones' },
  { key: 'afiliaciones', label: '🏛️ Familia & Org' },
  { key: 'musica',       label: '🎵 Música' },
  { key: 'mundo',        label: '🌍 Mundo' },
  { key: 'eventos',      label: '📅 Eventos' },
  { key: 'stats',        label: '📊 Stats' },
  { key: 'narrativa',    label: '✍️ Narrativa', autor: true },
]

const STAT_FIELDS = [
  { key: 'fuerza',              label: 'Fuerza',      min:1, max:10 },
  { key: 'destreza',            label: 'Destreza',    min:1, max:10 },
  { key: 'constitucion',        label: 'Constitución',min:1, max:10 },
  { key: 'inteligencia',        label: 'Inteligencia',min:1, max:10 },
  { key: 'sabiduria',           label: 'Sabiduría',   min:1, max:10 },
  { key: 'carisma',             label: 'Carisma',     min:1, max:10 },
  { key: 'mp_max',              label: 'MP Máx',      min:0, max:9999 },
  { key: 'ataque_fisico',       label: 'Ataque Físico',min:0,max:300 },
  { key: 'ataque_magico',       label: 'Ataque Mágico',min:0,max:300 },
  { key: 'defensa_fisica',      label: 'Defensa Física',min:0,max:300 },
  { key: 'defensa_magica',      label: 'Defensa Mágica',min:0,max:300 },
  { key: 'velocidad',           label: 'Velocidad',   min:0, max:300 },
  { key: 'capacidad_de_reaccion',label: 'Reacción',   min:0, max:300 },
  { key: 'precision_val',       label: 'Precisión %', min:0, max:100 },
]
const radarData = computed(() => ({
  labels: ['Fuerza', 'Destreza', 'Constitución', 'Inteligencia', 'Sabiduría', 'Carisma'],
  datasets: [{
    data: [
      stats.value.fuerza        || 0,
      stats.value.destreza       || 0,
      stats.value.constitucion   || 0,
      stats.value.inteligencia   || 0,
      stats.value.sabiduria      || 0,
      stats.value.carisma        || 0,
    ],
    backgroundColor: 'rgba(200,168,75,0.15)',
    borderColor:     '#c8a84b',
    pointBackgroundColor: '#c8a84b',
    borderWidth: 1.5,
  }],
}))
const radarOptions = {
  responsive: true,
  scales: {
    r: {
      min: 0, max: 10, ticks: { stepSize: 2, color: '#3a2a10', font: { size: 9 }, backdropColor: 'transparent' },
      grid: { color: '#2a2010' },
      angleLines: { color: '#2a2010' },
      pointLabels: { color: '#7a6a50', font: { size: 10 } },
    },
  },
  plugins: { legend: { display: false } },
}

const RANGO_FIELDS = [
  { key: 'rango_cuerpo_a_cuerpo', label: 'Cuerpo a Cuerpo' },
  { key: 'rango_distancia',       label: 'Distancia' },
  { key: 'daño_magico',           label: 'Daño Mágico' },
  { key: 'defensa',               label: 'Defensa' },
  { key: 'apoyo',                 label: 'Apoyo' },
  { key: 'movilidad',             label: 'Movilidad' },
  { key: 'control_de_masas',      label: 'Control Masas' },
]

// ── Estado del formulario ──
const f = ref({
  nombre: '', surname: '', titulo: '', subtitulo: '', ocupacion: '',
  edad: '', genero: '', altura: null, rango_aventurero: '',
  lugar_nacimiento: '', historia: '', rasgos_personalidad: '', filosofia: '',
  motivacion: '', miedos: '', gustos: '', disgustos: '',
  tipo_magia_principal: '', magia_secundaria: 'N/A', nivel_de_consciencia: '',
  circuito_forte: '', essentia: '', zenithra: '', bendicion: '',
  segundo_despertar: '', debilidades: '',
  imagen_url: '', banner_url: '', visible: true,
  es_invocado: false, tipo_invocacion: null,
})
const stats = ref({
  fuerza: null, destreza: null, constitucion: null, inteligencia: null,
  sabiduria: null, carisma: null, mp_max: null, ataque_fisico: null,
  ataque_magico: null, defensa_fisica: null, defensa_magica: null,
  velocidad: null, capacidad_de_reaccion: null, precision_val: 90,
  rango_cuerpo_a_cuerpo: '', rango_distancia: '', daño_magico: '',
  defensa: '', apoyo: '', movilidad: '', control_de_masas: '',
})
const habilidades  = ref([])
const equipamiento = ref([])
const relaciones   = ref([])
const eventos      = ref([])
const naciones     = ref([])
const razas        = ref([])
const organizaciones = ref([])
const cancionesPj  = ref([])
const objetos      = ref([])
const afilFamilias = ref([])
const afilOrgs     = ref([])

// Narrativa
const narrativa = ref({
  estado_narrativo: 'Vivo', tipo_arco: '', porcentaje_escrito: 0,
  desarrollo_arco: '', destino_final: '', secretos_pendientes: '',
  revelacion_identidad: '', relaciones_ocultas: '', notas_autor: '',
  acto_clave_id: null, capitulo_clave_id: null,
})
const hitos           = ref([])
const nuevoHito       = ref({ titulo: '', tipo_hito: 'Otro', descripcion: '', acto_id: null, capitulo_id: null })
const mostrarFormHito = ref(false)
const savingNarr      = ref(false)
const narrMsg         = ref('')
const narrOk          = ref(true)

// Música
const cancionBusqueda   = ref('')
const cancionesFiltradas = ref([])
const cancionSeleccionada = ref(null)
const contextoCancion   = ref('')

// Objetos
const objetoMsg = ref('')
const objetoOk  = ref(true)

// Catálogos
const cats = ref({ magia: [], armas: [], naciones: [], razas: [], orgs: [], actos: [], capitulos: [], canciones: [], personajes: [] })

// ── Carga inicial ──
onMounted(async () => {
  await cargarCatalogos()
  if (!isEdit.value) return
  loading.value = true
  try {
    const [
      { data: pj }, { data: st }, { data: habs }, { data: equip },
      { data: rels }, { data: evs }, { data: nacs }, { data: rzs },
      { data: orgs }, { data: cans }, { data: objs },
      { data: narrData }, { data: hitosData },
      { data: famJr }, { data: orgJr }, { data: gremJr },
    ] = await Promise.all([
      supabase.from('personajes').select('*').eq('id', id.value).single(),
      supabase.from('estadisticas').select('*').eq('personaje_id', id.value).maybeSingle(),
      supabase.from('habilidades').select('*').eq('personaje_id', id.value),
      supabase.from('equipamiento').select('*').eq('personaje_id', id.value),
      supabase.from('relaciones').select('*').eq('personaje_id', id.value),
      supabase.from('eventos_personaje').select('*').eq('personaje_id', id.value),
      supabase.from('personaje_nacion').select('*').eq('personaje_id', id.value),
      supabase.from('personaje_raza').select('*').eq('personaje_id', id.value),
      supabase.from('personaje_organizacion').select('*').eq('personaje_id', id.value),
      supabase.from('personaje_cancion').select('id, cancion_id, contexto, canciones(titulo,artista)').eq('personaje_id', id.value),
      supabase.from('objetos_importantes').select('*').eq('personaje_id', id.value),
      supabase.from('personaje_narrativa').select('*').eq('personaje_id', id.value).maybeSingle(),
      supabase.from('personaje_narrativa_hito').select('*')
        .eq('narrativa_id', narrData?.id ?? 0).order('orden'),
      supabase.from('familia_jerarquia').select('id, titulo_nobiliario, familia_id, familias(nombre,apellido)').eq('personaje_id', id.value),
      supabase.from('org_jerarquia').select('id, organizacion_id, organizaciones(nombre), org_rangos(nombre)').eq('personaje_id', id.value),
      supabase.from('gremio_jerarquia').select('id, gremio_id, gremio(nombre), gremio_rangos(nombre)').eq('personaje_id', id.value),
    ])

    if (pj) Object.keys(f.value).forEach(k => { if (pj[k] !== undefined && pj[k] !== null) f.value[k] = pj[k] })
    if (st) Object.keys(stats.value).forEach(k => { if (st[k] !== undefined && st[k] !== null) stats.value[k] = st[k] })
    habilidades.value   = habs ?? []
    equipamiento.value  = equip ?? []
    relaciones.value    = rels ?? []
    eventos.value       = evs ?? []
    naciones.value      = nacs ?? []
    razas.value         = rzs ?? []
    organizaciones.value = orgs ?? []
    cancionesPj.value   = (cans ?? []).map(x => ({ cancion_id: x.cancion_id, titulo: x.canciones?.titulo, artista: x.canciones?.artista, contexto: x.contexto || '' }))
    objetos.value       = objs ?? []
    if (narrData) Object.keys(narrativa.value).forEach(k => { if (narrData[k] !== undefined) narrativa.value[k] = narrData[k] })
    hitos.value         = hitosData ?? []
    afilFamilias.value  = famJr ?? []
    afilOrgs.value = [
      ...(orgJr ?? []).map(x => ({ id: x.id, orgNombre: x.organizaciones?.nombre, rangoNombre: x.org_rangos?.nombre, orgId: x.organizacion_id, tipo: 'org' })),
      ...(gremJr ?? []).map(x => ({ id: x.id, orgNombre: x.gremio?.nombre, rangoNombre: x.gremio_rangos?.nombre, orgId: x.gremio_id, tipo: 'gremio' })),
    ]
  } catch(e) {
    error.value = e.message || 'Error al cargar personaje.'
  } finally {
    loading.value = false
  }
})

async function cargarCatalogos() {
  const [
    { data: mag }, { data: nac }, { data: raz }, { data: org },
    { data: act }, { data: cap }, { data: can }, { data: pjs },
  ] = await Promise.all([
    supabase.from('magia_fundamentos').select('id, nombre, categoria, subcategoria, descripcion').order('nombre'),
    supabase.from('naciones').select('id, nombre').order('nombre'),
    supabase.from('razas').select('id, nombre').order('nombre'),
    supabase.from('organizaciones').select('id, nombre').order('nombre'),
    supabase.from('actos').select('id, nombre').order('nombre'),
    supabase.from('capitulos').select('id, numero, titulo').order('numero'),
    supabase.from('canciones').select('id, titulo, artista').order('titulo'),
    supabase.from('personajes').select('id, nombre, surname').order('nombre'),
  ])
  cats.value = {
    magia: mag ?? [], naciones: nac ?? [], razas: raz ?? [],
    orgs: org ?? [], actos: act ?? [], capitulos: cap ?? [],
    canciones: can ?? [], personajes: pjs ?? [],
  }
}

// ── Guardar personaje principal ──
async function guardarPersonaje() {
  if (!f.value.nombre?.trim()) { error.value = 'El nombre es obligatorio.'; tab.value = 'basico'; return }
  saving.value = true; error.value = ''
  try {
    let pjId = id.value

    if (isEdit.value) {
      const { error: err } = await supabase.from('personajes').update(f.value).eq('id', pjId)
      if (err) throw err
    } else {
      const { data, error: err } = await supabase.from('personajes').insert(f.value).select('id').single()
      if (err) throw err
      pjId = data.id
    }

    // Estadísticas (upsert)
    const { error: stErr } = await supabase.from('estadisticas')
      .upsert({ ...stats.value, personaje_id: pjId }, { onConflict: 'personaje_id' })
    if (stErr) console.warn('Stats error:', stErr.message)

    // Habilidades — delete + insert
    await supabase.from('habilidades').delete().eq('personaje_id', pjId)
    if (habilidades.value.length) {
      const rows = habilidades.value.map(h => ({ ...h, personaje_id: pjId, id_habilidad: undefined, magia_fundamento_id: h.magia_fundamento_id || null }))
      await supabase.from('habilidades').insert(rows)
    }

    // Equipamiento
    await supabase.from('equipamiento').delete().eq('personaje_id', pjId)
    if (equipamiento.value.length) {
      const rows = equipamiento.value.map(e => ({ ...e, personaje_id: pjId, id_arma: undefined }))
      await supabase.from('equipamiento').insert(rows)
    }

    // Relaciones
    await supabase.from('relaciones').delete().eq('personaje_id', pjId)
    if (relaciones.value.length) {
      const rows = relaciones.value.map(r => ({ ...r, personaje_id: pjId, id_rr: undefined }))
      await supabase.from('relaciones').insert(rows)

      // Insertar inversas automáticas para relaciones vinculadas a otro personaje
      for (const rel of relaciones.value.filter(r => r.personaje_relacionado_id)) {
        const { data: existe } = await supabase
          .from('relaciones')
          .select('id_rr')
          .eq('personaje_id', rel.personaje_relacionado_id)
          .eq('personaje_relacionado_id', pjId)
          .maybeSingle()
        if (!existe) {
          await supabase.from('relaciones').insert({
            personaje_id:            rel.personaje_relacionado_id,
            personaje_relacionado_id: pjId,
            tipo_relacion:            rel.tipo_relacion,
            subtipo_relacion:         rel.subtipo_relacion,
            descripcion:              rel.descripcion,
            nombre_pj_organizacion:  null,
          })
        }
      }
    }

    // Eventos
    await supabase.from('eventos_personaje').delete().eq('personaje_id', pjId)
    if (eventos.value.length) {
      const rows = eventos.value.map(e => ({ ...e, personaje_id: pjId, id_evento: undefined }))
      await supabase.from('eventos_personaje').insert(rows)
    }

    // Naciones
    await supabase.from('personaje_nacion').delete().eq('personaje_id', pjId)
    const nacsValidas = naciones.value.filter(n => n.nacion_id)
    if (nacsValidas.length) await supabase.from('personaje_nacion').insert(nacsValidas.map(n => ({ ...n, personaje_id: pjId })))

    // Razas
    await supabase.from('personaje_raza').delete().eq('personaje_id', pjId)
    const rzValidas = razas.value.filter(r => r.raza_id)
    if (rzValidas.length) await supabase.from('personaje_raza').insert(rzValidas.map(r => ({ ...r, personaje_id: pjId })))

    // Organizaciones
    await supabase.from('personaje_organizacion').delete().eq('personaje_id', pjId)
    const orgsValidas = organizaciones.value.filter(o => o.organizacion_id)
    if (orgsValidas.length) await supabase.from('personaje_organizacion').insert(orgsValidas.map(o => ({ ...o, personaje_id: pjId })))

    // Canciones — sync diff
    const { data: cansActuales } = await supabase.from('personaje_cancion').select('cancion_id').eq('personaje_id', pjId)
    const actualesIds = (cansActuales ?? []).map(x => x.cancion_id)
    const nuevosIds   = cancionesPj.value.map(x => x.cancion_id)
    for (const c of cancionesPj.value) {
      if (!actualesIds.includes(c.cancion_id))
        await supabase.from('personaje_cancion').insert({ personaje_id: pjId, cancion_id: c.cancion_id, contexto: c.contexto || null })
    }
    for (const aid of actualesIds) {
      if (!nuevosIds.includes(aid))
        await supabase.from('personaje_cancion').delete().eq('personaje_id', pjId).eq('cancion_id', aid)
    }

    if (!isEdit.value) router.push('/admin/personajes')
    else error.value = ''
  } catch(e) {
    error.value = e.message || 'Error al guardar.'
  } finally {
    saving.value = false
  }
}

// ── Objetos importantes ──
async function guardarObjeto(i) {
  const o = objetos.value[i]
  if (!o.nombre?.trim()) { objetoMsg.value = 'El nombre es obligatorio.'; objetoOk.value = false; return }
  const body = { nombre: o.nombre, tipo: o.tipo || null, descripcion: o.descripcion || null, personaje_id: id.value }
  if (o.id_objeto) {
    const { error: err } = await supabase.from('objetos_importantes').update(body).eq('id_objeto', o.id_objeto)
    if (err) { objetoMsg.value = err.message; objetoOk.value = false; return }
  } else {
    const { data, error: err } = await supabase.from('objetos_importantes').insert(body).select('id_objeto').single()
    if (err) { objetoMsg.value = err.message; objetoOk.value = false; return }
    objetos.value[i].id_objeto = data.id_objeto
  }
  objetoMsg.value = 'Objeto guardado.'; objetoOk.value = true
  setTimeout(() => objetoMsg.value = '', 3000)
}

async function eliminarObjeto(i) {
  const o = objetos.value[i]
  if (!o.id_objeto) { objetos.value.splice(i, 1); return }
  if (!confirm(`¿Eliminar "${o.nombre}"?`)) return
  await supabase.from('objetos_importantes').delete().eq('id_objeto', o.id_objeto)
  objetos.value.splice(i, 1)
}

// ── Narrativa ──
async function guardarNarrativa() {
  if (!isEdit.value) return
  savingNarr.value = true
  const { error: err } = await supabase.from('personaje_narrativa')
    .upsert({ ...narrativa.value, personaje_id: id.value }, { onConflict: 'personaje_id' })
  savingNarr.value = false
  if (err) { narrMsg.value = err.message; narrOk.value = false }
  else { narrMsg.value = 'Narrativa guardada.'; narrOk.value = true }
  setTimeout(() => narrMsg.value = '', 3000)
}

async function guardarHito() {
  if (!isEdit.value || !nuevoHito.value.titulo.trim()) return
  // Asegurar que existe la narrativa primero
  const { data: narrRow } = await supabase.from('personaje_narrativa').select('id').eq('personaje_id', id.value).maybeSingle()
  let narrId = narrRow?.id
  if (!narrId) {
    const { data } = await supabase.from('personaje_narrativa')
      .insert({ personaje_id: id.value, estado_narrativo: narrativa.value.estado_narrativo }).select('id').single()
    narrId = data?.id
  }
  if (!narrId) return
  await supabase.from('personaje_narrativa_hito').insert({ ...nuevoHito.value, narrativa_id: narrId, orden: hitos.value.length })
  const { data } = await supabase.from('personaje_narrativa_hito').select('*').eq('narrativa_id', narrId).order('orden')
  hitos.value = data ?? []
  nuevoHito.value = { titulo: '', tipo_hito: 'Otro', descripcion: '', acto_id: null, capitulo_id: null }
  mostrarFormHito.value = false
}

async function eliminarHito(hitoId) {
  if (!confirm('¿Eliminar este hito?')) return
  await supabase.from('personaje_narrativa_hito').delete().eq('id', hitoId)
  hitos.value = hitos.value.filter(h => h.id !== hitoId)
}

// ── Música autocomplete ──
function filtrarCanciones() {
  const q = cancionBusqueda.value.toLowerCase()
  cancionesFiltradas.value = cats.value.canciones.filter(c => c.titulo?.toLowerCase().includes(q) || c.artista?.toLowerCase().includes(q)).slice(0, 8)
}
function seleccionarCancion(c) {
  cancionSeleccionada.value = c
  cancionBusqueda.value = c.titulo + (c.artista ? ` — ${c.artista}` : '')
  cancionesFiltradas.value = []
}
function agregarCancion() {
  if (!cancionSeleccionada.value) return
  if (cancionesPj.value.some(x => x.cancion_id === cancionSeleccionada.value.id)) return
  cancionesPj.value.push({ cancion_id: cancionSeleccionada.value.id, titulo: cancionSeleccionada.value.titulo, artista: cancionSeleccionada.value.artista || '', contexto: contextoCancion.value })
  cancionBusqueda.value = ''; contextoCancion.value = ''; cancionSeleccionada.value = null
}

// ── Helpers ──
function magiaPreview(magiaId) {
  const m = cats.value.magia.find(x => x.id == magiaId)
  return m ? `[${m.categoria}] ${m.nombre}${m.descripcion ? ' — ' + m.descripcion.slice(0, 80) : ''}` : ''
}

function tipoHitoIcon(tipo) {
  const icons = { Muerte:'☠️', Revelacion:'✨', Transformacion:'🔄', PuntoDeGiro:'⚡', EncuentroClave:'🤝', Traicion:'🗡️', Sacrificio:'💀', Despertar:'🌟', Otro:'📌' }
  return icons[tipo] || '📌'
}
</script>

<style scoped src="~/assets/css/admin-form.css" />
<style scoped src="~/assets/css/admin-relations.css" />
<style scoped>
.inner-tabs {
  display: flex;
  gap: 2px;
  margin-bottom: 16px;
  border-bottom: 1px solid #2a2010;
  overflow-x: auto;
  scrollbar-width: none;
  flex-wrap: wrap;
}
.inner-tabs::-webkit-scrollbar { display: none; }
.inner-tab {
  font-family: 'Cinzel', serif;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 10px 12px;
  background: transparent;
  border: none;
  color: #4a3a20;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
  transition: color 0.2s, border-color 0.2s;
  margin-bottom: -1px;
}
.inner-tab:hover { color: #a89070; }
.inner-tab.active { color: #c8a84b; border-bottom-color: #c8a84b; }
.inner-tab.autor { color: #7a6a50; }
.inner-tab.autor.active { color: #c8a84b; }

.dyn-num { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.1em; color:#4a3a20; margin-bottom:8px; text-transform:uppercase; }
.magia-preview { background:#0a0804; border:1px solid #2a2010; padding:8px 12px; font-size:0.85rem; color:#c8a84b; margin-bottom:12px; border-radius:2px; }
.stats-with-chart { display:grid; grid-template-columns:1fr 240px; gap:20px; align-items:start; }
@media (max-width:700px) { .stats-with-chart { grid-template-columns:1fr; } }
.radar-wrap { background:#0e0b07; border:1px solid #2a2010; border-radius:4px; padding:14px; }
.stats-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(130px,1fr)); gap:10px; }
.afil-row { display:flex; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid #1a1408; }
.autor-badge { background:rgba(200,168,75,0.1); border:1px solid rgba(200,168,75,0.3); color:#c8a84b; padding:4px 14px; font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.12em; display:inline-block; margin-bottom:8px; }
.pct-bar-bg { flex:1; height:6px; background:#1e1810; border-radius:3px; overflow:hidden; }
.pct-bar-fill { height:100%; background:linear-gradient(to right, #c8a84b, #e24b4a); transition:width 0.3s; border-radius:3px; }
.hito-card { background:#0e0b07; border:1px solid #2a2010; border-left:3px solid #c8a84b40; padding:12px 16px; display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px; border-radius:2px; }
.hito-titulo { font-family:'Cinzel',serif; font-size:0.85rem; color:#e8dfc8; }
.btn-edit { font-family:'Cinzel',serif; font-size:9px; letter-spacing:0.1em; padding:5px 12px; border:1px solid #2a2010; color:#7a6a50; text-decoration:none; border-radius:2px; transition:border-color 0.2s, color 0.2s; }
.btn-edit:hover { border-color:#c8a84b; color:#c8a84b; }
</style>
