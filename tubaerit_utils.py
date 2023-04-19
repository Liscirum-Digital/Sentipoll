import random

def generateToken(length):
    alphabet = "abcdefghijklmnopqrstuvwxyz1234567890"
    token = ""
    for i in range(length):
        token+=alphabet[random.randrange(0,36)]
    return token