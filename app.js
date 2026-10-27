import { isWebGPUAvailable, supportsShaderF16 } from 'runonweb/core'

const el = (id) => document.getElementById(id)

const fmtBytes = (n = 0) => {
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n.toFixed(i > 0 && n < 10 ? 1 : 0)} ${units[i]}`
}

const describe = ({ status, progress, loaded, total, file }) => {
  if (status === 'done') return 'Listo'
  const parts = [status]
  if (typeof progress === 'number') parts.push(`${Math.round(progress)}%`)
  if (total) parts.push(`${fmtBytes(loaded)} / ${fmtBytes(total)}`)
  if (file) parts.push(file)
  return parts.join(' · ')
}

const setStatus = (id, message, isError = false) => {
  const node = el(id)
  node.textContent = message
  node.classList.toggle('error', isError)
}

const setBar = (id, percent) => {
  el(id).style.width = `${Math.max(0, Math.min(100, percent))}%`
}

const onProgress = (barId, statusId) => (info) => {
  if (typeof info.progress === 'number') setBar(barId, info.progress)
  setStatus(statusId, describe(info))
}

const fail = (statusId, error) => {
  console.error(error)
  setStatus(statusId, error?.message ?? String(error), true)
}

const run = async (button, statusId, task) => {
  button.disabled = true
  setStatus(statusId, 'Iniciando…')
  try {
    await task()
  } catch (error) {
    fail(statusId, error)
  } finally {
    button.disabled = false
  }
}

// ---------- dispositivo ----------
const badge = el('deviceBadge')
const webgpu = await isWebGPUAvailable().catch(() => false)
const f16 = webgpu ? await supportsShaderF16().catch(() => false) : false
badge.classList.add(webgpu ? 'webgpu' : 'wasm')
el('deviceText').textContent = webgpu ? `WebGPU${f16 ? ' · f16' : ''}` : 'WASM (sin WebGPU)'

// ---------- 1. texto → emojis ----------
let emojifier = null

el('emojiBtn').addEventListener('click', () => {
  const text = el('emojiInput').value.trim()
  if (!text) return setStatus('emojiStatus', 'Escribe una frase', true)

  el('emojiOut').textContent = ''
  run(el('emojiBtn'), 'emojiStatus', async () => {
    const { Emojifier } = await import('runonweb/emoji')
    emojifier ??= new Emojifier({ onProgress: onProgress('emojiBar', 'emojiStatus') })
    await emojifier.load()
    const result = await emojifier.emojify(text)
    el('emojiOut').textContent = result.text || '—'
    setBar('emojiBar', 100)
    setStatus('emojiStatus', `Listo · ${result.emojis.length} emojis · ${emojifier.device}`)
  })
})

// ---------- 2. similitud de embeddings ----------
let embedder = null

el('simBtn').addEventListener('click', () => {
  const a = el('simA').value.trim()
  const b = el('simB').value.trim()
  if (!a || !b) return setStatus('simStatus', 'Completa ambas frases', true)

  el('simOut').textContent = ''
  run(el('simBtn'), 'simStatus', async () => {
    const { TextEmbedder, cosineSimilarity } = await import('runonweb/embed')
    embedder ??= new TextEmbedder({ onProgress: onProgress('simBar', 'simStatus') })
    await embedder.load()
    const { embeddings, dimensions } = await embedder.embed([a, b])
    const score = cosineSimilarity(embeddings[0], embeddings[1])
    el('simOut').innerHTML = `<span class="score">${(score * 100).toFixed(1)}%</span> de similitud · ${dimensions} dimensiones · ${embedder.device}`
    setBar('simBar', 100)
    setStatus('simStatus', 'Listo')
  })
})

// ---------- 3. quitar fondo ----------
let remover = null
let selectedFile = null

el('bgFile').addEventListener('change', (event) => {
  selectedFile = event.target.files?.[0] ?? null
  el('bgBtn').disabled = !selectedFile
  el('bgOut').hidden = true
  el('bgResult').removeAttribute('src')
  setBar('bgBar', 0)
  setStatus('bgStatus', selectedFile ? selectedFile.name : '')
  if (selectedFile) el('bgOriginal').src = URL.createObjectURL(selectedFile)
})

el('bgBtn').addEventListener('click', () => {
  if (!selectedFile) return
  run(el('bgBtn'), 'bgStatus', async () => {
    const { RemoveBackground } = await import('runonweb/remove-bg')
    remover ??= new RemoveBackground({ onProgress: onProgress('bgBar', 'bgStatus') })
    await remover.load()
    setStatus('bgStatus', 'Procesando imagen…')
    const png = await remover.remove(selectedFile)
    el('bgResult').src = URL.createObjectURL(png)
    el('bgOut').hidden = false
    setBar('bgBar', 100)
    setStatus('bgStatus', `Listo · PNG ${fmtBytes(png.size)} · ${remover.device}`)
  })
})
