from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes, CipherContext, aead;
from cryptography.hazmat.primitives import padding, hashes;
import os
from Node import Node
from AESCTR import AESCTR
from AESGCM import AESGCM
from NonceCipherContext import NonceDecryptContext, NonceEncryptContext
from cuckoopy import CuckooFilter

keyLength = 256
kStuff = 1
keyPsi = os.urandom(256//8)
keyPhi = aead.AESSIV.generate_key(256)
mockVal = bytes('aa', 'utf-8')

# https://www.geeksforgeeks.org/xor-two-binary-strings-of-unequal-lengths/
def get_xor(a, b):
    result = ""                 # Initialize an empty string to store the XOR result
    n = len(a)                  
    m = len(b)                 
    length = max(n, m)         
     
    for i in range(length):     # Iterate through each bit position
        x = int(a[n - i - 1]) if i < n else 0   # Get i-th bit of 'a' or 0 if it doesn't exist
        y = int(b[m - i - 1]) if i < m else 0   # Get i-th bit of 'b' or 0 if it doesn't exist
        z = x ^ y               # Calculate XOR of x and y
        result = str(z) + result               # Prepend the XOR result to the 'result' string
     
    return result

GCMIV = os.urandom(12)
def BuildDictionary(D):
    return {"test":[]}

def BuildIndex(D, K):
    W = BuildDictionary(D)
    A = [None] * len(W)
    storage = []
    headsLookupTable = {}
    PsiCipher = AESCTR(keyPsi);
    ctr = 1


    for keyword in W:
        kHead = os.urandom(keyLength // 8) #initialize the ki,0 and the address of n1,j
        addressGenerator = PsiCipher.encryptor((1).to_bytes(16, "big"))
        addr = addressGenerator.encrypt(ctr.to_bytes(16, "big"))
        storage.append((addr, kHead)) # store these for later use

        for j in range(len(W[keyword])): #create linked list
            kNext = os.urandom(keyLength // 8)
            node = Node(W[keyword][j], kNext, None)

            if(j != len(W[keyword]) - 1):
                psuedoRandomPerm = PsiCipher.encryptor((1).to_bytes(16, "big"))
                
                psiCtr = psuedoRandomPerm.update((ctr + 1).to_bytes(16, "big"))
                node.setNextAddress(psiCtr)
            

            aessiv = aead.AESSIV(keyPhi) #encrypting each node
            nonce = os.urandom(16)      #generating a 128-bit nonce
            ct = nonce + aessiv.encrypt(bytes(str(node),'utf-8'), [nonce]) #use AESSIV for undeterministic symmetric encryption
            
            #generate the address for the current node to go
            psuedoRandomPerm = PsiCipher.encryptor((1).to_bytes(16, "big"))
            curAddr = psuedoRandomPerm.update(ctr.to_bytes(16, "big"))

            A[curAddr] = ct
            kHead = kNext

    cf = CuckooFilter(capacity=10000, bucket_size=4, fingerprint_size=1)

    for i in range(len(W)):
        (addr, k) = storage[i]
        keyword = W.keys[i]
        digest = hashes.SHA256()
        digest.update(bytes(keyword, "utf-8"))
        val = digest.finalize()

        value = get_xor(addr + k, val)
        headsLookupTable["change this"] = value
    
    I = (headsLookupTable, A)
    



            
            
            
            

            
                
            
