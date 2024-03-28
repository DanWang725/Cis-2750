from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes, CipherContext, aead;
from cryptography.hazmat.primitives import padding, hashes;
import os
from Node import Node
from AESCTR import AESCTR
from AESGCM import AESGCM
from NonceCipherContext import NonceDecryptContext, NonceEncryptContext
from cuckoopy import CuckooFilter
from CryptoUtils import AESSIVDecryptNonce, AESSIVEncryptNonce
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.ciphers.aead import AESSIV
from CreateDictionary import GetKeyAtValue



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

# Generate a search index I
def BuildIndex(W,n,K):

    ctr = 1 # Set global counter

    m = 100
    A = [None] * m # Array A creation

    storage = [] # keeping track of each linked list head (address and key)
    ids = [] # keeping track of traversed ids
    
    PsiCipher = AESCTR(keyPsi) # cipher for the PRP we use for ordering the array elements

    for i in range(1, n+1):

        #create linked list
        kHead = os.urandom(keyLength // 8) #initialize the ki,0 and the address of n1,j
        addressGenerator = PsiCipher.encryptor((1).to_bytes(16, "big"))
        addr = addressGenerator.encrypt(ctr.to_bytes(16, "big"))
        storage.append((addr, kHead)) # store these for later use

        keyword = GetKeyAtValue(W, i) # get keyword

        # Traverse ids (vals) of keywords
        # print('at keyword:', keyword)
        for j in range(len(W[keyword])):

            if W[keyword][j] in ids: # check if id already traversed
                # print(W[keyword][j], 'already exists!\n')
                continue
            
            # print('encrypt id:', W[keyword][j], 'from j index', j, '\n')
            kNext = os.urandom(keyLength // 8) # generate key ki,j to decrypt next node
            node = Node(W[keyword][j], kNext, ctr+1) #create node with record id, key, and address in A of node
            ids.append(W[keyword][j])

            # if this is not the last node in list, generate address of next node
            if(j != len(W[keyword]) - 1):
                psuedoRandomPerm = PsiCipher.encryptor((1).to_bytes(16, "big"))
                psiCtr = psuedoRandomPerm.encrypt((ctr + 1).to_bytes(16, "big"))
                node.setNextAddress(psiCtr)
                # print('new address gen!')

            aessiv = aead.AESSIV(kHead) #encrypting each node with non deterministic encryptor
            nonce = os.urandom(16)      #generating a 128-bit nonce
            ct = nonce + aessiv.encrypt(bytes(str(node),'utf-8'), [nonce]) #use AESSIV for undeterministic symmetric encryption
            
            #generate the address for the current node to go
            psuedoRandomPerm = PsiCipher.encryptor((1).to_bytes(16, "big"))
            curAddr = psuedoRandomPerm.encrypt(ctr.to_bytes(16, "big"))
            # print(int.from_bytes(curAddr, 'big') % 1000)
            nodeIndex = int.from_bytes(curAddr, 'big') % 100

            # if(A[nodeIndex] is not None): # debugging, print if we have a collision
            #     print('Debug: Collision found')

            A[nodeIndex] = ct # Store node in A (pseudorandom order)
            # print('store node', W[keyword][j], 'at', nodeIndex)
            # print('A:', A)
            kHead = kNext
            ctr = ctr+1 # increment counter

    # TODO: Fill in remaining entries of A with rando values

    # Look up table T creation
    T = {} # unsecure lookup table ! should use a secure table like cuckoo table
    for i in range(1, n+1):
        (addr, k) = storage[i-1]
        keyword = GetKeyAtValue(W, i)
        # print('encrypt keyword:', keyword)
        digest = hashes.Hash(hashes.SHA256())
        digest.update(bytes(keyword, "utf-8"))
        val = digest.finalize()
        value = get_xor(addr + k, val)
        if keyword in T:
            T[keyword].append(value) # add to value list of keyword
        else:
            T[keyword] = [value] # create new value list for keyword
    
    # print('table:')
    # print(T)
    # print('A:')
    # print(A)
    I = (A, T)
    return I



def EncryptTable(T, K):
    attributes = ['stuff', 'stuff2'] # mock data

    for attribute in attributes:
        encryptedAttribute = AESSIVEncryptNonce(K, attribute)
    
    records = [('value1', 'value2'), ('value3', 'value4')] # mock data
    for i in range(len(records)):
        record = records[i]
        for value in record:
            encryptedValue = AESSIVEncryptNonce(K, value)

def DecryptTable(T, K):
    attributes = ['stuff', 'stuff2'] # mock data

    for attribute in attributes:
        decryptedAttribute = AESSIVDecryptNonce(K, attribute)
    
    records = [('value1', 'value2'), ('value3', 'value4')] # mock data
    for i in range(len(records)):
        record = records[i]
        for value in record:
            decryptedValue = AESSIVDecryptNonce(K, value)
    



# testKey = os.urandom(32)
# testVar = AESSIVEncryptNonce(testKey, 'among us')
# print(testVar.hex())
# result = AESSIVDecryptNonce(testKey, testVar)
# print(result)

