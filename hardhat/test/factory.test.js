const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BountyFactory test", function () {
    let factory;
    let Bounty;

    before(async function () {
        const BountyFactory = await ethers.getContractFactory("BountyFactory");
        factory = await BountyFactory.deploy();
        await factory.deployed();

        Bounty = await ethers.getContractFactory("Bounty");
    });

    it("Should create a new bounty", async function () {
        const tx = await factory.createBounty(
            "Bounty 1",
            "This is the first bounty",
            0x00,
            { value: ethers.utils.parseEther("1") }
        );
        await tx.wait();

        const bounty = await Bounty.attach(await factory.bounties(0));

        expect(await bounty.owner()).to.equal(await ethers.provider.getSigner(0).getAddress());
        expect(await ethers.provider.getBalance(bounty.address)).to.equal(ethers.utils.parseEther("1"));
        
        expect(await bounty.name()).to.equal("Bounty 1");
        expect(await bounty.description()).to.equal("This is the first bounty");
        expect(await bounty.dataCID()).to.equal("0x00");
        expect(await factory.bountyCount()).to.equal(1);
        expect(await factory.bountyOwners(0)).to.equal(await ethers.provider.getSigner(0).getAddress());
    });

    it("Should calculate future bounty address", async function () {
        const nonce = await ethers.provider.getTransactionCount(factory.address);
        const futureAddress = ethers.utils.getContractAddress({ from: factory.address, nonce: nonce });

        await expect(factory.createBounty(
            "Bounty 2",
            "This is the second bounty",
            0x00,
            { value: ethers.utils.parseEther("1") }
        )).to.emit(factory, "BountyCreated").withArgs(futureAddress);
        expect(await factory.bountyCount()).to.equal(2);
        expect(await factory.bountyOwners(1)).to.equal(await ethers.provider.getSigner(0).getAddress());
    });
});