<script setup>
import { ref, computed } from 'vue'
import { useMatches } from '../composables/useMatches.js'
import PlayerSetup from './PlayerSetup.vue'
import RoundScorer from './RoundScorer.vue'
import Leaderboard from './Leaderboard.vue'

const { active, activeId, index, closeMatch, renameMatch } = useMatches()

const activeTab = ref('matches')
const showSetup = ref(false)

const matchMeta = computed(() => index.value.find((m) => m.id === activeId.value))

const onRename = () => {
  if (!matchMeta.value) return
  const name = prompt('修改比赛名称', matchMeta.value.name)
  if (name && name.trim()) renameMatch(activeId.value, name.trim())
}
</script>

<template>
  <div v-if="active" class="space-y-4">
    <header class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm">
      <div class="min-w-0 flex-1">
        <button
          @click="closeMatch"
          class="text-xs text-slate-500 hover:text-slate-800 flex items-center"
        >
          ← 返回列表
        </button>
        <h1
          @click="onRename"
          class="text-lg font-bold text-slate-900 mt-1 cursor-pointer truncate"
          :title="matchMeta?.name"
        >
          {{ matchMeta?.name || '比赛' }}
        </h1>
      </div>
      <button
        @click="showSetup = !showSetup"
        class="ml-3 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition shrink-0"
      >
        {{ showSetup ? '收起设置' : '修改名单' }}
      </button>
    </header>

    <PlayerSetup v-if="showSetup" @done="showSetup = false" />

    <div class="flex bg-slate-200 p-1 rounded-xl">
      <button
        @click="activeTab = 'matches'"
        :class="activeTab === 'matches' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'"
        class="flex-1 py-2 text-sm font-bold rounded-lg transition text-center"
      >
        🏸 赛程与记分
      </button>
      <button
        @click="activeTab = 'leaderboard'"
        :class="activeTab === 'leaderboard' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'"
        class="flex-1 py-2 text-sm font-bold rounded-lg transition text-center"
      >
        🏆 个人排行榜
      </button>
    </div>

    <RoundScorer v-show="activeTab === 'matches'" @finished="activeTab = 'leaderboard'" />
    <Leaderboard v-show="activeTab === 'leaderboard'" />
  </div>
</template>
