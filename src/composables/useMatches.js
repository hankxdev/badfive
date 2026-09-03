import { ref, computed, watch } from 'vue'

const INDEX_KEY = 'badfive:matches'
const ACTIVE_KEY = 'badfive:activeId'
const matchKey = (id) => `badfive:match:${id}`

const defaultPlayers = () => [
  { id: 0, name: '选手 A' },
  { id: 1, name: '选手 B' },
  { id: 2, name: '选手 C' },
  { id: 3, name: '选手 D' },
  { id: 4, name: '选手 E' },
]

const matchMatrix = [
  { rest: 4, t1: [0, 1], t2: [2, 3] },
  { rest: 3, t1: [0, 4], t2: [1, 2] },
  { rest: 2, t1: [0, 3], t2: [1, 4] },
  { rest: 1, t1: [0, 2], t2: [3, 4] },
  { rest: 0, t1: [1, 3], t2: [2, 4] },
  { rest: 4, t1: [0, 2], t2: [1, 3] },
  { rest: 3, t1: [0, 1], t2: [2, 4] },
  { rest: 2, t1: [0, 4], t2: [1, 3] },
  { rest: 1, t1: [0, 3], t2: [2, 4] },
  { rest: 0, t1: [1, 2], t2: [3, 4] },
  { rest: 4, t1: [0, 3], t2: [1, 2] },
  { rest: 3, t1: [0, 2], t2: [1, 4] },
  { rest: 2, t1: [0, 1], t2: [3, 4] },
  { rest: 1, t1: [0, 4], t2: [2, 3] },
  { rest: 0, t1: [1, 4], t2: [2, 3] },
]

const initRounds = () =>
  matchMatrix.map((m) => ({ ...m, t1: [...m.t1], t2: [...m.t2], s1: 21, s2: 18, finished: false }))

const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const writeJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value))

const genId = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const stamp = `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`
  const rand = Math.random().toString(36).slice(2, 6)
  return `${stamp}-${rand}`
}

const defaultMatchName = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} 比赛`
}

const index = ref(readJSON(INDEX_KEY, []))
const activeId = ref(localStorage.getItem(ACTIVE_KEY) || null)

const emptyMatch = () => ({
  players: defaultPlayers(),
  rounds: initRounds(),
  currentRound: 0,
})

const active = ref(activeId.value ? readJSON(matchKey(activeId.value), null) : null)

watch(index, (v) => writeJSON(INDEX_KEY, v), { deep: true })
watch(activeId, (v) => {
  if (v) localStorage.setItem(ACTIVE_KEY, v)
  else localStorage.removeItem(ACTIVE_KEY)
})
watch(
  active,
  (v) => {
    if (!activeId.value || !v) return
    writeJSON(matchKey(activeId.value), v)
    const entry = index.value.find((m) => m.id === activeId.value)
    if (entry) entry.updatedAt = Date.now()
  },
  { deep: true },
)

const sortedMatches = computed(() =>
  [...index.value].sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0)),
)

const createMatch = (name) => {
  const id = genId()
  const now = Date.now()
  index.value.push({ id, name: name || defaultMatchName(), createdAt: now, updatedAt: now })
  writeJSON(matchKey(id), emptyMatch())
  loadMatch(id)
  return id
}

const loadMatch = (id) => {
  const data = readJSON(matchKey(id), null)
  if (!data) return false
  activeId.value = id
  active.value = data
  return true
}

const deleteMatch = (id) => {
  localStorage.removeItem(matchKey(id))
  index.value = index.value.filter((m) => m.id !== id)
  if (activeId.value === id) {
    activeId.value = null
    active.value = null
  }
}

const renameMatch = (id, name) => {
  const entry = index.value.find((m) => m.id === id)
  if (entry) {
    entry.name = name
    entry.updatedAt = Date.now()
  }
}

const closeMatch = () => {
  activeId.value = null
  active.value = null
}

export function useMatches() {
  return {
    index: sortedMatches,
    activeId,
    active,
    createMatch,
    loadMatch,
    deleteMatch,
    renameMatch,
    closeMatch,
  }
}
