import { Injectable, Logger } from "@nestjs/common"
import { JsonRpcProvider, Wallet } from "ethers"
import { NetworkService } from "../../common"
import { moonbeamProvider } from "./client.moonbeam"
import { PolkadotAccountService } from "../account.service"
import { computeDenomination } from "@/utils"
import { DataSource } from "typeorm"
import { TokenEntity } from "@/database"

@Injectable()
export class PolkadotMoonbeamService {
    private readonly logger = new Logger(PolkadotMoonbeamService.name)
    private provider: JsonRpcProvider
    private wallet: Wallet
    constructor(
    private readonly networkService: NetworkService,
    private readonly polkadotAccountService: PolkadotAccountService,
    private readonly dataSource: DataSource
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
        await this.dataSource.manager.save(TokenEntity, {
            name,
            address
        })
        this.logger.log(`Token ${name} imported with address ${address}`)
    }
}
