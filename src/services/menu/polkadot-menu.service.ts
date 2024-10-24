import { Injectable, Logger } from "@nestjs/common"
import { ReadlineService } from "./readline.service"
import {
    PolkadotAccountService,
    PolkadotRelayChainService,
    PolkadotUniqueNetworkService,
} from "../blockchain"
import { NetworkService } from "../blockchain"
import { Network } from "@/config"

@Injectable()
export class PolkadotMenuService {
    private readonly logger = new Logger(PolkadotMenuService.name)

    constructor(
    private readonly readlineService: ReadlineService,
    private readonly polkadotAccountService: PolkadotAccountService,
    private readonly relayChainService: PolkadotRelayChainService,
    //private readonly bifrostService: PolkadotBifrostService,
    private readonly uniqueNetworkService: PolkadotUniqueNetworkService,
    private readonly networkService: NetworkService,
    ) {}

    public continue() {
        this.readlineService.rl.question("Press any key to continue...", async () => {
            console.clear()
            this.print()
        })
    }

    //print menu as cli
    public async print(hide: boolean = false): Promise<void> {
        const activeAccount =
      await this.polkadotAccountService.retrieveActiveAccount()
        let list: Array<string> = []
        if (!activeAccount) {
            list = ["0. Create a new account"]
        } else {
            list = [
                "0. Create a new account",
                "1. View active account",
                "2. View balance (Relay chain)",
                "3. Manage token (Bifrost)",
                "4. Manage nfts (Unique Network)",
            ]
        }

        if (!hide) {
            console.log(`Welcome to Polkadot. What do you want to do?
${list.join("\n")}
`)
        }
        this.readlineService.rl.question("Enter your choice: ", async (answer) => {
            const selectedIndex = parseInt(answer)
            if (
                !isNaN(selectedIndex) &&
        selectedIndex >= 0 &&
        selectedIndex < list.length
            ) {
                this.logger.verbose(`You selected: ${selectedIndex}`)
                // Handle interaction with the selected blockchain here
                switch (selectedIndex) {
                case 0: {
                    const account = await this.polkadotAccountService.createAccount()
                    console.table(account)
                    this.continue()
                    break
                }
                case 1: {
                    //console log as table
                    console.table(activeAccount)
                    this.continue()
                    break
                }
                case 2: {
                    const relayChainBalance = await this.relayChainService.getBalance()
                    const network = await this.networkService.getNetwork()
                    console.log(`Network: ${network === Network.Testnet ? "Testnet" : "Mainnet"}`)
                    console.log(`Relay Chain Balance: ${relayChainBalance}`)
                    this.continue()
                    break
                }
                }
            } else {
                this.logger.error("Invalid choice. Please try again.")
                this.print(true)
            }
        })
    }
}
