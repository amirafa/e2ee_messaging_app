<script setup lang="ts">
import { ref } from 'vue';
import MessengerInterface from './components/MessengerInterface.vue';
import HeaderComponent from './components/HeaderComponent.vue';
import { useCryptoStore } from './stores/cryptoStore';

const theme = ref('dark');
const cryptoStore = useCryptoStore();

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark';
};

// Initialize keys on app load
cryptoStore.generateUserKeys();
</script>

<template>
  <div :class="['app-container', theme]">
    <div class="content-wrapper">
      <HeaderComponent :theme="theme" @toggle-theme="toggleTheme" />
      <main>
        <h1>Secure Messaging</h1>
        <p class="subtitle">End-to-End Encrypted Communication</p>
        <MessengerInterface />
      </main>
      <footer>
        <p>© 2025 E2EE Messenger • All messages are encrypted end-to-end</p>
      </footer>
    </div>
  </div>
</template>

<style>
:root {
  /* Light Theme Colors */
  --primary-light: #0A84FF;
  --secondary-light: #5E5CE6;
  --accent-light: #30D158;
  --success-light: #34C759;
  --warning-light: #FFD60A;
  --error-light: #FF453A;
  --background-light: #F2F2F7;
  --surface-light: #FFFFFF;
  --text-primary-light: #1C1C1E;
  --text-secondary-light: #8E8E93;
  --border-light: #C6C6C8;

  /* Dark Theme Colors */
  --primary-dark: #0A84FF;
  --secondary-dark: #5E5CE6;
  --accent-dark: #30D158;
  --success-dark: #34C759;
  --warning-dark: #FF9F0A;
  --error-dark: #FF453A;
  --background-dark: #1C1C1E;
  --surface-dark: #2C2C2E;
  --text-primary-dark: #FFFFFF;
  --text-secondary-dark: #8E8E93;
  --border-dark: #38383A;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  transition: background-color 0.3s, color 0.3s, border-color 0.3s;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.5;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  padding: 0 16px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  width: 100%;
  padding: 24px 0;
}

h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
  text-align: center;
}

.subtitle {
  font-size: 18px;
  text-align: center;
  margin-bottom: 32px;
  font-weight: 400;
}

footer {
  padding: 24px 0;
  text-align: center;
  font-size: 14px;
}

/* Dark theme */
.dark {
  background-color: var(--background-dark);
  color: var(--text-primary-dark);
}

.dark footer {
  color: var(--text-secondary-dark);
}

/* Light theme */
.light {
  background-color: var(--background-light);
  color: var(--text-primary-light);
}

.light footer {
  color: var(--text-secondary-light);
}

@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }
  
  .subtitle {
    font-size: 16px;
    margin-bottom: 24px;
  }
}
</style>