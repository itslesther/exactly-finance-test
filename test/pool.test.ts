import { expect } from "chai";
import hre, { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import TimeTraveler from "../TimeTraveler";
import BigNumber from "bignumber.js";
import moment from "moment";
// eslint-disable-next-line node/no-missing-import
import { Token } from "../typechain-types/Token";
// eslint-disable-next-line node/no-missing-import
import { TimeLockNonTransferablePool } from "../typechain-types/TimeLockNonTransferablePool";
// eslint-disable-next-line
import { TimeLockNonTransferablePool__factory } from "../typechain-types/factories/TimeLockNonTransferablePool__factory";
// eslint-disable-next-line
import { Token__factory } from "../typechain-types/factories/Token__factory";



const timeTraveler = new TimeTraveler(hre.network.provider);

describe("ETHPool", function () {
  let token: Token;
  let team: string;
  let userA: string;
  let userB: string;
  let escrowPool: TimeLockNonTransferablePool;
  let ethPool: TimeLockNonTransferablePool;

  it("Should deploy Token", async function () {
    // eslint-disable-next-line camelcase
    const TokenFactory = (await ethers.getContractFactory(
      "Token"
    // eslint-disable-next-line camelcase
    )) as Token__factory;
    token = (await TokenFactory.deploy("Reward Token", "RWRD")) as Token;

    await token.deployed();
    console.log("Reward Token deployed:", token.address);

    const accounts = await hre.ethers.getSigners();

    team = accounts[0].address;
    userA = accounts[1].address;
    userB = accounts[2].address;
  });

  it("Should deploy Escrow Pool", async function () {
    const PoolFactory = (await ethers.getContractFactory(
      "TimeLockNonTransferablePool"
      // eslint-disable-next-line camelcase
    )) as TimeLockNonTransferablePool__factory;

    escrowPool = await PoolFactory.deploy(
      "EscrowPool",
      "ESCRW",
      token.address,
      token.address,
      ethers.constants.AddressZero,
      0,
      0,
      0,
      MAX_LOCK_DURATION
    );

    await token.deployed();
    console.log("Escrow Pool deployed:", escrowPool.address);
  });

  it("Should deploy ETH Pool", async function () {
    const PoolFactory = (await ethers.getContractFactory(
      "TimeLockNonTransferablePool"
      // eslint-disable-next-line camelcase
    )) as TimeLockNonTransferablePool__factory;

    ethPool = await PoolFactory.deploy(
      "LP ETH",
      "LPETH",
      token.address,
      token.address,
      escrowPool.address,
      0,
      0,
      0,
      MAX_LOCK_DURATION
    );

    await token.deployed();
    console.log("ETH Pool deployed:", ethPool.address);
  });
});
