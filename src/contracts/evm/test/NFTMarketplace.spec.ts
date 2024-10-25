import { expect } from "chai"
import { InitializeResult, initialize } from "./initialize"
import { SAMPLE_CID } from "./NFT.spec"

describe("NFTMarketplace", () => {
    let initialized: InitializeResult

    beforeEach(async () => {
        initialized = await initialize()
    })

    it("Test fee manager set fee rate and set fee to successfully", async function () {
        const { signers, contracts: {
            nftMarketplaceContract,
        }} = initialized
        
        const feeManager = await nftMarketplaceContract.FEE_MANAGER()
        await nftMarketplaceContract.grantRole(feeManager, signers[0].address)
        await nftMarketplaceContract.setFeeTo(signers[1].address)
        const feeTo = await nftMarketplaceContract.feeTo()
        expect(feeTo).to.be.eq(signers[1].address, "Fee to not signer 1")
        
        const newFeeRate = BigInt(400)
        await nftMarketplaceContract.setFeeRate(newFeeRate)
        const feeRate = await nftMarketplaceContract.feeRate()
        expect(feeRate).to.be.eq(newFeeRate, "Fee rate not equal")
    })

    it("Test non-fee manager set fee rate and set fee to failed", async function () {
        const { signers, contracts: {
            nftMarketplaceContract,
        }} = initialized
        
        expect(nftMarketplaceContract.setFeeTo(signers[1].address)).to.be.revertedWithCustomError(
            nftMarketplaceContract,
            "AccessControlUnauthorizedAccount"
        )
        const newFeeRate = BigInt(400)
        expect(nftMarketplaceContract.setFeeRate(newFeeRate)).to.be.revertedWithCustomError(
            nftMarketplaceContract,
            "AccessControlUnauthorizedAccount"
        )
    })

    it("Test list NFT with 100 CT", async function () {
        const { signers, contracts: {
            nftMarketplaceContract,
            nftContract,
        }} = initialized
        
        //mint nft to signer 2
        const nftMinter = await nftContract.MINTER()
        await nftContract.grantRole(nftMinter, signers[1].address)
        const tokenId = await nftContract
            .connect(signers[1])
            .getFunction("mint")
            .staticCall(signers[2].address, SAMPLE_CID)
        await nftContract
            .connect(signers[1])
            .mint(signers[2].address, SAMPLE_CID)

        //signer 2 list the token with 100 CT
        const nftMarketplaceContractAddress = await nftMarketplaceContract.getAddress()
        await nftContract.connect(signers[2]).approve(nftMarketplaceContractAddress, tokenId)
        await nftMarketplaceContract.connect(signers[2]).list(tokenId, "1000000000000000000000")
        const result = await nftMarketplaceContract.listings(tokenId)
        expect(result.seller).to.be.eq(signers[2].address, "Seller not address 2")
        expect(String(result.price)).to.be.eq("1000000000000000000000", "Sell quantity not 1000000000000000000000")
        
        //check nft holding by a contract
        const address = await nftContract.ownerOf(tokenId)
        expect(address).to.be.eq(nftMarketplaceContractAddress, "Holder is not the contract")
    })

    it("Test unlist NFT", async function () {
        const { signers, contracts: {
            nftMarketplaceContract,
            nftContract,
        }} = initialized
        
        //mint nft to signer 2
        const nftMinter = await nftContract.MINTER()
        await nftContract.grantRole(nftMinter, signers[1].address)
        const tokenId = await nftContract
            .connect(signers[1])
            .getFunction("mint")
            .staticCall(signers[2].address, SAMPLE_CID)
        await nftContract
            .connect(signers[1])
            .mint(signers[2].address, SAMPLE_CID)

        //signer 2 list the token with 100 CT
        const nftMarketplaceContractAddress = await nftMarketplaceContract.getAddress()
        await nftContract.connect(signers[2]).approve(nftMarketplaceContractAddress, tokenId)
        await nftMarketplaceContract.connect(signers[2]).list(tokenId, "1000000000000000000000")

        expect(nftMarketplaceContract.connect(signers[1]).unlist(tokenId)).to.be.revertedWithCustomError(
            nftMarketplaceContract,
            "SenderNotSeller"
        )
        await nftMarketplaceContract.connect(signers[2]).unlist(tokenId)
        const result = await nftMarketplaceContract.listings(tokenId)
        expect(result.seller).to.be.eq("0x0000000000000000000000000000000000000000", "Seller not null")
        expect(String(result.price)).to.be.eq("0", "Sell quantity not 0")

        //check signer2 get the NFT back
        const address = await nftContract.ownerOf(tokenId)
        expect(address).to.be.eq(signers[2].address, "Holder is not the contract")
    })

    it("Test buy NFT", async function () {
        const { signers, contracts: {
            nftMarketplaceContract,
            nftContract,
            tokenContract
        }} = initialized
        
        //mint nft to signer 2
        const nftMinter = await nftContract.MINTER()
        await nftContract.grantRole(nftMinter, signers[1].address)
        const tokenId = await nftContract
            .connect(signers[1])
            .getFunction("mint")
            .staticCall(signers[2].address, SAMPLE_CID)
        await nftContract
            .connect(signers[1])
            .mint(signers[2].address, SAMPLE_CID)

        //signer 2 list the token with 100 CT
        const nftMarketplaceContractAddress = await nftMarketplaceContract.getAddress()
        await nftContract.connect(signers[2]).approve(nftMarketplaceContractAddress, tokenId)
        await nftMarketplaceContract.connect(signers[2]).list(tokenId, "1000000000000000000000")

        //buyyy
        const tokenMinter = await tokenContract.MINTER()
        await tokenContract.grantRole(tokenMinter, signers[4].address)
        await tokenContract.connect(signers[4]).mint(signers[4].address, "4000000000000000000000")
        await tokenContract.connect(signers[4]).approve(nftMarketplaceContractAddress, "10000000000000000000000")
        await nftMarketplaceContract.connect(signers[4]).buy(tokenId)
        const address = await nftContract.connect(signers[4]).ownerOf(tokenId)
        expect(address).to.be.eq(signers[4].address, "Holder is not the 4")

        //check balance 3 đầu
        const balanceBuyer = await tokenContract.balanceOf(signers[4].address)
        expect(balanceBuyer).to.be.eq("3000000000000000000000", "Left is not 300 CT")
        
        const feeTo = await nftMarketplaceContract.feeTo()
        const balanceFeeTo = await tokenContract.balanceOf(feeTo)
        expect(balanceFeeTo).to.be.eq("3000000000000000000", "Fee is not 0.3 CT")
        const balanceSigner2 = await tokenContract.balanceOf(signers[2])
        expect(balanceSigner2).to.be.eq("997000000000000000000", "Net is not 99.7 CT")
    })
})