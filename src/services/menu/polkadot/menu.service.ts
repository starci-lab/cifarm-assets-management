import { Injectable, Logger } from "@nestjs/common"
import { ReadlineService } from "../readline.service"
import {
    PolkadotAccountService,
    PolkadotRelayChainService,
} from "../../blockchain"
import { NetworkService } from "../../blockchain"
import { Network } from "@/config"
import { uiPrompts } from "../constants.menu"
import { PolkadotBifrostMenuService } from "./bifrost-menu.service"
import { PolkadotMoonbeamMenuService } from "./moonbeam.service"

@Injectable()
export class PolkadotMenuService {
    private readonly logger = new Logger(PolkadotMenuService.name)

    constructor(
    private readonly readlineService: ReadlineService,
    private readonly polkadotAccountService: PolkadotAccountService,
    private readonly relayChainService: PolkadotRelayChainService,
    private readonly bifrostMenuService: PolkadotBifrostMenuService,
    private readonly moonbeamMenuService: PolkadotMoonbeamMenuService,
    private readonly networkService: NetworkService,
    ) {}

    public continue() {
        this.readlineService.rl.question(uiPrompts().continue, async () => {
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
                "3. Manage tokens (Moonbeam)",
                "4. Manage nfts (Unique Network)",
            ]
        }

        if (!hide) {
            console.log(`Welcome to Polkadot. What do you want to do?
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
                    console.log(`Network: ${network === Network.Testnet ? "Testnet" : "Mainnet"}`)
                    console.log(`Relay Chain Balance: ${relayChainBalance}`)
                    this.continue()
                    break
                }
                case 3: {
                    console.clear()
                    await this.moonbeamMenuService.init()
                    this.moonbeamMenuService.print()
                    break
                }
                default: {
                    this.logger.error("This feature is not supported yet.")
                    this.print(true)
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
