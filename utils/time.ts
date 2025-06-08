// Formata o tempo restante
export const formatarTempoRestante = (ms: number) => {
  const segundos = Math.floor((ms / 1000) % 60)
  const minutos = Math.floor((ms / (1000 * 60)) % 60)
  const horas = Math.floor((ms / (1000 * 60 * 60)) % 24)

  return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`
}

// Formata tempo em segundos para exibição
export const formatarTempo = (segundos: number) => {
  const mins = Math.floor(segundos / 60)
  const secs = segundos % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}
