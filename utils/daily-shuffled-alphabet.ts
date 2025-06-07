export const shuffleWithSeed = <T,>(array: T[]): T[] => {
  const newArray = [...array]
  let random = mulberry32(getDateSeed())
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[newArray[i], newArray[j]] = [newArray[j], newArray[i]]
  }
  return newArray
}

const mulberry32 = (a: number) => {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const getDateSeed = (): number => {
  const today = new Date()
  const dateString = today.toISOString().slice(0, 10) // "2025-06-07"
  let hash = 0
  for (let i = 0; i < dateString.length; i++) {
    hash = (hash << 5) - hash + dateString.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}
