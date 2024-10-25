import { Injectable, Logger } from "@nestjs/common"
import { ethers, JsonRpcProvider, Wallet } from "ethers"
import { NetworkService } from "../../common"
import { moonbeamProvider } from "./client.moonbeam"
import { PolkadotAccountService } from "../account.service"
import { computeDenomination, computeRaw } from "@/utils"
import { TokenService } from "../../common"
import { SupportedChainKey } from "@/config"
import { erc20Abi } from "@/abis"

@Injectable()
export class PolkadotMoonbeamService {
    private readonly logger = new Logger(PolkadotMoonbeamService.name)
    private provider: JsonRpcProvider
    private wallet: Wallet
    constructor(
    private readonly networkService: NetworkService,
    private readonly polkadotAccountService: PolkadotAccountService,
    private readonly tokenService: TokenService,
    ) {}

    async connect() {
        const network = await this.networkService.getNetwork()
        this.provider = moonbeamProvider(network)
        const { evmPrivateKey } =
      await this.polkadotAccountService.retrieveActiveAccount()
        this.wallet = new Wallet(evmPrivateKey, this.provider)
    }

    public getAddress(): string {
        if (!this.wallet) {
            this.logger.error("Moonbeam wallet not connected.")
            throw new Error("Moonbeam wallet not connected.")
        }
        return this.wallet.address
    }

    public async getBalance(): Promise<number> {
        if (!this.wallet) {
            this.logger.error("Moonbeam wallet not connected.")
            throw new Error("Moonbeam wallet not connected.")
        }
        const balance = await this.wallet.provider.getBalance(this.wallet.address)
        // 18 is the default denomination for Ethereum
        return computeDenomination(balance, 18)
    }

    public async importToken(name: string, address: string) {
        await this.tokenService.setToken(name, address)
    }

    public async transfer(name: string, toAddress: string, amount: number) {
        if (!this.wallet) {
            this.logger.error("Moonbeam wallet not connected.")
            throw new Error("Moonbeam wallet not connected.")
        }
        const token = await this.tokenService.getToken(name, SupportedChainKey.Polkadot)
        if (!token) {
            this.logger.error(`Token ${name} not found.`)
            throw new Error(`Token ${name} not found.`)
        }
        
        const tokenContract = new ethers.Contract(token.address, erc20Abi, this.wallet)
        const tx = await tokenContract.getFunction("transfer").send(toAddress, computeRaw(amount, token.decimals))
        await this.provider.waitForTransaction(tx.hash)
        this.logger.log(`Transfer successful. Tx hash: ${tx.hash}`)
    }

    public async balanceOf(name: string) {
        if (!this.wallet) {
            this.logger.error("Moonbeam wallet not connected.")
            throw new Error("Moonbeam wallet not connected.")
        }
        const token = await this.tokenService.getToken(name, SupportedChainKey.Polkadot)
        if (!token) {
            this.logger.error(`Token ${name} not found.`)
            throw new Error(`Token ${name} not found.`)
        }
        const tokenContract = new ethers.Contract(token.address, erc20Abi, this.wallet)
        const balance = await tokenContract.getFunction("balanceOf").staticCall(this.wallet.address)
        return computeDenomination(balance, token.decimals)
    }

    public async mint(name: string, toAddress: string, amount: number) {
        if (!this.wallet) {
            this.logger.error("Moonbeam wallet not connected.")
            throw new Error("Moonbeam wallet not connected.")
        }
        const token = await this.tokenService.getToken(name, SupportedChainKey.Polkadot)
        if (!token) {
            this.logger.error(`Token ${name} not found.`)
            throw new Error(`Token ${name} not found.`)
        }
        this.logger.log(`Minting ${amount} ${name} to ${toAddress}...`)
        const tokenContract = new ethers.Contract(token.address, erc20Abi, this.wallet)
        const tx = await tokenContract.getFunction("mint").send(toAddress, computeRaw(amount, token.decimals))
        await this.provider.waitForTransaction(tx.hash)
        this.logger.log(`Mint successful. Tx hash: ${tx.hash}`)
    }
    
    public async hasRole(name: string, role: AccessLevelRole) {
        if (!this.wallet) {
            this.logger.error("Moonbeam wallet not connected.")
            throw new Error("Moonbeam wallet not connected.")
        }
        const token = await this.tokenService.getToken(name, SupportedChainKey.Polkadot)
        if (!token) {
            this.logger.error(`Token ${name} not found.`)
            throw new Error(`Token ${name} not found.`)
        }
        const tokenContract = new ethers.Contract(token.address, erc20Abi, this.wallet)
        const _role = await tokenContract.getFunction(role).staticCall()
        if (!_role) {
            this.logger.error(`Role ${role} not found.`)
            throw new Error(`Role ${role} not found.`)
        }
        return await tokenContract.getFunction("hasRole").staticCall(_role, this.getAddress())
    }

    public async grantRole(name: string, role: AccessLevelRole) {
        if (!this.wallet) {
            this.logger.error("Moonbeam wallet not connected.")
            throw new Error("Moonbeam wallet not connected.")
        }
        const token = await this.tokenService.getToken(name, SupportedChainKey.Polkadot)
        if (!token) {
            this.logger.error(`Token ${name} not found.`)
            throw new Error(`Token ${name} not found.`)
        }
        const tokenContract = new ethers.Contract(token.address, erc20Abi, this.wallet)
        const _role = await tokenContract.getFunction(role).staticCall()
        if (!_role) {
            this.logger.error(`Role ${role} not found.`)
            throw new Error(`Role ${role} not found.`)
        }
        
        const tx = await tokenContract.getFunction("grantRole").send(_role, this.getAddress())
        await this.provider.waitForTransaction(tx.hash)
        this.logger.log(`Role granted. Tx hash: ${tx.hash}`)
    }
}

export enum AccessLevelRole {
    Minter = "MINTER",
    Burner = "BURNER",
}
