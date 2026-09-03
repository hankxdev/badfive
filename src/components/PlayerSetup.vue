<script setup>
import { useMatches } from '../composables/useMatches.js'

const emit = defineEmits(['done'])
const { active } = useMatches()

const letter = (idx) => String.fromCharCode(65 + idx)
</script>

<template>
  <div v-if="active" class="bg-white p-4 rounded-2xl shadow-sm border border-blue-100">
    <h3 class="text-sm font-bold text-slate-800 mb-3">设定选手姓名</h3>
    <div class="grid grid-cols-1 gap-2 mb-3">
      <div v-for="(p, idx) in active.players" :key="p.id" class="flex items-center space-x-2">
        <span class="text-xs font-bold w-12 text-slate-500">选手 {{ letter(idx) }}</span>
        <input
          v-model="p.name"
          type="text"
          class="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
    <div class="flex justify-end">
      <button
        @click="emit('done')"
        class="px-4 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg shadow-sm"
      >
        完成
      </button>
    </div>
  </div>
</template>
