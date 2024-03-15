from cryptography.hazmat.primitives import ciphers, padding
from cryptography.hazmat.primitives.ciphers import algorithms, Cipher, modes

# wrapper CipherContext to handle the addition of the nonce before the ciphertext when encrypting
class NonceEncryptContext:
    def __init__(self, cipherContext: ciphers.CipherContext, nonce, CGM = False, requiresPadding = False):
        self.cipherContext = cipherContext
        self.nonce = nonce
        self.requiresPadding = requiresPadding
    
    def update(self, data):
        
        if(self.requiresPadding):
            padder = padding.PKCS7.padder()
            paddedData = padder.update(data)
            paddedData += padder.finalize()
            data = paddedData

        self.ciphertext = self.nonce + self.cipherContext.update(data) + self.cipherContext.finalize()
        return self.ciphertext

# wrapper CipherContext to handle reading of the prefix nonce during decryption. 
# also handles CGM tag
class NonceDecryptContext:
    def __init__(self, key, CGM = False, hasPadding = False):
        self.hasPadding = hasPadding
        self.CGM = CGM
        self.key = key

    
    def update(self, data):
        nonce = data[:12]
        ciphertext = data[12:]

        if(self.hasPadding):
            unpadder = padding.PKCS7.unpadder()
            ciphertext = unpadder.update(data[12:])

        self.cipherContext = Cipher(algorithms.AES(self.key), modes.CTR(nonce)).decryptor()
        
        self.plaintext = self.cipherContext.update(ciphertext)
        if(self.CGM):
            self.plaintext += self.cipherContext.finalize_with_tag()
        else:
            self.plaintext += self.cipherContext.finalize()
            
        return self.plaintext
