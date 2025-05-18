<script setup lang="ts">
defineProps<{
  theme: string
}>()

const emit = defineEmits<{
  (e: 'toggle-theme'): void
}>()
</script>

<template>
  <header class="header">
    <div class="logo">
      <span class="logo-text">E2EE</span>
    </div>
    <button @click="emit('toggle-theme')" class="theme-toggle" :aria-label="`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`">
      <span v-if="theme === 'dark'" class="toggle-icon">🌞</span>
      <span v-else class="toggle-icon">🌙</span>
    </button>
  </header>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  width: 100%;
}

.logo {
  display: flex;
  align-items: center;
}

.logo-text {
  font-weight: 700;
  font-size: 20px;
  background: linear-gradient(90deg, var(--primary-light), var(--accent-light));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
}

.theme-toggle {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 24px;
  padding: 4px 8px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.theme-toggle:hover {
  transform: rotate(15deg);
}

.toggle-icon {
  display: inline-block;
  line-height: 1;
}

.dark .theme-toggle {
  color: var(--text-primary-dark);
}

.light .theme-toggle {
  color: var(--text-primary-light);
}
</style>