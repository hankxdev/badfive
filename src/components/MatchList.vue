<script setup>
import { useMatches } from '../composables/useMatches.js'

const { index, createMatch, loadMatch, deleteMatch, renameMatch } = useMatches()

const formatDate = (ts) => {
  const d = new Date(ts)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const onRename = (m) => {
  const name = prompt('修改比赛名称', m.name)
  if (name && name.trim()) renameMatch(m.id, name.trim())
}

const onDelete = (m) => {
  if (confirm(`删除「${m.name}」？该比赛数据将被永久删除。`)) deleteMatch(m.id)
}
</script>

<template>
  <header class="mb-4 bg-white p-4 rounded-2xl shadow-sm">
    <h1 class="text-xl font-bold text-slate-900">羽毛球5人15局对抗赛</h1>
    <p class="text-xs text-slate-500 mt-1">每人打12局 · 休3局 · 个人积分制</p>
  </header>

  <button
    @click="createMatch()"
    class="w-full mb-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-sm transition"
  >
    + 新建一场比赛
  </button>

  <div v-if="index.length === 0" class="bg-white p-8 rounded-2xl shadow-sm text-center text-slate-400 text-sm">
    还没有比赛记录，点击上方按钮开始第一场比赛吧。
  </div>

  <div v-else class="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div class="p-3 bg-slate-900 text-white text-sm font-bold">历史比赛</div>
    <ul class="divide-y divide-slate-100">
      <li
        v-for="m in index"
        :key="m.id"
        class="p-4 flex items-center justify-between hover:bg-slate-50 transition"
      >
        <button class="flex-1 text-left" @click="loadMatch(m.id)">
          <div class="font-bold text-slate-800 text-sm">{{ m.name }}</div>
          <div class="text-xs text-slate-400 mt-0.5">最后更新 {{ formatDate(m.updatedAt) }}</div>
        </button>
        <div class="flex items-center space-x-2 ml-3">
          <button
            @click.stop="onRename(m)"
            class="text-xs px-2 py-1 rounded-lg text-slate-500 hover:bg-slate-100"
            title="重命名"
          >
            改名
          </button>
          <button
            @click.stop="onDelete(m)"
            class="text-xs px-2 py-1 rounded-lg text-red-500 hover:bg-red-50"
            title="删除"
          >
            删除
          </button>
        </div>
      </li>
    </ul>
  </div>
</template>
