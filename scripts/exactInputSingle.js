// Import libraries
const { ethers, BigNumber } = require("hardhat");
const { Pool, Route, Trade, Token, CurrencyAmount, TradeType, Percent } = require("@uniswap/sdk-core");
const { abi: IUniswapV3RouterABI } = require("../ABI/RouterContractABI.json");
const { abi: IUniswapV3PoolABI } = require("../ABI/UniswapV3Factory.json");
const { abi: IERC20ABI } = require("../ABI/ERC20ABI.json"); 

require("dotenv").config();

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const WALLET_SECRET = process.env.WALLET_SECRET;
const USDC_ADDRESS = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"; 
const USDT_ADDRESS = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F"; 
const UNISWAP_V3_ROUTER_ADDRESS = "0xE592427A0AEce92De3EdEE1F18e0157C05861564"; 

const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(WALLET_SECRET, provider);

const usdc = new Token(137, USDC_ADDRESS, 6, 'USDC', 'USD Coin');
const usdt = new Token(137, USDT_ADDRESS, 6, 'USDT', 'Tether USD');

async function swapUSDCtoUSDT() {
    const router = new ethers.Contract(UNISWAP_V3_ROUTER_ADDRESS, IUniswapV3RouterABI, wallet);

    // Set the amount to swap
    const amountIn = 100; 

    // Get the pool address for USDC/USDT, assuming fee tier is 0.3%
    const poolAddress = await router.factory().getPool(USDC_ADDRESS, USDT_ADDRESS, 3000);
    const poolContract = new ethers.Contract(poolAddress, IUniswapV3PoolABI, provider);

    // Fetch the current state of the pool
    const poolState = await poolContract.slot0();

    // Define slippage tolerance and deadline
    const slippageTolerance = new Percent('50', '10000'); // 0.5% slippage tolerance
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time

    // Approve the router to spend USDC
    const usdcContract = new ethers.Contract(USDC_ADDRESS, IUniswapV3RouterABI, wallet);
    await usdcContract.approve(UNISWAP_V3_ROUTER_ADDRESS, amountIn);

    // Perform the swap
    const tx = await router.exactInputSingle({
        tokenIn: USDC_ADDRESS,
        tokenOut: USDT_ADDRESS,
        fee: 3000,
        recipient: WALLET_ADDRESS,
        deadline: deadline,
        amountIn: amountIn,
        amountOutMinimum: 0, 
        sqrtPriceLimitX96: 0
    });

    console.log(`Transaction hash: ${tx.hash}`);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

swapUSDCtoUSDT().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
