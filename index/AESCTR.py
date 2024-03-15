from cryptography.hazmat.primitives.ciphers import algorithms, modes, Cipher, CipherContext
from NonceCipherContext import NonceEncryptContext, NonceDecryptContext
import os
# AES function for CTR mode
class AESCTR:
    def __init__(self, key):
        # recommended thing
        self.key = key

    def encryptor(self) -> NonceEncryptContext:
        self.nonce = os.urandom(12)
        return NonceEncryptContext(Cipher(algorithms.AES(self.key), modes.CTR(self.nonce)), self.nonce) 
    
    def decryptor(self)  -> NonceDecryptContext:
        return NonceDecryptContext(self.key)