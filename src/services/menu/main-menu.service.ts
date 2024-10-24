import { Injectable, Logger } from "@nestjs/common"
import { blockchainConfig, SupportedChainKey } from "src/config"
import { valuesWithKey } from "src/utils"
import { PolkadotMenuService } from "./polkadot-menu.service"
import { ReadlineService } from "./readline.service"

@Injectable()
export class MainMenuService {
    private readonly logger = new Logger(MainMenuService.name)

    constructor(
        private readonly polkadotMenuService: PolkadotMenuService,
        private readonly readlineService: ReadlineService,
    ) {
    }
    //print menu as cli
    public print(hide: boolean = false): void {
        
        let list = ""
        const blockchainList = valuesWithKey(blockchainConfig())
        blockchainList.map((blockchain, index) => {
            list = list.concat(`${index}. ${blockchain.name} \n`)
        })
        
        if (!hide) {
            console.log(`
Welcome to CiFarm CLI 🌾. Which blockchain do you want to interact with?
${list}`)
        }
        
        this.readlineService.rl.question("Enter your choice: ", (choice: string) => {
            const selectedIndex = parseInt(choice)
            if (!isNaN(selectedIndex) && selectedIndex > 0 && selectedIndex <= blockchainList.length) {
                const selectedBlockchain = blockchainList[selectedIndex]
                this.logger.verbose(`You selected: ${selectedBlockchain.name}`)
                switch (selectedBlockchain.key) {
                case SupportedChainKey.Polkadot: {
                    this.polkadotMenuService.print()
                    break
                }
                default: {
                    this.logger.error("This blockchain is not supported yet.")
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
