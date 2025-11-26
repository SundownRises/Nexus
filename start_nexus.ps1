# Start Hardhat Node
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd contracts; npx hardhat node"

# Wait for node to start
Start-Sleep -Seconds 5

# Deploy Contracts
cd contracts
npx hardhat run scripts/deploy.ts --network localhost
cd ..

# Generate Constants
node generate_constants.js

# Start Agent
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd agent; python agent_zero.py"

# Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "npm run dev"

Write-Host "Nexus System Started!"
Write-Host "1. Hardhat Node running in new window"
Write-Host "2. Agent running in new window"
Write-Host "3. Frontend running in new window (check port, likely 3000 or 3001)"
