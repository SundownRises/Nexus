import time
import os
from web3 import Web3
from dotenv import load_dotenv

load_dotenv()

# Configuration
RPC_URL = "http://127.0.0.1:8545"
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") # Hardhat Account 0

# Mock Addresses (Replace with real ones on Mainnet Fork)
QUICKSWAP_ROUTER = "0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff"
SUSHISWAP_ROUTER = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506"
USDC_ADDRESS = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"
WETH_ADDRESS = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619"

w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Chainlink Oracle Address (MATIC/USD)
ORACLE_ADDRESS = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0"
ORACLE_ABI = '[{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"}]'

def get_oracle_price():
    oracle = w3.eth.contract(address=ORACLE_ADDRESS, abi=ORACLE_ABI)
    data = oracle.functions.latestRoundData().call()
    price = data[1] / 10**8 # Chainlink uses 8 decimals for USD pairs
    return price

def check_arbitrage():
    print("Scanning for arbitrage opportunities...")
    
    try:
        oracle_price = get_oracle_price()
        print(f"Oracle Price (MATIC/USD): ${oracle_price:.4f}")
    except Exception as e:
        print(f"Failed to fetch Oracle price: {e}")
        oracle_price = 1.00 # Fallback

    # In a real implementation, we would call getAmountsOut on both routers
    # For MVP, we simulate a discrepancy
    
    quick_price = oracle_price * 1.00
    sushi_price = oracle_price * 1.02 # 2% difference
    
    spread = (sushi_price - quick_price) / quick_price * 100
    print(f"Spread: {spread:.2f}%")
    
    if spread > 1.0:
        print("Arbitrage opportunity found! Executing...")
        # Execute trade logic here
        return True
    return False

def main():
    if not w3.is_connected():
        print("Failed to connect to Web3")
        return

    print("Arbitrage Agent Started")
    while True:
        try:
            check_arbitrage()
        except Exception as e:
            print(f"Error: {e}")
        time.sleep(10)

if __name__ == "__main__":
    main()
