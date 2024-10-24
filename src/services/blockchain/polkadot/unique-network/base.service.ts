import { Injectable, Logger } from "@nestjs/common"
import { PolkadotAccountService } from "../account.service"
import { polkadotUniqueNetworkSdkClient } from "./client.unique-network"
import { computeDenomination } from "@/utils"
import { NetworkService } from "../../common"

@Injectable()
export class PolkadotUniqueNetworkService {
    private readonly logger = new Logger(PolkadotUniqueNetworkService.name)

    constructor(
    private readonly polkadotAccountService: PolkadotAccountService,
    private readonly networkService: NetworkService,
    ) {}

    public async getBalance(): Promise<number> {
        const account = await this.polkadotAccountService.retrieveActiveAccount()
        if (!account) {
            this.logger.error("No active account found.")
            return
        }
        const network = await this.networkService.getNetwork()
        const sdkClient = polkadotUniqueNetworkSdkClient(network)

        const { decimals, total } = await sdkClient.balance.get({
            address: account.address,
        })
        return computeDenomination(BigInt(total), decimals)
    }
}
