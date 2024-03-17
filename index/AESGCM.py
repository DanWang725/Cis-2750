from cryptography.hazmat.primitives.ciphers import algorithms, modes, Cipher
from NonceCipherContext import DecryptContext, NonceEncryptContext, NonceDecryptContext
import os
# AES function for CTR mode
class AESGCM:
    def __init__(self, key):
        # recommended thing
        self.key = key

    def encryptor(self) -> NonceEncryptContext:
        self.nonce = os.urandom(12)
        return NonceEncryptContext(Cipher(algorithms.AES(self.key), modes.GCM(self.nonce)), self.nonce, True)
    
    def decryptor(self)  -> NonceDecryptContext:
        return NonceDecryptContext(self.key, True)
    
    def decryptor(self, nonce)  -> NonceDecryptContext:
        return DecryptContext(self.key, nonce, True)