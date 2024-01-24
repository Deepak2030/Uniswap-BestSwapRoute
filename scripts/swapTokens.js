// Import necessary libraries
const { ethers } = require("hardhat");
const {
  Token,
  CurrencyAmount,
  TradeType,
  Percent,
} = require("@uniswap/sdk-core");
const { AlphaRouter, SwapType } = require("@uniswap/smart-order-router");
const JSBI = require("jsbi");
require("dotenv").config();

// Load environment variables
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const WALLET_SECRET = process.env.WALLET_SECRET;

// Define the network and contract details
const chainId = 137; // Polygon Mainnet

// Define provider and wallet
const provider = new ethers.providers.JsonRpcProvider(RPC_URL, chainId);
const wallet = new ethers.Wallet(WALLET_SECRET, provider);
const router = new AlphaRouter({ chainId: chainId, provider: provider });

async function main() {
  // Define the tokens involved in the swap
  const USDC = new Token(
    chainId,
    "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    6,
    "USDC",
    "USD Coin"
  );
  const USDT = new Token(
    chainId,
    "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
    6,
    "USDT",
    "Tether USD"
  );

  // Define the amount you want to swap (in USDC)
  const amountIn = "10"; // 10 USDC
  const wei = ethers.utils.parseUnits(amountIn, USDC.decimals);
  const inputAmount = CurrencyAmount.fromRawAmount(USDC, JSBI.BigInt(wei));

  // Fetch and prepare the best trade
  const route = await router.route(inputAmount, USDT, TradeType.EXACT_INPUT, {
    type: SwapType.SWAP_ROUTER_02,
    recipient: WALLET_ADDRESS,
    slippageTolerance: new Percent(50, 10_000),
    deadline: Math.floor(Date.now() / 1000) + 1800,
  });

  if (!route || !route.methodParameters) {
    throw new Error("No route found");
  }

  const gasPrice = await provider.getGasPrice();
  const adjustedGasPrice = gasPrice.mul(2);

  // Execute the swap transaction
  const tx = await wallet.sendTransaction({
    to: route.methodParameters.to,
    data: route.methodParameters.calldata,
    value: route.methodParameters.value,
    gasPrice: adjustedGasPrice,
    gasLimit: ethers.utils.hexlify(30000000),
  });

  const receipt = await tx.wait();
  console.log(`Transaction hash: ${receipt.transactionHash}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
