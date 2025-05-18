export interface User {
  privateKey: string;
  publicKey: string;
  sharedKey: string;
  hasReceivedKey: boolean;
}

export interface Message {
  sender: number;
  recipient: number;
  content: string;
  encryptedContent: string;
  decrypted: string;
  timestamp: number;
}