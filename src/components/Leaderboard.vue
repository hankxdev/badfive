<script setup>
import { computed } from 'vue'
import { useMatches } from '../composables/useMatches.js'

const { active } = useMatches()

const sortedLeaderboard = computed(() => {
  if (!active.value) return []
  const stats = active.value.players.map((p) => ({
    id: p.id,
    name: p.name,
    totalScore: 0,
    netScore: 0,
    wins: 0,
    played: 0,
  }))

  active.value.rounds.forEach((r) => {
    if (!r.finished) return
    const s1 = Number(r.s1) || 0
    const s2 = Number(r.s2) || 0

    r.t1.forEach((pid) => {
      stats[pid].played++
      stats[pid].totalScore += s1
      stats[pid].netScore += s1 - s2
      if (s1 > s2) stats[pid].wins++
    })
    r.t2.forEach((pid) => {
      stats[pid].played++
      stats[pid].totalScore += s2
      stats[pid].netScore += s2 - s1
      if (s2 > s1) stats[pid].wins++
    })
  })

  return stats.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore
    if (b.netScore !== a.netScore) return b.netScore - a.netScore
    return b.wins - a.wins
  })
})
</script>

<template>
  <div class="space-y-4">
    <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div class="p-4 bg-slate-900 text-white flex justify-between items-center">
        <span class="font-bold text-sm">个人积分榜</span>
        <span class="text-xs text-slate-400">按总得分排序</span>
      </div>
      <div class="divide-y divide-slate-100">
        <div
          v-for="(p, rank) in sortedLeaderboard"
          :key="p.id"
          class="p-4 flex items-center justify-between"
        >
          <div class="flex items-center space-x-3">
            <span
              :class="[
                rank === 0 ? 'bg-amber-400 text-white' :
                rank === 1 ? 'bg-slate-300 text-slate-800' :
                rank === 2 ? 'bg-amber-700 text-white' : 'bg-slate-100 text-slate-500',
                'w-7 h-7 rounded-full flex items-center justify-center font-black text-xs',
              ]"
            >
              {{ rank + 1 }}
            </span>
            <div>
              <div class="font-bold text-slate-800 text-sm">{{ p.name }}</div>
              <div class="text-xs text-slate-400">已打 {{ p.played }} 局 | 胜 <span class="text-green-500">{{ p.wins }}</span> 场  | 负 <span class="text-red-500">{{ p.played - p.wins }}</span> 场</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-lg font-black text-blue-600">
              {{ p.totalScore }} <span class="text-xs font-normal text-slate-400">分</span>
            </div>
            <div class="text-xs text-slate-400">
              净胜:
              <span
                :class="p.netScore >= 0 ? 'text-emerald-600' : 'text-red-500'"
                class="font-bold"
              >
                {{ p.netScore > 0 ? '+' + p.netScore : p.netScore }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-blue-50 p-4 rounded-2xl text-xs text-blue-800 leading-relaxed">
      💡 <strong>规则说明</strong>：<br />
      采用<strong>个人净得分累加法</strong>。每局比赛自己拿到的比分直接计入个人总分。即使输掉比赛，多拿1分也能提升个人排名！
    </div>
  </div>
</template>
