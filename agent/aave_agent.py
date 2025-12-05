import time
import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# Configuration
RPC_URL = "http://127.0.0.1:8545"
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80")

# Aave V3 Pool Address (Polygon)
AAVE_POOL = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"

w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Chainlink Oracle Address (MATIC/USD)
ORACLE_ADDRESS = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0"
ORACLE_ABI = '[{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"}]'

def get_oracle_price():
    oracle = w3.eth.contract(address=ORACLE_ADDRESS, abi=ORACLE_ABI)
    data = oracle.functions.latestRoundData().call()
    price = data[1] / 10**8
    return price

def check_health_factor(user_address):
    print(f"Checking Health Factor for {user_address}...")
    
    try:
        oracle_price = get_oracle_price()
        print(f"Oracle Price (MATIC/USD): ${oracle_price:.4f}")
    except Exception as e:
        print(f"Failed to fetch Oracle price: {e}")

    # In a real implementation, we call getUserAccountData on Aave Pool
    # For MVP, we simulate a low health factor
    
    health_factor = 1.05 # Dangerously low
    print(f"Health Factor: {health_factor}")
    
    if health_factor < 1.1:
        print("Health Factor Critical! Initiating rescue deposit...")
        # Execute deposit logic here
        return True
    return False

def main():
    if not w3.is_connected():
        print("Failed to connect to Web3")
        return

    target_user = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266" # Hardhat Account 0
    print("Aave Health Monitor Started")
    
    while True:
        try:
            check_health_factor(target_user)
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(15)

if __name__ == "__main__":
    main()
