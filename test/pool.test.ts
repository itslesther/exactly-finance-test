import { expect } from "chai";
import hre, { ethers } from "hardhat";
// eslint-disable-next-line node/no-missing-import
import TimeTraveler from "../TimeTraveler";
import BigNumber from "bignumber.js";
// import moment from "moment";
// eslint-disable-next-line node/no-missing-import
import { Token } from "../typechain-types/Token";
// eslint-disable-next-line node/no-missing-import
import { TimeLockNonTransferablePool } from "../typechain-types/TimeLockNonTransferablePool";
// eslint-disable-next-line
import { TimeLockNonTransferablePool__factory } from "../typechain-types/factories/TimeLockNonTransferablePool__factory";
// eslint-disable-next-line
import { Token__factory } from "../typechain-types/factories/Token__factory";
// eslint-disable-next-line
import { toWei } from "../utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
const timeTraveler = new TimeTraveler(hre.network.provider);

describe("ETHPool", function () {
  let token: Token;
  let team: SignerWithAddress;
  let userA: SignerWithAddress;
  let userB: SignerWithAddress;
  // let escrowPool: TimeLockNonTransferablePool;
  let ethPool: TimeLockNonTransferablePool;

  it("Should deploy Token", async function () {
    const accounts = await hre.ethers.getSigners();
    // for (const account of accounts) {
    //   console.log(account.address);
    // }

    team = accounts[0];
    userA = accounts[1];
    userB = accounts[2];

    // eslint-disable-next-line camelcase
    const tokenFactory = (await ethers.getContractFactory(
      "Token"
      // eslint-disable-next-line camelcase
    )) as Token__factory;

    const totalSupply = toWei("1000000");

    token = (await tokenFactory
      .connect(team)
      .deploy("Reward Token", "RWRD", totalSupply)) as Token;

    await token.deployed();
    // console.log("Reward Token deployed:", token.address);

    const teamBalance = await token.balanceOf(team.address);
    expect(new BigNumber(teamBalance.toHexString()).toFixed()).to.be.equal(
      totalSupply
    );
  });

  it("Should deploy ETH Pool", async function () {
    const poolFactory = (await ethers.getContractFactory(
      "TimeLockNonTransferablePool"
      // eslint-disable-next-line camelcase
    )) as TimeLockNonTransferablePool__factory;

    ethPool = await poolFactory
      .connect(await ethers.getSigner(team.address))
      .deploy("LP ETH", "LPETH", token.address);

    await ethPool.deployed();
    // console.log("ETH Pool deployed:", ethPool.address);
  });

  it("Should approve transfer from team wallet to ETH Pool", async function () {
    await token
      .connect(team)
      .approve(ethPool.address, ethers.constants.MaxUint256);

    const allowance = await token.allowance(team.address, ethPool.address);
    expect(new BigNumber(allowance.toHexString()).toFixed()).to.be.equal(
      new BigNumber(ethers.constants.MaxUint256.toHexString()).toFixed()
    );
  });

  it("Should approve transfer from User A to ETH Pool", async function () {
    await token
      .connect(userA)
      .approve(ethPool.address, ethers.constants.MaxUint256);

    const allowance = await token.allowance(userA.address, ethPool.address);
    expect(new BigNumber(allowance.toHexString()).toFixed()).to.be.equal(
      new BigNumber(ethers.constants.MaxUint256.toHexString()).toFixed()
    );
  });

  it("Should approve transfer from User B to ETH Pool", async function () {
    await token
      .connect(userB)
      .approve(ethPool.address, ethers.constants.MaxUint256);

    const allowance = await token.allowance(userB.address, ethPool.address);
    expect(new BigNumber(allowance.toHexString()).toFixed()).to.be.equal(
      new BigNumber(ethers.constants.MaxUint256.toHexString()).toFixed()
    );
  });

  describe("Case 1: User A deposits ETH and User B deposits ETH, then Team deposits Reward, then User A and User B withdraw all their deposits and rewards", function () {
    it("Should deposit 100 ETH from User A to ETH Pool", async function () {
      const prevEthBalance = await ethers.provider.getBalance(ethPool.address);

      const amount = toWei("100");

      await ethPool.connect(userA).deposit({ value: amount });

      const depositsOfUserA = await ethPool.getDepositOf(userA.address);
      const currentEthBalance = await ethers.provider.getBalance(
        ethPool.address
      );

      expect(depositsOfUserA).to.be.equal(amount);
      expect(
        new BigNumber(prevEthBalance.toHexString()).plus(amount).toFixed()
      ).to.be.equal(new BigNumber(currentEthBalance.toHexString()).toFixed());
    });

    it("Should deposit 300 ETH from User B to ETH Pool", async function () {
      const prevEthBalance = await ethers.provider.getBalance(ethPool.address);

      const amount = toWei("300");

      await ethPool.connect(userB).deposit({ value: amount });

      const depositsOfUserB = await ethPool.getDepositOf(userB.address);
      const currentEthBalance = await ethers.provider.getBalance(
        ethPool.address
      );

      expect(depositsOfUserB).to.be.equal(amount);
      expect(
        new BigNumber(prevEthBalance.toHexString()).plus(amount).toFixed()
      ).to.be.equal(new BigNumber(currentEthBalance.toHexString()).toFixed());
    });

    it("Should deposit 600 reward from Team to ETH pool", async function () {
      const amount = toWei("600");

      await ethPool.connect(team).distributeRewards(amount);

      const poolBalance = await token.balanceOf(ethPool.address);
      expect(new BigNumber(poolBalance.toHexString()).toFixed()).equals(amount);
    });

    it("Should withdraw all 100 ETH from ETH Pool to User A", async function () {
      const prevEthBalance = await ethers.provider.getBalance(ethPool.address);

      await ethPool.connect(userA).withdraw();

      const depositOf = await ethPool.getDepositOf(userA.address);
      const currentEthBalance = await ethers.provider.getBalance(
        ethPool.address
      );

      expect(depositOf).to.be.equal(0);
      expect(
        new BigNumber(prevEthBalance.toHexString())
          .minus(toWei("100"))
          .toFixed()
      ).to.be.equal(new BigNumber(currentEthBalance.toHexString()).toFixed());
    });

    it("Should withdraw all 300 ETH from ETH Pool to User B", async function () {
      const prevEthBalance = await ethers.provider.getBalance(ethPool.address);

      await ethPool.connect(userB).withdraw();

      const depositOf = await ethPool.getDepositOf(userB.address);
      const currentEthBalance = await ethers.provider.getBalance(
        ethPool.address
      );

      expect(depositOf).to.be.equal(0);
      expect(
        new BigNumber(prevEthBalance.toHexString())
          .minus(toWei("300"))
          .toFixed()
      ).to.be.equal(new BigNumber(currentEthBalance.toHexString()).toFixed());
    });

    it("Should withdraw 150 Reward (25%) from ETH Pool to User A", async function () {
      const amount = toWei("150");

      const prevReward = await ethPool.withdrawableRewardsOf(userA.address);
      const prevTokenBalance = await token.balanceOf(userA.address);

      expect(new BigNumber(prevReward.toHexString()).toNumber()).to.be.closeTo(
        +amount,
        1
      );

      await ethPool.connect(userA).claimRewards();

      const currentReward = await ethPool.withdrawableRewardsOf(userA.address);
      const currentTokenBalance = await token.balanceOf(userA.address);

      expect(new BigNumber(currentReward.toHexString()).toFixed()).to.be.equal(
        "0"
      );
      expect(
        new BigNumber(prevTokenBalance.toHexString()).plus(amount).toNumber()
      ).to.be.closeTo(
        new BigNumber(currentTokenBalance.toHexString()).toNumber(),
        1 // dust
      );
    });

    it("Should withdraw 450 Reward (75%) from ETH Pool to User B", async function () {
      const amount = toWei("450");

      const prevReward = await ethPool.withdrawableRewardsOf(userB.address);
      const prevTokenBalance = await token.balanceOf(userB.address);

      expect(new BigNumber(prevReward.toHexString()).toNumber()).to.be.closeTo(
        +amount,
        1
      );

      await ethPool.connect(userB).claimRewards();

      const currentReward = await ethPool.withdrawableRewardsOf(userB.address);
      const currentTokenBalance = await token.balanceOf(userB.address);

      expect(currentReward.eq("0")).equal(true);
      expect(
        new BigNumber(prevTokenBalance.toHexString()).plus(amount).toNumber()
      ).to.be.closeTo(
        new BigNumber(currentTokenBalance.toHexString()).toNumber(),
        1 // dust
      );
    });
  });

  describe("Case 2: User A deposit ETH, then Team deposits Reward, then User B deposit ETH, then User A and User B withdraw all their deposits and rewards", function () {
    it("Should deposit 100 ETH from User A to ETH Pool", async function () {
      await timeTraveler.increaseTime(7 * 24 * 3600); // + 1 WEEK

      const prevEthBalance = await ethers.provider.getBalance(ethPool.address);

      const amount = toWei("100");

      await ethPool.connect(userA).deposit({ value: amount });

      const depositsOfUserA = await ethPool.getDepositOf(userA.address);
      const currentEthBalance = await ethers.provider.getBalance(
        ethPool.address
      );
      expect(depositsOfUserA).to.be.equal(amount);
      expect(
        new BigNumber(prevEthBalance.toHexString()).plus(amount).toFixed()
      ).to.be.equal(new BigNumber(currentEthBalance.toHexString()).toFixed());
    });

    it("Should deposit 600 reward from Team to ETH pool", async function () {
      const amount = toWei("600");

      await ethPool.connect(team).distributeRewards(amount);

      const poolBalance = await token.balanceOf(ethPool.address);
      expect(new BigNumber(poolBalance.toHexString()).toNumber()).to.be.closeTo(
        +amount,
        1
      );
    });

    it("Should deposit 300 ETH from User B to ETH Pool", async function () {
      const prevEthBalance = await ethers.provider.getBalance(ethPool.address);

      const amount = toWei("300");

      await ethPool.connect(userB).deposit({ value: amount });

      const depositsOfUserB = await ethPool.getDepositOf(userB.address);
      const currentEthBalance = await ethers.provider.getBalance(
        ethPool.address
      );

      expect(depositsOfUserB).to.be.equal(amount);
      expect(
        new BigNumber(prevEthBalance.toHexString()).plus(amount).toFixed()
      ).to.be.equal(new BigNumber(currentEthBalance.toHexString()).toFixed());
    });

    it("Should withdraw all 100 ETH from ETH Pool to User A", async function () {
      const prevEthBalance = await ethers.provider.getBalance(ethPool.address);

      await ethPool.connect(userA).withdraw();
      const currentEthBalance = await ethers.provider.getBalance(
        ethPool.address
      );

      const depositOf = await ethPool.getDepositOf(userA.address);
      expect(depositOf).to.be.equal(0);
      expect(
        new BigNumber(prevEthBalance.toHexString())
          .minus(toWei("100"))
          .toFixed()
      ).to.be.equal(new BigNumber(currentEthBalance.toHexString()).toFixed());
    });

    it("Should withdraw all 300 ETH from ETH Pool to User B", async function () {
      const prevEthBalance = await ethers.provider.getBalance(ethPool.address);

      await ethPool.connect(userB).withdraw();

      const depositOf = await ethPool.getDepositOf(userB.address);
      const currentEthBalance = await ethers.provider.getBalance(
        ethPool.address
      );
      expect(depositOf).to.be.equal(0);
      expect(
        new BigNumber(prevEthBalance.toHexString())
          .minus(toWei("300"))
          .toFixed()
      ).to.be.equal(new BigNumber(currentEthBalance.toHexString()).toFixed());
    });

    it("Should withdraw 600 Reward (100%) from ETH Pool to User A", async function () {
      const amount = toWei("600");

      const prevReward = await ethPool.withdrawableRewardsOf(userA.address);
      const prevTokenBalance = await token.balanceOf(userA.address);

      expect(new BigNumber(prevReward.toHexString()).toFixed()).to.be.equal(
        amount
      );

      await ethPool.connect(userA).claimRewards();

      const currentReward = await ethPool.withdrawableRewardsOf(userA.address);
      const currentTokenBalance = await token.balanceOf(userA.address);

      expect(new BigNumber(currentReward.toHexString()).toFixed()).to.be.equal(
        "0"
      );
      expect(
        new BigNumber(prevTokenBalance.toHexString()).plus(amount).toNumber()
      ).to.be.closeTo(
        new BigNumber(currentTokenBalance.toHexString()).toNumber(),
        1 // dust
      );
    });

    it("Should have 0 Reward (0%) to withdraw from ETH Pool to User B", async function () {
      const prevReward = await ethPool.withdrawableRewardsOf(userA.address);

      expect(new BigNumber(prevReward.toHexString()).toFixed()).to.be.equal(
        "0"
      );
    });
  });
});
