import { ethers } from "hardhat"

const grantRole = async () => {
    const nftContract = await ethers.getContractAt("NFT", "0x410d3e15058e8544B14FD1a317E330f693444673")
    // const minter = await nftContract.MINTER()
    //await nftContract.grantRole(minter, "0xf040893fd18D116E373CD0feA259EcC0194831B1")
    await nftContract.mint(BigInt(25), "0x9d9B7f5068C95B134Ef513F64d33c3d30E6D50e6", "https://ipfs.starci.net/ipfs/QmbH7UBfhDsxkdXLN2rGPKc2icRUDTdLKGqfsLifN454Zm")
    await nftContract.mint(BigInt(26), "0x9d9B7f5068C95B134Ef513F64d33c3d30E6D50e6", "https://ipfs.starci.net/ipfs/QmbH7UBfhDsxkdXLN2rGPKc2icRUDTdLKGqfsLifN454Zm")
    await nftContract.mint(BigInt(28), "0x9d9B7f5068C95B134Ef513F64d33c3d30E6D50e6", "https://ipfs.starci.net/ipfs/QmbH7UBfhDsxkdXLN2rGPKc2icRUDTdLKGqfsLifN454Zm")
}

grantRole()
//npx hardhat run --network fuji scripts/grant-roles.ts

// import { ethers } from "hardhat"

// const grantRole = async () => {
//     const tokenContract = await ethers.getContractAt("UnlimitedSupplyToken", "0xA9E72Ae9FfEc2a10AA9b6d617d1faf4953A2dADD")
//     const minter = await tokenContract.MINTER()
//     await tokenContract.grantRole(minter, "0xf040893fd18D116E373CD0feA259EcC0194831B1")
//     await tokenContract.mint("0x731A9Acd18C381CEb9129F88c127ED4e01a8A62F", BigInt(10e18))
//     await nftContract.mint(BigInt(9), "0xf040893fd18D116E373CD0feA259EcC0194831B1", "https://ipfs.starci.net/ipfs/QmbH7UBfhDsxkdXLN2rGPKc2icRUDTdLKGqfsLifN454Zm")
//     await nftContract.mint(BigInt(10), "0xf040893fd18D116E373CD0feA259EcC0194831B1", "https://ipfs.starci.net/ipfs/QmbH7UBfhDsxkdXLN2rGPKc2icRUDTdLKGqfsLifN454Zm")
// }

// grantRole()
//npx hardhat run --network fuji scripts/grant-roles.ts
