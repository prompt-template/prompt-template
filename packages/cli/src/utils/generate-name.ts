const adjectives = [
  'stellar',
  'radiant',
  'nimble',
  'zesty',
  'brisk',
  'clever',
  'bold',
  'polite',
  'vivid',
  'keen',
  'steady',
  'bright',
  'galactic',
  'curious',
  'sharp',
  'swift',
] as const

const nouns = [
  'phoenix',
  'ember',
  'beacon',
  'rocket',
  'otter',
  'riddle',
  'signal',
  'fox',
  'drone',
  'gizmo',
  'whisper',
  'pixel',
  'spark',
  'comet',
  'puzzle',
  'switch',
  'pickle',
] as const

const verbs = [
  'sparks',
  'flows',
  'soars',
  'rises',
  'glides',
  'drifts',
  'spins',
  'clicks',
  'dances',
  'sings',
  'echoes',
  'twinkles',
  'shuffles',
  'hums',
  'thinks',
  'flickers',
] as const

export function generateName(): string {
  const adjective = pick(adjectives)
  const noun = pick(nouns)
  const verb = pick(verbs)

  return `z-${adjective}-${noun}-${verb}`
}

function pick<T>(list: readonly T[]): T {
  return list[Math.floor(Math.random() * list.length)] as T
}
