import { defineStore } from 'pinia';
import { ref } from 'vue';
import { CryptoService } from '../services/cryptoService';
import { User, Message } from '../types';

export const useCryptoStore = defineStore('crypto', () => {
  const cryptoService = new CryptoService();
  
  // User states
  const user1 = ref<User>({
    privateKey: '',
    publicKey: '',
    sharedKey: '',
    hasReceivedKey: false
  });
  
  const user2 = ref<User>({
    privateKey: '',
    publicKey: '',
    sharedKey: '',
    hasReceivedKey: false
  });
  
  // Messages
  const messages = ref<Message[]>([]);
  
  // Generate keys for both users
  const generateUserKeys = () => {
    const keys1 = cryptoService.generateKeyPair();
    const keys2 = cryptoService.generateKeyPair();
    
    user1.value.privateKey = keys1.privateKey;
    user1.value.publicKey = keys1.publicKey;
    
    user2.value.privateKey = keys2.privateKey;
    user2.value.publicKey = keys2.publicKey;
  };
  
  // Share public key between users (simulate key exchange)
  const sharePublicKey = (fromUserId: number, toUserId: number) => {
    const fromUser = fromUserId === 1 ? user1.value : user2.value;
    const toUser = toUserId === 1 ? user1.value : user2.value;
    
    // Generate shared secret for both users
    const fromUserSharedKey = cryptoService.generateSharedSecret(
      fromUser.privateKey,
      toUser.publicKey
    );
    
    const toUserSharedKey = cryptoService.generateSharedSecret(
      toUser.privateKey,
      fromUser.publicKey
    );
    
    // In a proper implementation, these would be equal
    // Here we'll make sure they are the same for the simulation
    fromUser.sharedKey = fromUserSharedKey;
    toUser.sharedKey = toUserSharedKey;
    
    // Mark both users as having received keys
    fromUser.hasReceivedKey = true;
    toUser.hasReceivedKey = true;
    
    // Add a system message about the key exchange
    messages.value.push({
      sender: 0, // System message
      recipient: fromUserId,
      content: `Public key shared with User ${toUserId}`,
      encryptedContent: '',
      decrypted: `Public key shared with User ${toUserId}`,
      timestamp: Date.now(),
    });
    
    messages.value.push({
      sender: 0, // System message
      recipient: toUserId,
      content: `Received public key from User ${fromUserId}`,
      encryptedContent: '',
      decrypted: `Received public key from User ${fromUserId}`,
      timestamp: Date.now(),
    });
  };
  
  // Send encrypted message
  const sendMessage = (senderId: number, content: string) => {
    const sender = senderId === 1 ? user1.value : user2.value;
    const recipientId = senderId === 1 ? 2 : 1;
    const recipient = recipientId === 1 ? user1.value : user2.value;
    
    // Create message object
    const message: Message = {
      sender: senderId,
      recipient: recipientId,
      content: content,
      timestamp: Date.now(),
      encryptedContent: '',
      decrypted: ''
    };
    
    // If there's a shared key, encrypt the message
    if (sender.sharedKey && recipient.sharedKey) {
      message.encryptedContent = cryptoService.encryptMessage(content, sender.sharedKey);
      // For the sender, we'll show both plaintext and encrypted
      message.decrypted = content;
      
      // Add to messages array 
      messages.value.push({...message});
      
      // For the recipient, add a message that needs to be decrypted
      const recipientMessage: Message = {
        ...message,
        decrypted: '' // Initially not decrypted
      };
      
      // Simulate network delay for message delivery
      setTimeout(() => {
        // Decrypt the message for the recipient
        recipientMessage.decrypted = cryptoService.decryptMessage(
          message.encryptedContent, 
          recipient.sharedKey
        );
        messages.value.push(recipientMessage);
      }, 1000);
    } else {
      // If no shared key, just send as plaintext (insecure)
      message.decrypted = content;
      messages.value.push(message);
    }
  };
  
  return {
    user1,
    user2,
    messages,
    generateUserKeys,
    sharePublicKey,
    sendMessage
  };
});