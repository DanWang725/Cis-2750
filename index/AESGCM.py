from cryptography.hazmat.primitives.ciphers import algorithms, modes, Cipher
from NonceCipherContext import NonceEncryptContext, NonceDecryptContext
import os
# AES function for CTR mode
class AESGCM:
    def __init__(self, keylen, key):
        # recommended thing
        self.keylen = keylen
        self.key = key

    def encryptor(self):
        self.nonce = os.urandom(12)
        return NonceEncryptContext(Cipher(algorithms.AES(self.keylen), modes.GCM(self.nonce)), self.nonce, True)
    
    def decryptor(self):
        return NonceDecryptContext(self.keylen, True)