const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'agent/config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const executionArtifactPath = path.join(__dirname, 'contracts/artifacts/contracts/Execution.sol/Execution.json');
const executionArtifact = JSON.parse(fs.readFileSync(executionArtifactPath, 'utf8'));

const vaultArtifactPath = path.join(__dirname, 'contracts/artifacts/contracts/Vault.sol/Vault.json');
const vaultArtifact = JSON.parse(fs.readFileSync(vaultArtifactPath, 'utf8'));

const tokenArtifactPath = path.join(__dirname, 'contracts/artifacts/contracts/MockERC20.sol/MockERC20.json');
const tokenArtifact = JSON.parse(fs.readFileSync(tokenArtifactPath, 'utf8'));

const priceConsumerArtifactPath = path.join(__dirname, 'contracts/artifacts/contracts/PriceConsumer.sol/PriceConsumer.json');
const priceConsumerArtifact = JSON.parse(fs.readFileSync(priceConsumerArtifactPath, 'utf8'));

const constantsContent = `
export const ADDRESSES = {
  AGENT_REGISTRY: "${config.agentRegistry}",
  EXECUTION: "${config.execution}",
  VAULT: "${config.vault}",
  TOKEN: "${config.token}",
  PRICE_CONSUMER: "${config.priceConsumer}",
  RPC_URL: "${config.rpcUrl}"
};

export const ABIS = {
  EXECUTION: ${JSON.stringify(executionArtifact.abi)},
  VAULT: ${JSON.stringify(vaultArtifact.abi)},
  TOKEN: ${JSON.stringify(tokenArtifact.abi)},
  PRICE_CONSUMER: ${JSON.stringify(priceConsumerArtifact.abi)}
};
`;

fs.writeFileSync(path.join(__dirname, 'app/constants.ts'), constantsContent);
console.log('app/constants.ts generated');
