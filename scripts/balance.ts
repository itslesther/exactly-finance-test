import BigNumber from "bignumber.js";
import { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import { toEther } from "../utils";

async function main() {
  const address = "0xa1C164264ca32f77fA7D7a6009730c3E50d6434A"; // KOVAN
  // const address = "0x86039493CFE98401fD1933814637b9D06FFCAe9a"; // BSC TESTNET
  const balance = await ethers.provider.getBalance(address);

  console.log(
    "Contract Balance:",
    toEther(new BigNumber(balance.toHexString()).toFixed()),
    "ETH"
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
