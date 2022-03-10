import { expect } from "chai";
import hre, { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import TimeTraveler from "../TimeTraveler";
// import BigNumber from "bignumber.js";
// import moment from "moment";
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
  // let escrowPool: TimeLockNonTransferablePool;
  let ethPool: TimeLockNonTransferablePool;

  it("Should deploy Token", async function () {
    // eslint-disable-next-line camelcase
    const TokenFactory = (await ethers.getContractFactory(
      "Token"
      // eslint-disable-next-line camelcase
    )) as Token__factory;
    token = (await TokenFactory.deploy("Reward Token", "RWRD", {
      from: team,
    })) as Token;

    await token.deployed();
    console.log("Reward Token deployed:", token.address);

    const accounts = await hre.ethers.getSigners();

    team = accounts[0].address;
    userA = accounts[1].address;
    userB = accounts[2].address;
  });

  // it("Should deploy Escrow Pool", async function () {
  //   const PoolFactory = (await ethers.getContractFactory(
  //     "TimeLockNonTransferablePool"
  //     // eslint-disable-next-line camelcase
  //   )) as TimeLockNonTransferablePool__factory;

  //   escrowPool = await PoolFactory.deploy(
  //     "EscrowPool",
  //     "ESCRW",
  //     token.address,
  //     {
  //       from: team,
  //     }
  //   );

  //   await token.deployed();
  //   console.log("Escrow Pool deployed:", escrowPool.address);
  // });

  it("Should deploy ETH Pool", async function () {
    const PoolFactory = (await ethers.getContractFactory(
      "TimeLockNonTransferablePool"
      // eslint-disable-next-line camelcase
    )) as TimeLockNonTransferablePool__factory;

    ethPool = await PoolFactory.deploy("LP ETH", "LPETH", token.address, {
      from: team,
    });

    await token.deployed();
    console.log("ETH Pool deployed:", ethPool.address);
  });

  it("Should approve transfer from team wallet to ETH Pool", async function () {
    await token.approve(ethPool.address, ethers.constants.MaxUint256, {
      from: team,
    });

    const allowance = await token.allowance(team, ethPool.address);

    expect(allowance.eq(ethers.constants.MaxUint256)).to.be.equal(true);
  });

  it("Should approve transfer from User A to ETH Pool", async function () {
    await token.approve(ethPool.address, ethers.constants.MaxUint256, {
      from: userA,
    });

    const allowance = await token.allowance(team, ethPool.address);

    expect(allowance.eq(ethers.constants.MaxUint256)).to.be.equal(true);
  });

  it("Should approve transfer from User B to ETH Pool", async function () {
    await token.approve(ethPool.address, ethers.constants.MaxUint256, {
      from: userB,
    });

    const allowance = await token.allowance(team, ethPool.address);

    expect(allowance.eq(ethers.constants.MaxUint256)).equals(true);
  });

  describe("Case 1: User A and User B deposit ETH, then Team deposits Reward, then User A and User B withdraw all their deposits and rewards", function () {
    it("Should deposit 0 ETH from User A to ETH Pool", async function () {
      await ethPool.deposit({ from: userA, value: 0 });

      const depositsOfUserA = await ethPool.getDepositOf(userA);

      expect(depositsOfUserA).to.be.equal(0);
    });

    it("Should deposit 0 ETH from User B to ETH Pool", async function () {
      await ethPool.deposit({ from: userB, value: 0 });

      const depositsOfUserB = await ethPool.getDepositOf(userB);

      expect(depositsOfUserB).to.be.equal(0);
    });

    it("Should deposit reward from Team to ETH pool", async function () {
      await ethPool.distributeRewards(0, { from: team });

      const poolBalance = await ethers.provider.getBalance(ethPool.address);

      expect(poolBalance.eq(0)).equals(true);
    });

    it("Should withdraw ETH from ETH Pool to User A", async function () {
      await ethPool.withdraw({ from: userA });

      const depositOf = await ethPool.getDepositOf(userA);

      expect(depositOf).to.be.equal(0);
    });

    it("Should withdraw ETH from ETH Pool to User B", async function () {
      await ethPool.withdraw({ from: userB });
      const depositOf = await ethPool.getDepositOf(userB);

      expect(depositOf).to.be.equal(0);
    });

    it("Should withdraw Reward from ETH Pool to User A", async function () {
      await ethPool.claimRewards({ from: userA });
    });

    it("Should withdraw Reward from ETH Pool to User B", async function () {
      await ethPool.claimRewards({ from: userB });
    });
  });

  describe("Case 2: User A deposit ETH, then Team deposits Reward, then User B deposit ETH, then User A and User B withdraw all their deposits and rewards", function () {
    it("Should deposit 0 ETH from User A to ETH Pool", async function () {
      await timeTraveler.increaseTime(7 * 24 * 3600); // + 1 WEEK

      await ethPool.deposit({ from: userA, value: 0 });

      const depositOf = await ethPool.getDepositOf(userA);

      expect(depositOf).to.be.greaterThan(0);
    });

    it("Should deposit 0 ETH from User B to ETH Pool", async function () {
      await ethPool.deposit({ from: userB, value: 0 });

      const depositOf = await ethPool.getDepositOf(userB);

      expect(depositOf).length.greaterThan(0);
    });

    it("Should deposit reward from Team to ETH pool", async function () {
      await ethPool.distributeRewards(0, { from: team });

      const poolBalance = await ethers.provider.getBalance(ethPool.address);

      expect(poolBalance.eq(0)).equals(true);
    });

    it("Should withdraw ETH from ETH Pool to User A", async function () {
      await ethPool.withdraw({ from: userA });

      const depositOf = await ethPool.getDepositOf(userA);

      expect(depositOf).to.be.equal(0);
    });

    it("Should withdraw ETH from ETH Pool to User B", async function () {
      await ethPool.withdraw({ from: userB });
      const depositOf = await ethPool.getDepositOf(userB);

      expect(depositOf).to.be.equal(0);
    });

    it("Should withdraw Reward from ETH Pool to User A", async function () {
      await ethPool.claimRewards({ from: userA });
    });

    it("Should withdraw Reward from ETH Pool to User B", async function () {
      await ethPool.claimRewards({ from: userB });
    });
  });
});
