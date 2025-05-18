<script setup lang="ts">
import { ref, computed } from 'vue';
import UserPanel from './UserPanel.vue';
import { useCryptoStore } from '../stores/cryptoStore';
import { Message } from '../types';

const cryptoStore = useCryptoStore();

const user1Message = ref('');
const user2Message = ref('');

const handleSendMessage = (userId: number, message: string) => {
  if (!message.trim()) return;
  
  cryptoStore.sendMessage(userId, message);
  
  if (userId === 1) {
    user1Message.value = '';
  } else {
    user2Message.value = '';
  }
};

const handleCopyPublicKey = (userId: number) => {
  const key = userId === 1 ? cryptoStore.user1.publicKey : cryptoStore.user2.publicKey;
  navigator.clipboard.writeText(key)
    .then(() => {
      alert(`User ${userId} public key copied to clipboard!`);
    })
    .catch(err => {
      console.error('Failed to copy key:', err);
    });
};

const handleShareKey = (userId: number) => {
  if (userId === 1) {
    cryptoStore.sharePublicKey(1, 2);
  } else {
    cryptoStore.sharePublicKey(2, 1);
  }
};

const user1Messages = computed(() => 
  cryptoStore.messages.filter(m => m.recipient === 1 || m.sender === 1)
);

const user2Messages = computed(() => 
  cryptoStore.messages.filter(m => m.recipient === 2 || m.sender === 2)
);
</script>

<template>
  <div class="messenger-container">
    <div class="messenger-wrapper">
      <UserPanel 
        :userId="1"
        :userName="'Alice'"
        :messages="user1Messages"
        :message="user1Message"
        :sharedKey="cryptoStore.user1.sharedKey"
        :publicKey="cryptoStore.user1.publicKey"
        :privateKey="cryptoStore.user1.privateKey"
        :hasReceivedKey="cryptoStore.user1.hasReceivedKey"
        @update:message="(newVal) => user1Message = newVal"
        @send-message="() => handleSendMessage(1, user1Message)"
        @copy-key="handleCopyPublicKey(1)"
        @share-key="handleShareKey(1)"
      />
      
      <div class="divider">
        <div class="encryption-animation">
          <div class="encryption-line"></div>
        </div>
      </div>
      
      <UserPanel 
        :userId="2"
        :userName="'Bob'"
        :messages="user2Messages"
        :message="user2Message"
        :sharedKey="cryptoStore.user2.sharedKey"
        :publicKey="cryptoStore.user2.publicKey"
        :privateKey="cryptoStore.user2.privateKey"
        :hasReceivedKey="cryptoStore.user2.hasReceivedKey"
        @update:message="(newVal) => user2Message = newVal"
        @send-message="() => handleSendMessage(2, user2Message)"
        @copy-key="handleCopyPublicKey(2)"
        @share-key="handleShareKey(2)"
      />
    </div>
  </div>
</template>

<style scoped>
.messenger-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.messenger-wrapper {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  width: 100%;
  gap: 16px;
}

.divider {
  position: relative;
  width: 2px;
  background-color: var(--border-dark);
  margin: 0 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.light .divider {
  background-color: var(--border-light);
}

.encryption-animation {
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.encryption-line {
  position: absolute;
  width: 100%;
  height: 20px;
  background: linear-gradient(90deg, var(--primary-light) 0%, var(--accent-light) 100%);
  animation: move 2s infinite;
  opacity: 0.7;
  border-radius: 4px;
}

@keyframes move {
  0% {
    top: 0;
    opacity: 0;
  }
  10% {
    opacity: 0.7;
  }
  90% {
    opacity: 0.7;
  }
  100% {
    top: calc(100% - 20px);
    opacity: 0;
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .messenger-wrapper {
    flex-direction: column;
    gap: 32px;
  }
  
  .divider {
    width: 100%;
    height: 2px;
    margin: 8px 0;
  }
  
  .encryption-line {
    width: 20px;
    height: 100%;
    animation: move-horizontal 2s infinite;
  }
  
  @keyframes move-horizontal {
    0% {
      left: 0;
      opacity: 0;
    }
    10% {
      opacity: 0.7;
    }
    90% {
      opacity: 0.7;
    }
    100% {
      left: calc(100% - 20px);
      opacity: 0;
    }
  }
}
</style>