# Exactly Finance Test

## Assumptions 

1) Reward is a ERC20 Token
2) No Lock period for neither ETH nor Reward token withdrawals
3) LP tokens can't be transferable
4) Since we're using solidity 0.8, we don't need safeMath library

You can find the whole flow under test/pool.test.ts

## Contracts deployed and verified on Kovan Testnet

1) ETHPool: [https://kovan.etherscan.io/address/0xa1C164264ca32f77fA7D7a6009730c3E50d6434A#code](https://kovan.etherscan.io/address/0xa1C164264ca32f77fA7D7a6009730c3E50d6434A#code)
2) Reward Token: [https://kovan.etherscan.io/address/0xE8987555Af302aCb458D6f8F2Aa5b8AF9F065E64#code](https://kovan.etherscan.io/address/0xE8987555Af302aCb458D6f8F2Aa5b8AF9F065E64#code)

## Contracts deployed and verified on BSC Testnet

1) ETHPool: [https://testnet.bscscan.com/address/0x86039493CFE98401fD1933814637b9D06FFCAe9a#code](https://testnet.bscscan.com/address/0x86039493CFE98401fD1933814637b9D06FFCAe9a#code)
2) Reward Token: [https://testnet.bscscan.com/address/0xc467bf8adcf7b586384c88fa8ebd3e01d11a7967#code](https://testnet.bscscan.com/address/0xc467bf8adcf7b586384c88fa8ebd3e01d11a7967#code)


## NPM

```javascript
npm install
npm test
npm run deploy:kovan // runs ./scripts/deploy.ts
npm run balance:kovan //runs ./scripts/balance.ts