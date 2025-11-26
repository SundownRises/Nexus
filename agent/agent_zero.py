import json
import time
import os
import random
from web3 import Web3
from eth_account import Account

# Load config
with open("config.json", "r") as f:
    config = json.load(f)

RPC_URL = config["rpcUrl"]
EXECUTION_ADDRESS = config["execution"]
VAULT_ADDRESS = config["vault"]
TOKEN_ADDRESS = config["token"]

# Connect to Web3
w3 = Web3(Web3.HTTPProvider(RPC_URL))
if not w3.is_connected():
    print("Failed to connect to Web3")
    exit(1)

print(f"Connected to {RPC_URL}")

# Agent Account (Hardhat Account #1)
AGENT_PRIVATE_KEY = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"
agent_account = Account.from_key(AGENT_PRIVATE_KEY)
print(f"Agent Address: {agent_account.address}")

# Load Execution ABI
# We assume the ABI is available in the artifacts folder
ARTIFACT_PATH = "../contracts/artifacts/contracts/Execution.sol/Execution.json"
with open(ARTIFACT_PATH, "r") as f:
    execution_artifact = json.load(f)
    execution_abi = execution_artifact["abi"]

execution_contract = w3.eth.contract(address=EXECUTION_ADDRESS, abi=execution_abi)

# Load Token ABI (MockERC20)
TOKEN_ARTIFACT_PATH = "../contracts/artifacts/contracts/MockERC20.sol/MockERC20.json"
with open(TOKEN_ARTIFACT_PATH, "r") as f:
    token_artifact = json.load(f)
    token_abi = token_artifact["abi"]

token_contract = w3.eth.contract(address=TOKEN_ADDRESS, abi=token_abi)

def check_apy():
    # Mock APY check
    # In real world, this would query The Graph or a DEX contract
    apy = random.uniform(10, 20)
    return apy

def execute_strategy():
    print("Executing Strategy...")
    
    # Target: Token Contract (simulate transfer)
    target = TOKEN_ADDRESS
    
    # Data: transfer(random_address, 100 tokens)
    # 100 tokens = 100 * 10^18
    amount = 100 * 10**18
    recipient = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8" # Hardhat Account #2
    
    # Encode function call
    # transfer(address,uint256)
    data = token_contract.encodeABI(fn_name="transfer", args=[recipient, amount])
    
    # Build transaction
    # executeStrategy(address vault, address target, bytes data)
    nonce = w3.eth.get_transaction_count(agent_account.address)
    
    tx = execution_contract.functions.executeStrategy(
        VAULT_ADDRESS,
        target,
        data
    ).build_transaction({
        'chainId': 31337, # Hardhat Local
        'gas': 2000000,
        'gasPrice': w3.to_wei('10', 'gwei'),
        'nonce': nonce,
    })
    
    # Sign and Send
    signed_tx = w3.eth.account.sign_transaction(tx, AGENT_PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_tx.raw_transaction)
    
    print(f"Transaction sent: {tx_hash.hex()}")
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    print(f"Transaction confirmed in block {receipt.blockNumber}")

def main():
    print("Agent Zero started. Monitoring QuickSwap APY...")
    
    while True:
        apy = check_apy()
        print(f"Current APY: {apy:.2f}%")
        
        if apy > 15.0:
            print("APY threshold crossed! Triggering execution.")
            try:
                execute_strategy()
                # Sleep a bit to avoid spamming
                time.sleep(10)
            except Exception as e:
                print(f"Execution failed: {e}")
        
        time.sleep(5)

if __name__ == "__main__":
    main()
