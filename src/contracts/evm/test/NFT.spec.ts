import { expect } from "chai"
import { InitializeResult, initialize } from "./initialize"

export const BASE_URI="https://ipfs.io/ipfs/"
export const SAMPLE_CID =
  "bafybeifx7yeb55armcsxwwitkymga5xf53dxiarykms3ygqic223w5sk3m"
export const SAMPLE_IPFS = `${BASE_URI}${SAMPLE_CID}`
export const SAMPLE_CID_CHANGE = "starci"
export const SAMPLE_IPFS_CHANGE = `${BASE_URI}${SAMPLE_CID_CHANGE}`

describe("NFT", () => {
    let initialized: InitializeResult

    beforeEach(async () => {
        initialized = await initialize()
    })

    it("Should add minter successfully", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const minter = await nftContract.MINTER()
        await nftContract.grantRole(minter, signers[1].address)
        const hasRole = await nftContract.hasRole(minter, signers[1].address)
        expect(hasRole).to.eq(true, "Signer 1 do not have role minter")
        const hasRole2 = await nftContract.hasRole(minter, signers[2].address)
        expect(hasRole2).to.eq(false, "Signer 2 must not have role minter")
    })
    it("Should admin add burner successfully", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const burner = await nftContract.BURNER()
        await nftContract.grantRole(burner, signers[1].address)
        const hasRole = await nftContract.hasRole(burner, signers[1].address)
        expect(hasRole).to.eq(true, "Signer 1 do not have role burner")
        const hasRole2 = await nftContract.hasRole(burner, signers[2].address)
        expect(hasRole2).to.eq(false, "Signer 2 must not have role burner")
    })
    it("Should admin add updater successfully", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const updater = await nftContract.UPDATER()
        await nftContract.grantRole(updater, signers[1].address)
        const hasRole = await nftContract.hasRole(updater, signers[1].address)
        expect(hasRole).to.eq(true, "Signer 1 do not have role updater")
        const hasRole2 = await nftContract.hasRole(updater, signers[2].address)
        expect(hasRole2).to.eq(false, "Signer 2 must not have role updater")
    })
    it("Should minter mint successfully", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const minter = await nftContract.MINTER()
        await nftContract.grantRole(minter, signers[1].address)
        const tokenId = await nftContract
            .connect(signers[1])
            .getFunction("mint")
            .staticCall(signers[2].address, SAMPLE_CID)
        await nftContract
            .connect(signers[1])
            .mint(signers[2].address, SAMPLE_CID)
        const cid = await nftContract.tokenURI(tokenId)
        expect(cid).to.eq(SAMPLE_IPFS, "Mint failed")
    })
    it("Should mint 100 NFTs successfully", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const minter = await nftContract.MINTER()
        await nftContract.grantRole(minter, signers[1].address)
        for (let i = 0; i < 100; i++) {
            const tokenId = await nftContract
                .connect(signers[1])
                .getFunction("mint")
                .staticCall(signers[2].address, SAMPLE_CID)
            await nftContract
                .connect(signers[1])
                .mint(signers[2].address, SAMPLE_CID)
            const cid = await nftContract.tokenURI(tokenId)
            expect(cid).to.eq(SAMPLE_IPFS, "Mint failed")
        }
    })
    it("Should non-minter mint failed", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        expect(
            nftContract.connect(signers[1]).mint(signers[2].address, SAMPLE_CID)
        ).to.be.revertedWithCustomError(
            nftContract,
            "AccessControlUnauthorizedAccount"
        )
    })
    it("Should burner burn successfully", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const minter = await nftContract.MINTER()
        await nftContract.grantRole(minter, signers[1].address)
        const tokenId = await nftContract
            .connect(signers[1])
            .getFunction("mint")
            .staticCall(signers[2].address, SAMPLE_CID)
        await nftContract
            .connect(signers[1])
            .mint(signers[2].address, SAMPLE_CID)

        //burn
        const burner = await nftContract.BURNER()
        await nftContract.grantRole(burner, signers[2].address)
        await nftContract.connect(signers[2]).burn(tokenId)
        //check
        expect(nftContract.tokenURI(tokenId)).to.be.revertedWithCustomError(
            nftContract,
            "ERC721NonexistentToken"
        )
    })
    it("Should non-burner burn failed", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const minter = await nftContract.MINTER()
        await nftContract.grantRole(minter, signers[1].address)
        const tokenId = await nftContract
            .connect(signers[1])
            .getFunction("mint")
            .staticCall(signers[2].address, SAMPLE_CID)
        await nftContract
            .connect(signers[1])
            .mint(signers[2].address, SAMPLE_CID)

        //burn
        expect(
            nftContract.connect(signers[2]).burn(tokenId)
        ).to.be.revertedWithCustomError(
            nftContract,
            "AccessControlUnauthorizedAccount"
        )
    })
    it("Should non-admin grant role failed", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const minter = await nftContract.MINTER()
        expect(
            nftContract.connect(signers[1]).grantRole(minter, signers[2])
        ).to.be.revertedWithCustomError(
            nftContract,
            "AccessControlUnauthorizedAccount"
        )
    })
    it("Should updater update token URI successfully", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const minter = await nftContract.MINTER()
        await nftContract.grantRole(minter, signers[1].address)
        const tokenId = await nftContract
            .connect(signers[1])
            .getFunction("mint")
            .staticCall(signers[2].address, SAMPLE_CID)
        await nftContract
            .connect(signers[1])
            .mint(signers[2].address, SAMPLE_CID)

        //update
        const updater = await nftContract.UPDATER()
        await nftContract.grantRole(updater, signers[2].address)
        await nftContract
            .connect(signers[2])
            .updateTokenURI(tokenId, SAMPLE_CID_CHANGE)
            //check
        const newTokenURI = await nftContract.tokenURI(tokenId)
        expect(newTokenURI, SAMPLE_IPFS_CHANGE)
    })
    it("Should non-updater update token URI failed", async function () {
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const minter = await nftContract.MINTER()
        await nftContract.grantRole(minter, signers[1].address)
        const tokenId = await nftContract
            .connect(signers[1])
            .getFunction("mint")
            .staticCall(signers[2].address, SAMPLE_CID)
        await nftContract
            .connect(signers[1])
            .mint(signers[2].address, SAMPLE_CID)

        //update
        expect(
            nftContract
                .connect(signers[2])
                .updateTokenURI(tokenId, SAMPLE_CID_CHANGE)
        ).to.be.revertedWithCustomError(
            nftContract,
            "AccessControlUnauthorizedAccount"
        )
    })
    it("Should transfer NFT successfully", async function () {
        //mint to signer2
        const {
            contracts: { nftContract },
            signers,
        } = initialized
        const minter = await nftContract.MINTER()
        await nftContract.grantRole(minter, signers[1].address)
        const tokenId = await nftContract
            .connect(signers[1])
            .getFunction("mint")
            .staticCall(signers[2].address, SAMPLE_CID)
        await nftContract
            .connect(signers[1])
            .mint(signers[2].address, SAMPLE_CID)
            //signer 2 transfer to signer 3
        const address = await nftContract.getAddress()
        await nftContract
            .connect(signers[2])
            .approve(address, tokenId)
        await nftContract
            .connect(signers[2])
            .transferFrom(signers[2], signers[3].address, tokenId)
            //check result
        const cid = await nftContract
            .connect(signers[3])
            .tokenURI(tokenId)
        expect(cid, SAMPLE_IPFS)
    })
})
