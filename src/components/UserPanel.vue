<script setup lang="ts">
import { ref } from 'vue';
import { Message } from '../types';

defineProps<{
  userId: number,
  userName: string,
  messages: Message[],
  message: string,
  publicKey: string,
  privateKey: string,
  sharedKey: string,
  hasReceivedKey: boolean
}>();

const emit = defineEmits<{
  (e: 'update:message', value: string): void,
  (e: 'send-message'): void,
  (e: 'copy-key'): void,
  (e: 'share-key'): void
}>();

const showKeys = ref(false);

const toggleShowKeys = () => {
  showKeys.value = !showKeys.value;
};

const formatTimestamp = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};
</script>

<template>
  <div class="user-panel">
    <div class="user-header">
      <h2>{{ userName }}</h2>
      <div class="key-status" :class="{ active: hasReceivedKey }">
        <span v-if="hasReceivedKey">🔒 Secure Connection</span>
        <span v-else>🔓 Unsecured</span>
      </div>
    </div>
    
    <div class="messages-container">
      <div v-if="messages.length === 0" class="no-messages">
        No messages yet. Start the conversation!
      </div>
      <div v-else class="messages-list">
        <div v-for="(msg, index) in messages" :key="index" 
             :class="['message-bubble', userId === msg.sender ? 'sent' : 'received']">
          <div class="message-content">
            <p>{{ msg.decrypted || '(Encrypted message)' }}</p>
            <span class="message-time">{{ formatTimestamp(msg.timestamp) }}</span>
          </div>
          <div v-if="!msg.decrypted && msg.encryptedContent" class="encrypted-indicator">
            🔒 Encrypted
          </div>
        </div>
      </div>
    </div>
    
    <div class="message-composer">
      <textarea 
        :value="message"
        @input="e => emit('update:message', (e.target as HTMLTextAreaElement).value)"
        :placeholder="`Type a message as ${userName}...`"
        :disabled="!hasReceivedKey"
        class="message-input"
      ></textarea>
      <div class="composer-actions">
        <button @click="toggleShowKeys" class="action-btn key-btn">
          {{ showKeys ? 'Hide Keys' : 'Show Keys' }}
        </button>
        <button 
          @click="emit('send-message')" 
          class="action-btn send-btn" 
          :disabled="!message.trim() || !hasReceivedKey"
        >
          Send
        </button>
      </div>
    </div>
    
    <div v-if="showKeys" class="keys-section">
      <div class="key-item">
        <div class="key-header">
          <h3>Public Key</h3>
          <button @click="emit('copy-key')" class="copy-btn">Copy</button>
        </div>
        <pre class="key-display">{{ publicKey.substring(0, 20) }}...{{ publicKey.substring(publicKey.length - 20) }}</pre>
      </div>
      
      <div class="key-item">
        <div class="key-header">
          <h3>Private Key</h3>
        </div>
        <pre class="key-display private">{{ privateKey.substring(0, 10) }}...{{ privateKey.substring(privateKey.length - 10) }}</pre>
      </div>
      
      <div class="key-item" v-if="sharedKey">
        <div class="key-header">
          <h3>Shared Secret</h3>
        </div>
        <pre class="key-display shared">{{ sharedKey.substring(0, 10) }}...{{ sharedKey.substring(sharedKey.length - 10) }}</pre>
      </div>
      
      <button 
        @click="emit('share-key')" 
        class="share-key-btn"
        :disabled="hasReceivedKey"
      >
        {{ hasReceivedKey ? 'Key Exchanged' : 'Share Public Key' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.user-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--surface-dark);
  border-radius: 12px;
  overflow: hidden;
  max-width: calc(50% - 16px);
}

.light .user-panel {
  background-color: var(--surface-light);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.user-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-dark);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.light .user-header {
  border-bottom: 1px solid var(--border-light);
}

.key-status {
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 16px;
  background-color: var(--error-dark);
  color: white;
  display: flex;
  align-items: center;
  gap: 4px;
  transition: background-color 0.3s ease;
}

.key-status.active {
  background-color: var(--accent-dark);
}

.messages-container {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  max-height: 300px;
}

.no-messages {
  text-align: center;
  color: var(--text-secondary-dark);
  margin-top: 48px;
}

.light .no-messages {
  color: var(--text-secondary-light);
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-bubble {
  max-width: 80%;
  padding: 12px;
  border-radius: 16px;
  position: relative;
}

.message-bubble.sent {
  align-self: flex-end;
  background-color: var(--primary-dark);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-bubble.received {
  align-self: flex-start;
  background-color: #3A3A3C;
  color: white;
  border-bottom-left-radius: 4px;
}

.light .message-bubble.received {
  background-color: #E9E9EB;
  color: var(--text-primary-light);
}

.message-content {
  display: flex;
  flex-direction: column;
}

.message-time {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 4px;
  align-self: flex-end;
}

.encrypted-indicator {
  font-size: 12px;
  margin-top: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--warning-dark);
}

.message-composer {
  padding: 16px;
  border-top: 1px solid var(--border-dark);
}

.light .message-composer {
  border-top: 1px solid var(--border-light);
}

.message-input {
  width: 100%;
  border: 1px solid var(--border-dark);
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--text-primary-dark);
  border-radius: 8px;
  padding: 12px;
  min-height: 80px;
  resize: none;
  font-family: inherit;
  font-size: 14px;
  margin-bottom: 8px;
}

.light .message-input {
  border: 1px solid var(--border-light);
  background-color: #F2F2F7;
  color: var(--text-primary-light);
}

.message-input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.composer-actions {
  display: flex;
  justify-content: space-between;
}

.action-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.key-btn {
  background-color: transparent;
  border: 1px solid var(--border-dark);
  color: var(--text-primary-dark);
}

.light .key-btn {
  border: 1px solid var(--border-light);
  color: var(--text-primary-light);
}

.send-btn {
  background-color: var(--primary-dark);
  color: white;
  border: none;
}

.send-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.keys-section {
  padding: 16px;
  border-top: 1px solid var(--border-dark);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.light .keys-section {
  border-top: 1px solid var(--border-light);
}

.key-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.key-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.key-header h3 {
  font-size: 14px;
  font-weight: 600;
}

.copy-btn {
  background-color: transparent;
  border: none;
  color: var(--primary-dark);
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
}

.key-display {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 8px;
  font-size: 12px;
  font-family: monospace;
  word-break: break-all;
  margin: 0;
}

.light .key-display {
  background-color: #F2F2F7;
}

.key-display.private {
  color: var(--error-dark);
}

.key-display.shared {
  color: var(--accent-dark);
}

.share-key-btn {
  background-color: var(--accent-dark);
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 8px;
}

.share-key-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
  .user-panel {
    max-width: 100%;
  }
}
</style>