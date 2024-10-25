import { ethers } from "hardhat"

const deploy = async () => {
    const fixedSupplyToken = await ethers.deployContract("FixedSupplyToken", ["$CAULI Token", "$CAULI", "1000000000000000000000000"])
    await fixedSupplyToken.waitForDeployment()
    const fixedSupplyTokenAddress = await fixedSupplyToken.getAddress()
    console.log(`FixedSupplyToken deployed at: ${fixedSupplyTokenAddress}`)

    const unlimitedSupplyToken = await ethers.deployContract("UnlimitedSupplyToken", ["$CARROT Token", "$CARROT"])
    await unlimitedSupplyToken.waitForDeployment()
    const unlimitedSupplyTokenAddress = await unlimitedSupplyToken.getAddress()
    console.log(`UnlimitedSupplyToken deployed at: ${unlimitedSupplyTokenAddress}`)
}

deploy()

//npx hardhat run --network moonbeamAlpha scripts/polkadot-deploy-token-factory.ts