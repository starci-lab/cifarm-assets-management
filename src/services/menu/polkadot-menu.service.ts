import { Injectable, Logger } from "@nestjs/common"
import { ReadlineService } from "./readline.service"
import { PolkadotAccountService } from "../blockchain"

@Injectable()
export class PolkadotMenuService {
    private readonly logger = new Logger(PolkadotMenuService.name)

    constructor(
        private readonly readlineService: ReadlineService,
        private readonly polkadotAccountService: PolkadotAccountService,
    ) {}
    //print menu as cli
    public async print(hide: boolean = false): Promise<void> {
        const activeAccount = await this.polkadotAccountService.retrieveActiveAccount()
        let list : Array<string> = []
        if (!activeAccount) {
            list = [
                "0. Create a new account",
            ]
        } else {
            list = [
                "0. Create a new account",
                "1. View active account",
                "2. Faucet the account",
                "3. Manage token (Bifrost)",
                "4. Manage nfts (Unique Network)"
            ]
        }

        if (!hide) {
            console.log(`Welcome to Polkadot. What do you want to do?
${list.join("\n")}
`)
        }      
        this.readlineService.rl.question("Enter your choice: ", async (answer) => {
            const selectedIndex = parseInt(answer)
            if (!isNaN(selectedIndex) && selectedIndex >= 0 && selectedIndex < list.length) {
                this.logger.verbose(`You selected: ${selectedIndex}`)
                // Handle interaction with the selected blockchain here
                switch (selectedIndex) {
                case 0: {
                    await this.polkadotAccountService.createAccount()
                    this.print(true)
                    break
                }
                case 1: {
                    //console log as table
                    console.table(activeAccount)
                }
                }
            } else {
                this.logger.error("Invalid choice. Please try again.")
                this.print(true)
            }
        })
    }
}
