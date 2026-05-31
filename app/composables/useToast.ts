export function useToast() {
  const msg  = useState<string>('toast-msg',  () => '')
  const type = useState<'ok' | 'err'>('toast-type', () => 'ok')
  let timer: ReturnType<typeof setTimeout> | null = null

  function show(text: string, kind: 'ok' | 'err' = 'ok', ms = 4000) {
    msg.value  = text
    type.value = kind
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => { msg.value = '' }, ms)
  }

  return { msg, type, show }
}
