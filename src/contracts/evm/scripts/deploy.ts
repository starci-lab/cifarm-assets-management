import { writeFileSync, readFileSync } from "fs"
import { ethers } from "hardhat"
import path from "path"

interface Addresses {
  cauliflowerTokenAddress: string;
  carrotTokenAddress: string;
  nftAddress: string;
  nftMarketplaceAddress: string;
}
const filePath = path.resolve(__dirname, "addresses.txt")

const writeAddresses = async (addresses: Addresses): Promise<void> => {
    const addressesContent = `*****
Cauliflower Token Address: ${addresses.cauliflowerTokenAddress}
Carrot Token Address: ${addresses.carrotTokenAddress}
NFT Address: ${addresses.nftAddress}
NFT Marketplace Address: ${addresses.nftMarketplaceAddress}
*****`
    let content = ""
    try {
        content = readFileSync(filePath, "utf-8")
    } catch (ex: unknown) {
    //file not exist
        console.log(ex)
    }
    const newContent = `${content}
${addressesContent}`
    writeFileSync(filePath, newContent)
}

const deploy = async () => {
    const cauliflowerTokenContract = await ethers.deployContract(
        "FixedSupplyToken",
        ["$Cauliflower Token", "$CLT", "1000000000000000000000000000"]
    )
    await cauliflowerTokenContract.waitForDeployment()
    const cauliflowerTokenAddress = await cauliflowerTokenContract.getAddress()

    const carrotTokenContract = await ethers.deployContract(
        "UnlimitedSupplyToken",
        ["$Carrot Token", "$CRT"]
    )
    await carrotTokenContract.waitForDeployment()
    const carrotTokenAddress = await carrotTokenContract.getAddress()

    const nftContract = await ethers.deployContract("NFT", [
        "CiFarm Premium Tile",
        "CPT",
    ])
    await nftContract.waitForDeployment()
    const nftAddress = await nftContract.getAddress()

    const nftMarketplaceContract = await ethers.deployContract("NFTMarketplace", [
        cauliflowerTokenAddress,
        nftAddress,
    ])
    await nftMarketplaceContract.waitForDeployment()
    const nftMarketplaceAddress = await nftMarketplaceContract.getAddress()

    writeAddresses({
        carrotTokenAddress,
        cauliflowerTokenAddress,
        nftAddress,
        nftMarketplaceAddress,
    })
}

deploy()
//npx hardhat run --network fuji scripts/deploy.ts
