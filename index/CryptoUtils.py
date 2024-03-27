import os
from cryptography.hazmat.primitives.ciphers import aead;

def AESSIVEncryptNonce(k, data, nonceLength = 12):
    typecastedData = bytes(data, 'utf-8')
    nonce = os.urandom(nonceLength)
    aessiv = aead.AESSIV(k)
    ciphertext = aessiv.encrypt(typecastedData, [nonce])
    return nonce + ciphertext

def AESSIVDecryptNonce(k, ciphertext, nonceLength = 12):
    nonce = ciphertext[:nonceLength]
    data = ciphertext[nonceLength:]
    aessiv = aead.AESSIV(k)
    return aessiv.decrypt(data, [nonce])