import CryptoJS from 'crypto-js';

export class CryptoService {
  /**
   * Generate a random key pair
   */
  generateKeyPair(): { privateKey: string; publicKey: string } {
    // In a real app, we would use Web Crypto API for true asymmetric cryptography
    // This is a simplified simulation of the Diffie-Hellman key exchange
    const privateKey = CryptoJS.lib.WordArray.random(32).toString();
    const publicKey = CryptoJS.SHA256(privateKey).toString();
    
    return {
      privateKey,
      publicKey
    };
  }

  /**
   * Simulate Diffie-Hellman key exchange to create a shared secret
   */
  generateSharedSecret(privateKey: string, otherPublicKey: string): string {
    // In a real app, this would be an actual DH computation
    // For this demo, we're combining the keys and hashing them
    const combined = privateKey + otherPublicKey;
    return CryptoJS.SHA256(combined).toString();
  }

  /**
   * Encrypt a message using AES with the shared key
   */
  encryptMessage(plaintext: string, sharedKey: string): string {
    return CryptoJS.AES.encrypt(plaintext, sharedKey).toString();
  }

  /**
   * Decrypt a message using AES with the shared key
   */
  decryptMessage(ciphertext: string, sharedKey: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, sharedKey);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption failed:', error);
      return '';
    }
  }
}