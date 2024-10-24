import { Injectable, Logger } from "@nestjs/common"
import { Network } from "@/config"
import "@polkadot/api-augment"
import { ApiPromise, WsProvider } from "@polkadot/api"
import { computeDenomination } from "@/utils"
import { PolkadotAccountService } from "./account.service"
import { NetworkService } from "../common"

@Injectable()
export class PolkadotRelayChainService {
    private readonly logger = new Logger(PolkadotRelayChainService.name)
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

        const relayChainRpcUrlMap: Record<Network, string> = {
            [Network.Mainnet]: "wss://rpc.polkadot.io",
            [Network.Testnet]: "wss://paseo.dotters.network",
        }
        const network = await this.networkService.getNetwork()
        const relayChainRpcUrl = relayChainRpcUrlMap[network]

        const wsProvider = new WsProvider(relayChainRpcUrl)
        const polkadotClient = await ApiPromise.create({ provider: wsProvider })

        const {
            data: { free: relayChain },
        } = await polkadotClient.query.system.account(account.address)
        return computeDenomination(relayChain.toBigInt(), 10)
    }
}
