// import { Injectable, Logger } from "@nestjs/common"
// import { PolkadotAccountService } from "../account.service"

// @Injectable()
// export class PolkadotBifrostBaseService {
//     private readonly logger = new Logger(PolkadotBifrostBaseService.name)
//     constructor(
//         private readonly polkadotAccountService: PolkadotAccountService,
//         private readonly
//     ) {}

//     public async getBalance(): Promise<number> {
//         const account = await this.polkadotAccountService.retrieveActiveAccount()
//         if (!account) {
//             this.logger.error("No active account found.")
//             return
//         }
//         const network = await this.networkService.getNetwork()
//         const sdkClient = polkadotUniqueNetworkSdkClient(network)

//         const { decimals, total } = await sdkClient.balance.get({
//             address: account.address,
//         })
//         return computeDenomination(BigInt(total), decimals)
//     }public async 
// }