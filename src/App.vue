<script setup>
import { computed } from 'vue'
import { useMatches } from './composables/useMatches.js'
import MatchList from './components/MatchList.vue'
import MatchView from './components/MatchView.vue'

const { activeId, active } = useMatches()

const showMatch = computed(() => activeId.value && active.value)
</script>

<template>
  <div class="max-w-md mx-auto p-4">
    <MatchView v-if="showMatch" />
    <MatchList v-else />
  </div>
</template>
