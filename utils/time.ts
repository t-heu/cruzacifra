// Formata o tempo restante
export const formatarTempoRestante = (ms: number) => {
  const segundos = Math.floor((ms / 1000) % 60)
  const minutos = Math.floor((ms / (1000 * 60)) % 60)
  const horas = Math.floor((ms / (1000 * 60 * 60)) % 24)

  return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segundos.toString().padStart(2, "0")}`
}
