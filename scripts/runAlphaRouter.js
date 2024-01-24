import { AlphaRouter } from "@uniswap/smart-order-router";
import { Token, CurrencyAmount, TradeType, Percent } from "@uniswap/sdk-core";
import { ethers, BigNumber } from "ethers";
import { SwapOptionsSwapRouter02, SwapType } from "@uniswap/smart-order-router";
import JSBI from "jsbi";
import dotenv from "dotenv";
dotenv.config();

const V3_SWAP_ROUTER_ADDRESS = "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45";
const ERC20_abi = require("./ERC20_abi.json");

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const RPC_URL = process.env.RPC_URL;
const WALLET_SECRET = process.env.WALLET_SECRET;
const chainId = 137;

const web3Provider = new ethers.providers.JsonRpcProvider(RPC_URL, chainId);
const signer = new ethers.Wallet(WALLET_SECRET, provider);

const router = new AlphaRouter({ chainId: chainId, provider: web3Provider });
const wallet = new ethers.Wallet(privateKey, provider);

const tokenInName = "UDS Coin";
const tokenInSymbol = "USDC";
const tokenInDecimals = 18;
const tokenInAddress = "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359";

const MAX_FEE_PER_GAS = ;
const MAX_PRIORITY_FEE_PER_GAS = 800000;

const tokenOutName = "Tether";
const tokenOutSymbol = "USDT";
const tokenOutDecimals = 18;
const tokenOutAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

const tokenIn = new Token(
  chainId,
  tokenInAddress,
  tokenInDecimals,
  tokenInSymbol,
  tokenInName
);

const tokenOut = new Token(
  chainId,
  tokenOutAddress,
  tokenOutDecimals,
  tokenOutSymbol,
  tokenOutName
);

const wei = ethers.utils.parseUnits("10", tokenInDecimals);
const inputAmount = CurrencyAmount.fromRawAmount(tokenInName, JSBI.BigInt(wei));
// check if JSBI.BigInt(wei) works else: amountIn.toString()

async function main() {
  // const route = await router.route(inputAmount, UNI, TradeType.EXACT_INPUT, {
  //   recipient: WALLET_ADDRESS,
  //   slippageTolerance: new Percent(25, 100),
  //   deadline: Math.floor(Date.now() / 1000 + 1800),
  // });

  const contractIn = new ethers.Contract(
    tokenInContractAddress,
    ERC20_abi,
    signer
  );
  
  const contractOut = new ethers.Contract(
    tokenOutContractAddress,
    ERC20_abi,
    signer
  );

  const SwapOptionsSwapRouter02 = {
    recipient: WALLET_ADDRESS,
    slippageTolerance: new Percent(20, 10_000),
    deadline: Math.floor(Date.now() / 1000 + 1800),
    type: SwapType.SWAP_ROUTER_02,
  };

  const rawTokenAmountIn = fromReadableAmount(
    CurrentConfig.currencies.amountIn,
    CurrentConfig.currencies.in.decimals
  );

  const router = new AlphaRouter({
    chainId: tokenIn.chainId,
    provider: provider,
  });

  const route = await router.route(
    inputAmount,
    // CurrencyAmount.fromRawAmount(tokenInName, rawTokenAmountIn),
    tokenOut,
    TradeType.EXACT_INPUT
  );

  if (route == null || route.methodParameters === undefined) {
    throw "No route loaded";
  }

  const tokenContract = new ethers.Contract(tokenInAddress, ERC20ABI, wallet);

  const tokenApproval = await tokenContract.approve(
    V3_SWAP_ROUTER_ADDRESS,
    ethers.BigNumber.from(rawTokenAmountIn.toString())
  );

  if (approveReceipt.status === 0){
    throw new Error("Approve transaction failed");
  }

  const txRes = await wallet.sendTransaction({
    data: route.methodParameters.calldata,
    to: V3_SWAP_ROUTER_ADDRESS,
    value: route.methodParameters.value,
    from: WALLET_ADDRESS,
    maxFeePerGas: MAX_FEE_PER_GAS,
    maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  });

  const approveReceipt = await txRes.wait();

  console.log(`Quote Exact In: ${route.quote.toFixed(10)}`);
}

main();
