<script setup>
import { computed } from 'vue'
import { useMatches } from '../composables/useMatches.js'

const emit = defineEmits(['finished'])
const { active } = useMatches()

const current = computed(() => active.value.rounds[active.value.currentRound])

const adjustScore = (team, delta) => {
  const r = current.value
  if (team === 's1') r.s1 = Math.max(0, (Number(r.s1) || 0) + delta)
  if (team === 's2') r.s2 = Math.max(0, (Number(r.s2) || 0) + delta)
}

const prevRound = () => {
  if (active.value.currentRound > 0) active.value.currentRound--
}
const nextRound = () => {
  if (active.value.currentRound < 14) active.value.currentRound++
}

const saveRoundScore = () => {
  current.value.finished = true
  if (active.value.currentRound < 14) {
    active.value.currentRound++
  } else {
    emit('finished')
  }
}
</script>

<template>
  <div v-if="active" class="space-y-4">
    <div class="bg-white p-3 rounded-2xl shadow-sm flex items-center justify-between">
      <button
        @click="prevRound"
        :disabled="active.currentRound === 0"
        class="px-3 py-2 bg-slate-100 disabled:opacity-30 rounded-xl font-bold text-slate-700"
      >
        ← 上一局
      </button>
      <div class="text-center">
        <span class="text-lg font-black text-blue-600">第 {{ active.currentRound + 1 }} / 15 局</span>
        <div class="text-xs text-amber-600 font-medium">
          ☕ 休: {{ active.players[current.rest].name }}
        </div>
      </div>
      <button
        @click="nextRound"
        :disabled="active.currentRound === 14"
        class="px-3 py-2 bg-slate-100 disabled:opacity-30 rounded-xl font-bold text-slate-700"
      >
        下一局 →
      </button>
    </div>

    <div class="bg-white rounded-2xl p-5 shadow-md border border-slate-100">
      <div class="grid grid-cols-2 gap-4 text-center items-center">
        <div class="space-y-2">
          <div class="text-xs font-bold text-blue-500 uppercase tracking-wider">队伍 1</div>
          <div class="font-bold text-slate-800 text-sm">
            <div>{{ active.players[current.t1[0]].name }}</div>
            <div>{{ active.players[current.t1[1]].name }}</div>
          </div>
          <div class="flex items-center justify-center space-x-2 pt-2">
            <button
              @click="adjustScore('s1', -1)"
              class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-lg flex items-center justify-center"
            >
              -
            </button>
            <input
              v-model.number="current.s1"
              type="number"
              class="w-16 h-12 text-center text-2xl font-black bg-blue-50 border border-blue-200 rounded-xl focus:outline-none"
            />
            <button
              @click="adjustScore('s1', 1)"
              class="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <div class="text-xs font-bold text-red-500 uppercase tracking-wider">队伍 2</div>
          <div class="font-bold text-slate-800 text-sm">
            <div>{{ active.players[current.t2[0]].name }}</div>
            <div>{{ active.players[current.t2[1]].name }}</div>
          </div>
          <div class="flex items-center justify-center space-x-2 pt-2">
            <button
              @click="adjustScore('s2', -1)"
              class="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold text-lg flex items-center justify-center"
            >
              -
            </button>
            <input
              v-model.number="current.s2"
              type="number"
              class="w-16 h-12 text-center text-2xl font-black bg-red-50 border border-red-200 rounded-xl focus:outline-none"
            />
            <button
              @click="adjustScore('s2', 1)"
              class="w-8 h-8 rounded-full bg-red-600 text-white font-bold text-lg flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-between items-center pt-4 border-t border-slate-100">
        <span class="text-xs text-slate-400">
          状态：{{ current.finished ? '✅ 已保存' : '⏳ 记分中' }}
        </span>
        <button
          @click="saveRoundScore"
          class="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl shadow-md transition"
        >
          保存本局成绩
        </button>
      </div>
    </div>

    <div class="bg-white rounded-2xl p-4 shadow-sm">
      <h3 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">15局进度总览</h3>
      <div class="grid grid-cols-5 gap-2">
        <button
          v-for="(r, idx) in active.rounds"
          :key="idx"
          @click="active.currentRound = idx"
          :class="[
            active.currentRound === idx ? 'ring-2 ring-blue-500 font-bold' : '',
            r.finished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600',
          ]"
          class="py-2 rounded-lg text-xs flex flex-col items-center justify-center"
        >
          <span>第{{ idx + 1 }}局</span>
          <span class="text-[10px] opacity-75">休:{{ active.players[r.rest].name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
