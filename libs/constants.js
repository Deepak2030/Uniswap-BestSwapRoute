const { SupportedChainId, Token } = require('@uniswap/sdk-core');

export const POOL_FACTORY_CONTRACT_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';

export const QUOTER_CONTRACT_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6';

export const WETH_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
  18,
  'USDC',
  'UDS Coin'
);

export const USDC_TOKEN = new Token(
  SupportedChainId.MAINNET,
  '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
  18,
  'USDT',
  'Tether'
);
