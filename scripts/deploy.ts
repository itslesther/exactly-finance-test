import hre, { ethers, run } from "hardhat";
// eslint-disable-next-line
import { TimeLockNonTransferablePool__factory } from "../typechain-types/factories/TimeLockNonTransferablePool__factory";
// eslint-disable-next-line
import { Token__factory } from "../typechain-types/factories/Token__factory";
// eslint-disable-next-line
import { Token } from "../typechain-types/Token";
// eslint-disable-next-line
import { sleep, toWei } from "../utils";

async function main() {
  const accounts = await hre.ethers.getSigners();
  const team = accounts[0];

  const tokenFactory = (await ethers.getContractFactory(
    "Token"
    // eslint-disable-next-line camelcase
  )) as Token__factory;

  const totalSupply = toWei("1000000");

  const token = (await tokenFactory
    .connect(team)
    .deploy("Reward Token", "RWRD", totalSupply)) as Token;

  await token.deployed();
  console.log("Reward Token deployed:", token.address);

  const poolFactory = (await ethers.getContractFactory(
    "TimeLockNonTransferablePool"
    // eslint-disable-next-line camelcase
  )) as TimeLockNonTransferablePool__factory;

  const ethPool = await poolFactory
    .connect(await ethers.getSigner(team.address))
    .deploy("LP ETH", "LPETH", token.address);

  await ethPool.deployed();
  console.log("ETH Pool deployed:", ethPool.address);

  await token
    .connect(team)
    .approve(ethPool.address, ethers.constants.MaxUint256);
  console.log("Team approved transfers to ETH Pool");

  console.log(`Pausing 3-4 blocks in order to verify Contract`);
  await sleep({ seconds: 15 * 5 });
  console.log(`Pause finished. Verifying Contract`);

  try {
    await run("verify:verify", {
      address: token.address,
      constructorArguments: ["Reward Token", "RWRD", totalSupply],
    });
    console.log("Token deployed and verified to:");
  } catch (err) {
    console.error("Error veryfing Contract. Reason:", err);
  }

  console.log(`Pausing 3-4 blocks in order to verify Contract`);
  await sleep({ seconds: 15 * 5 });
  console.log(`Pause finished. Verifying Contract`);

  try {
    await run("verify:verify", {
      address: ethPool.address,
      constructorArguments: ["LP ETH", "LPETH", token.address],
    });
    console.log("Token deployed and verified to:");
  } catch (err) {
    console.error("Error veryfing Contract. Reason:", err);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
