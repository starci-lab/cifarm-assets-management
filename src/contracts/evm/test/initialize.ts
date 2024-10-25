import { ethers } from "hardhat"
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"
import {
    NFT,
    NFTMarketplace,
    NFTMarketplace__factory,
    NFT__factory,
    UnlimitedSupplyToken,
    UnlimitedSupplyToken__factory,
} from "../typechain-types"

export const initialize = async (): Promise<InitializeResult> => {
    //get the signers
    const signers = await ethers.getSigners()

    //nft contract deployments
    const nftFactory = new NFT__factory()
    const nftContract = await nftFactory
        .connect(signers[0])
        .deploy("CiFarm Premium Tile", "CPL")
    const nftAddress = await nftContract.getAddress()

    //token contract deployments
    const tokenFactory = new UnlimitedSupplyToken__factory()
    const tokenContract = await tokenFactory
        .connect(signers[0])
        .deploy("Chicken Token", "CT")
    const tokenAddress = await tokenContract.getAddress()

    const nftMarketplaceFactory = new NFTMarketplace__factory()
    const nftMarketplaceContract = await nftMarketplaceFactory
        .connect(signers[0])
        .deploy(tokenAddress, nftAddress)
    return {
        signers,
        contracts: {
            nftContract,
            nftMarketplaceContract,
            tokenContract,
        },
    }
}

export interface InitializeResult {
  signers: Array<HardhatEthersSigner>;
  contracts: {
    nftContract: NFT;
    nftMarketplaceContract: NFTMarketplace;
    tokenContract: UnlimitedSupplyToken;
  };
}
