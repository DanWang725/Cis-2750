import os
from cryptography.hazmat.primitives.ciphers import aead;

def AESSIVWithNonce(k, data):
    nonce = os.urandom(16)
    aessiv = aead.AESSIV(k)
    return nonce + aessiv.encrypt(data, [nonce])
