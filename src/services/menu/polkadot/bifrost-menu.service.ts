import { Injectable, Logger } from "@nestjs/common"
import { ReadlineService } from "../readline.service"
import {
    PolkadotAccountService,
    PolkadotRelayChainService,
    PolkadotUniqueNetworkService,
} from "../../blockchain"
import { NetworkService } from "../../blockchain"
import { Network } from "@/config"
import { uiPrompts } from "../constants.menu"

@Injectable()
export class PolkadotBifrostMenuService {
    private readonly logger = new Logger(PolkadotBifrostMenuService.name)

    constructor(
    private readonly readlineService: ReadlineService,
    private readonly polkadotAccountService: PolkadotAccountService,
    private readonly relayChainService: PolkadotRelayChainService,
    //private readonly bifrostService: PolkadotBifrostService,
    private readonly uniqueNetworkService: PolkadotUniqueNetworkService,
    private readonly networkService: NetworkService,
    ) {}

    public continue() {
        this.readlineService.rl.question(
            uiPrompts().continue,
            () => {
                console.clear()
                this.print()
            },
        )
    }

    //print menu as cli
    public async print(hide: boolean = false): Promise<void> {
        const network = await this.networkService.getNetwork()
        const activeAccount =
      await this.polkadotAccountService.retrieveActiveAccount()
        const  list = [
            "0. View active account",
            "1. View balance",
            "3. Create token",
            `4. Switch network (Current: ${network})`,
        ]

        if (!hide) {
            console.log(`Welcome to token management in the Bifrost Parachain. What would you like to do?
${list.join("\n")}
`)
        }
        this.readlineService.rl.question(uiPrompts().enterChoice, async (answer) => {
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
                    console.log(
                        `Network: ${network === Network.Testnet ? "Testnet" : "Mainnet"}`,
                    )
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
